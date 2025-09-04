import styled from 'styled-components'
import { IoNotifications } from 'react-icons/io5'
import { IoNotificationsOutline } from 'react-icons/io5'
import PageHeader from '../components/PageHeader'
import { NotificationService } from '../NotificationService'
import { useNavigate } from 'react-router-dom'

export default function MyPage() {
  const navigate = useNavigate()
  return (
    <Wrap>
      <PageHeader title="마이 페이지" />

      <ProfileCard>
        <ProfileLeft>
          <ProfileIcon>👤</ProfileIcon>
          <ProfileInfo>
            <ProfileName>사용자</ProfileName>
            <ProfileEmail>123@gmail.com</ProfileEmail>
          </ProfileInfo>
        </ProfileLeft>
        <EditButton>내 정보 수정</EditButton>
      </ProfileCard>

      <Section>
        <SectionTitle>활동</SectionTitle>
        <ActivityList>
          <ActivityItem>내가 쓴 글</ActivityItem>
          <ActivityItem onClick={()=> navigate('/training-record')}>마음 훈련 기록</ActivityItem>
          <ActivityItem>신청한 활동</ActivityItem>
          <ActivityItem>찜한 활동</ActivityItem>
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
            <ToggleSwitch active={true} />
          </AlertItem>
          <AlertItem>
            <AlertInfo>
              <AlertTitle>찜한 활동 알림</AlertTitle>
              <AlertDesc>찜한 활동의 신청이 마감되기 전에 알려드려요</AlertDesc>
            </AlertInfo>
            <ToggleSwitch active={true} />
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
        <LogoutButton>로그아웃</LogoutButton>
        <WithdrawalButton>회원 탈퇴</WithdrawalButton>
      </BottomOptions>
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
  background: ${props => props.active ? 'var(--primary)' : 'var(--muted)'};
  border-radius: 1.2rem;
  position: relative;
  cursor: pointer;
  
  &::after {
    content: '';
    position: absolute;
    top: 0.2rem;
    left: ${props => props.active ? '2.6rem' : '0.2rem'};
    width: 2rem;
    height: 2rem;
    background: white;
    border-radius: 50%;
    transition: left 0.2s ease;
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
