import styled from 'styled-components'
import { IoNotifications } from 'react-icons/io5'
import { IoNotificationsOutline } from 'react-icons/io5'
import { X, User } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { NotificationService } from '../services/notificationService.jsx'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import useNotificationStore from '../stores/notificationStore'

export default function MyPage() {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const { notificationSettings, toggleNotification: toggleNotificationSetting } = useNotificationStore()
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  // Edit profile states
  const [tempNickname, setTempNickname] = useState(currentUser?.nickname || '사용자')
  const [userInfo, setUserInfo] = useState(null)
  const [trainingProgress, setTrainingProgress] = useState(null)
  const [myComments, setMyComments] = useState([])
  
  
  // 사용자 정보 조회
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('/api/v1/members/mypage')
        if (response.data && response.data.success) {
          setUserInfo(response.data.data)
        }
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error)
      }
    }
    
    if (currentUser) {
      fetchUserInfo()
    }
  }, [currentUser])

  // 마음 훈련 기록 현황 조회
  useEffect(() => {
    const fetchTrainingProgress = async () => {
      try {
        if (currentUser?.id) {
          const response = await axios.get(`/api/v1/answers/progress/${currentUser.id}`)
          if (response.data && response.data.success) {
            setTrainingProgress(response.data.data)
          }
        }
      } catch (error) {
        console.error('마음 훈련 기록 조회 실패:', error)
      }
    }
    
    if (currentUser?.id) {
      fetchTrainingProgress()
    }
  }, [currentUser])

  // 내 댓글 목록 조회
  useEffect(() => {
    const fetchMyComments = async () => {
      try {
        if (currentUser?.id) {
          const response = await axios.get(`/api/v1/comments/my?page=0&size=10`)
          if (response.data && response.data.success) {
            setMyComments(response.data.data?.content || [])
          }
        }
      } catch (error) {
        console.error('내 댓글 목록 조회 실패:', error)
      }
    }
    if (currentUser?.id) {
      fetchMyComments()
    }
  }, [currentUser])

  const handleEditProfile = () => {
    setTempNickname(userInfo?.nickname || currentUser?.nickname || '사용자')
    setShowEditModal(true)
  }
  
  const handleSaveProfile = async () => {
    try {
      const response = await axios.put('/api/v1/members/me', {
        nickname: tempNickname,
        profileImageUrl: userInfo?.profileImageUrl || null
      })
      
      if (response.data && response.data.success) {
        // 사용자 정보 다시 조회
        const updatedResponse = await axios.get('/api/v1/members/me')
        if (updatedResponse.data && updatedResponse.data.success) {
          setUserInfo(updatedResponse.data.data)
        }
        
        toast.success('프로필이 수정되었습니다.')
        setShowEditModal(false)
      }
    } catch (error) {
      console.error('프로필 수정 실패:', error)
      toast.error('프로필 수정에 실패했습니다.')
    }
  }
  
  const handleCancelEdit = () => {
    setShowEditModal(false)
  }
  
  const handleLogoutClick = () => {
    setShowLogoutModal(true)
  }
  
  const confirmLogout = async () => {
    await logout()
    toast.success('로그아웃 되었습니다.')
    navigate('/login')
  }
  
  const cancelLogout = () => {
    setShowLogoutModal(false)
  }
  
  const handleDeleteAccountClick = () => {
    setShowDeleteModal(true)
  }
  
  const confirmDeleteAccount = () => {
    logout()
    toast.success('계정이 삭제되었습니다.')
    navigate('/login')
  }
  
  const cancelDeleteAccount = () => {
    setShowDeleteModal(false)
  }
  

  return (
    <Wrap>
      <PageHeader title="마이 페이지" />

      <ProfileCard>
        <ProfileLeft>
          <ProfileIcon>👤</ProfileIcon>
          <ProfileInfo>
            <ProfileName>{userInfo?.nickname || currentUser?.nickname || '사용자'}</ProfileName>
            <ProfileEmail>{userInfo?.email || currentUser?.email || '123@gmail.com'}</ProfileEmail>
          </ProfileInfo>
        </ProfileLeft>
        <EditButton onClick={handleEditProfile}>내 정보 수정</EditButton>
      </ProfileCard>

      <Section>
        <SectionTitle>활동</SectionTitle>
        <ActivityList>
          <ActivityItem onClick={() => navigate('/my-posts')}>
            <ActivityItemContent>
              <span>내가 쓴 글</span>
            </ActivityItemContent>
          </ActivityItem>
          <ActivityItem onClick={()=> navigate('/training-record')}>
            <ActivityItemContent>
              <span>마음 훈련 기록</span>
              {trainingProgress && (
                <ActivityProgress>
                  총 {trainingProgress.totalTrainedSessions}회 • 완료율 {trainingProgress.averageCompletion}%
                </ActivityProgress>
              )}
            </ActivityItemContent>
          </ActivityItem>
          <ActivityItem onClick={() => navigate('/applications')}>신청한 활동</ActivityItem>
          <ActivityItem onClick={() => navigate('/favorites')}>찜한 활동</ActivityItem>
        </ActivityList>
      </Section>

      <Section>
        <SectionTitle>알림</SectionTitle>
        <AlertList>
          <AlertItem>
            <AlertInfo>
              <AlertTitle>감정 기록 알림</AlertTitle>
              <AlertDesc>매일 저녁에 감정 기록 알림을 드려요</AlertDesc>
            </AlertInfo>
            <ToggleSwitch 
              $active={notificationSettings.emotionRecord} 
              onClick={() => toggleNotificationSetting('emotionRecord')}
            />
          </AlertItem>
          <AlertItem>
            <AlertInfo>
              <AlertTitle>찜한 활동 알림</AlertTitle>
              <AlertDesc>찜한 활동의 신청이 마감되기 전에 알려드려요</AlertDesc>
            </AlertInfo>
            <ToggleSwitch 
              $active={notificationSettings.favoriteActivity} 
              onClick={() => toggleNotificationSetting('favoriteActivity')}
            />
          </AlertItem>
        </AlertList>
      </Section>

      <Section>
        <SectionTitle>알림 테스트</SectionTitle>
        <TestList>
          <TestItem onClick={()=> NotificationService.showTestEmotionNotification()}>
            <TestIcon color="#8A79BA">
              <IoNotifications />
            </TestIcon>
            <TestText>감정 기록 알림 테스트</TestText>
          </TestItem>
          <TestItem onClick={()=> NotificationService.showTestFavoriteNotification()}>
            <TestIcon color="#FF6B35">
              <IoNotificationsOutline />
            </TestIcon>
            <TestText>찜한 활동 알림 테스트</TestText>
          </TestItem>
        </TestList>
      </Section>

      <BottomOptions>
        <LogoutButton onClick={handleLogoutClick}>로그아웃</LogoutButton>
        <WithdrawalButton onClick={handleDeleteAccountClick}>회원 탈퇴</WithdrawalButton>
      </BottomOptions>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <ModalOverlay>
          <ModalContainer>
            {/* Modal Header */}
            <ModalHeader>
              <ModalTitle>내정보수정</ModalTitle>
              <CloseButton onClick={handleCancelEdit}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>

            {/* Profile Photo Section */}
            <ProfilePhotoSection>
              <ProfilePhotoContainer>
                <User size={32} />
              </ProfilePhotoContainer>
              <PhotoEditButton>사진 수정</PhotoEditButton>
            </ProfilePhotoSection>

            {/* Nickname Input */}
            <InputSection>
              <InputLabel>닉네임</InputLabel>
              <ModalInput
                value={tempNickname}
                onChange={(e) => setTempNickname(e.target.value)}
                placeholder="닉네임을 입력하세요"
              />
            </InputSection>

            {/* Save Button */}
            <SaveButton onClick={handleSaveProfile}>
              저장
            </SaveButton>
          </ModalContainer>
        </ModalOverlay>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <ModalOverlay>
          <ModalContainer>
            {/* Close Button */}
            <ModalCloseButton>
              <CloseButton onClick={cancelLogout}>
                <X size={24} />
              </CloseButton>
            </ModalCloseButton>

            {/* Modal Content */}
            <ModalContent>
              <ModalMessage>로그아웃 하시겠습니까?</ModalMessage>

              {/* Action Buttons */}
              <ActionButtons>
                <ActionButton onClick={cancelLogout}>
                  취소
                </ActionButton>
                <ActionButton onClick={confirmLogout}>
                  로그아웃
                </ActionButton>
              </ActionButtons>
            </ModalContent>
          </ModalContainer>
        </ModalOverlay>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <ModalOverlay>
          <ModalContainer>
            {/* Close Button */}
            <ModalCloseButton>
              <CloseButton onClick={cancelDeleteAccount}>
                <X size={24} />
              </CloseButton>
            </ModalCloseButton>

            {/* Modal Content */}
            <ModalContent>
              <ModalMessage>탈퇴하시겠습니까?</ModalMessage>

              {/* Action Buttons */}
              <ActionButtons>
                <ActionButton onClick={cancelDeleteAccount}>
                  취소
                </ActionButton>
                <ActionButton onClick={confirmDeleteAccount}>
                  탈퇴
                </ActionButton>
              </ActionButtons>
            </ModalContent>
          </ModalContainer>
        </ModalOverlay>
      )}
    </Wrap>
  )
}

const Wrap = styled.div`
  padding: 0 1.6rem;
`

const ProfileCard = styled.div`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 1.2rem;
  padding: 1.6rem;
  margin-bottom: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`

const ProfileLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`

const ProfileIcon = styled.div`
  width: 4.8rem;
  height: 4.8rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #E5E1F7, #CFC7F0);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  box-shadow: 0 6px 14px rgba(0,0,0,0.06);
  font-size: 2.4rem;
`

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`

const ProfileName = styled.h2`
  margin: 0;
  font-size: 1.8rem;
`

const ProfileEmail = styled.p`
  margin: 0;
  color: var(--muted-foreground);
  font-size: 1.4rem;
`

const EditButton = styled.button`
  background: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: 0.8rem;
  padding: 1.2rem;
  font-size: 1.6rem;
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: filter 0.15s ease;
  &:hover { filter: brightness(0.96); }
`

const Section = styled.section`
  margin-bottom: 2.4rem;
`

const SectionTitle = styled.h3`
  margin: 0 0 1.2rem 0;
  font-size: 1.6rem;
`

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`

const ActivityItem = styled.button`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 0.8rem;
  padding: 1.2rem;
  text-align: left;
  font-size: 1.6rem;
  color: var(--foreground);
  cursor: pointer;
  transition: background 0.15s ease;
  &:hover { background: var(--muted); }
`

const ActivityItemContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.4rem;
  width: 100%;
`

const ActivityProgress = styled.span`
  font-size: 1.2rem;
  color: var(--muted-foreground);
  font-weight: 400;
`

const AlertList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`

const AlertItem = styled.div`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 0.8rem;
  padding: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const AlertInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`

const AlertTitle = styled.h4`
  margin: 0;
  font-size: 1.6rem;
`

const AlertDesc = styled.p`
  margin: 0;
  color: var(--muted-foreground);
  font-size: 1.4rem;
`

const ToggleSwitch = styled.div`
  width: 4.8rem;
  height: 2.4rem;
  background: ${props => props.$active ? 'var(--primary)' : 'var(--muted)'};
  border-radius: 1.2rem;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${props => props.$active ? 'var(--primary-hover, #6B5A9E)' : 'var(--muted-hover, #E5E5E5)'};
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0.2rem;
    left: ${props => props.$active ? '2.6rem' : '0.2rem'};
    width: 2rem;
    height: 2rem;
    background: white;
    border-radius: 50%;
    transition: left 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`

const TestList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`

const TestItem = styled.button`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 0.8rem;
  padding: 1.2rem;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  text-align: left;
  font-size: 1.6rem;
  color: var(--foreground);
`

const TestIcon = styled.div`
  color: ${props => props.color};
  font-size: 1.8rem;
`

const TestText = styled.span``

const BottomOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  margin-top: 3.2rem;
  padding-bottom: 2.4rem;
`

const LogoutButton = styled.button`
  background: transparent;
  border: none;
  color: var(--muted-foreground);
  font-size: 1.6rem;
  text-align: left;
  padding: 0.8rem 0;
`

const WithdrawalButton = styled.button`
  background: transparent;
  border: none;
  color: var(--destructive);
  font-size: 1.6rem;
  text-align: left;
  padding: 0.8rem 0;
`

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1.6rem;
`

const ModalContainer = styled.div`
  background: white;
  border-radius: 1.6rem;
  width: 100%;
  max-width: 24rem;
  margin: 0 auto;
  position: relative;
  padding: 2.4rem;
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.4rem;
`

const ModalTitle = styled.h2`
  font-weight: 500;
  color: #333333;
  margin: 0;
  font-size: 1.8rem;
`

const CloseButton = styled.button`
  padding: 0.4rem;
  color: #333333;
  background: none;
  border: none;
  border-radius: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f5f5f5;
  }
`

const ProfilePhotoSection = styled.div`
  text-align: center;
  margin-bottom: 2.4rem;
`

const ProfilePhotoContainer = styled.div`
  width: 8rem;
  height: 8rem;
  background: #F2F2FC;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #E0D9F0;
  margin: 0 auto 1.6rem;
  color: #8A79BA;
`

const PhotoEditButton = styled.button`
  background: none;
  border: none;
  color: #333333;
  font-size: 1.4rem;
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: #8A79BA;
  }
`

const InputSection = styled.div`
  margin-bottom: 2.4rem;
`

const InputLabel = styled.label`
  display: block;
  font-size: 1.4rem;
  font-weight: 500;
  color: #333333;
  margin-bottom: 0.8rem;
`

const ModalInput = styled.input`
  width: 100%;
  border: 1px solid #E0D9F0;
  border-radius: 0.8rem;
  padding: 1.2rem;
  font-size: 1.4rem;
  color: #333333;
  
  &:focus {
    outline: none;
    border-color: #8A79BA;
  }
  
  &::placeholder {
    color: #AAAAAA;
  }
`

const SaveButton = styled.button`
  width: 100%;
  background: #8A79BA;
  color: white;
  border: none;
  border-radius: 0.8rem;
  padding: 1.2rem;
  font-size: 1.6rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #6B5A9E;
  }
`

const ModalCloseButton = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1.6rem 1.6rem 0 0;
`

const ModalContent = styled.div`
  padding: 0 2.4rem 2.4rem;
`

const ModalMessage = styled.h2`
  text-align: center;
  font-size: 1.8rem;
  font-weight: 500;
  color: #333333;
  margin: 0 0 3.2rem 0;
`

const ActionButtons = styled.div`
  display: flex;
`

const ActionButton = styled.button`
  flex: 1;
  padding: 1.6rem;
  color: #333333;
  font-weight: 500;
  border-top: 1px solid #E0D9F0;
  background: none;
  border-bottom: none;
  border-left: none;
  border-right: none;
  cursor: pointer;
  transition: background 0.2s;
  
  &:first-child {
    border-right: 1px solid #E0D9F0;
  }
  
  &:hover {
    background: #F2F2FC;
  }
`
