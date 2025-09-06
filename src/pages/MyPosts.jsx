import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Home, Star, Users, Brain, Heart, MessageCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'
import styled from 'styled-components'

export default function MyPosts() {
  const navigate = useNavigate()
  const { currentUser, isLoading } = useAuth()
  const [activeContentTab, setActiveContentTab] = useState('게시글')
  
  // API 데이터 상태 (초기 더미 데이터 포함)
  const [myPosts, setMyPosts] = useState([
    {
      id: 1,
      title: '오늘의 감정 기록',
      content: '오늘은 정말 좋은 하루였어요. 친구들과 만나서 즐거운 시간을 보냈습니다.',
      postCategory: 'POST',
      createdAt: '2024-08-20T10:00:00.000Z',
      likeCount: 5,
      commentCount: 3
    },
    {
      id: 2,
      title: '마음 훈련 후기',
      content: '명상 프로그램을 통해 마음이 많이 편안해졌어요. 추천합니다!',
      postCategory: 'POST',
      createdAt: '2024-08-18T14:30:00.000Z',
      likeCount: 8,
      commentCount: 2
    }
  ])
  const [myComments, setMyComments] = useState([
    {
      id: 1,
      content: '정말 좋은 글이네요! 공감합니다.',
      postId: 1,
      postTitle: '오늘의 감정 기록',
      createdAt: '2024-08-20T11:00:00.000Z',
      likeCount: 2
    },
    {
      id: 2,
      content: '저도 비슷한 경험이 있어요. 힘내세요!',
      postId: 2,
      postTitle: '마음 훈련 후기',
      createdAt: '2024-08-18T15:00:00.000Z',
      likeCount: 1
    },
    {
      id: 3,
      content: '추천해주신 프로그램 궁금하네요.',
      postId: 2,
      postTitle: '마음 훈련 후기',
      createdAt: '2024-08-18T16:30:00.000Z',
      likeCount: 0
    }
  ])
  const [myReviews, setMyReviews] = useState([
    {
      id: 1,
      title: '청년직업역량개발 프로그램 후기',
      content: '정말 유익한 프로그램이었어요. 디자인에 대한 새로운 시각을 얻었습니다.',
      postCategory: 'REVIEW',
      activityId: 1,
      activityTitle: '청년직업역량개발 [도전! 디자이너!] 프로그램',
      rating: 5,
      createdAt: '2024-08-15T09:00:00.000Z',
      likeCount: 12,
      commentCount: 5
    },
    {
      id: 2,
      title: '마음 성장 보드게임 후기',
      content: '보드게임을 통해 자신감이 많이 향상되었어요. 추천합니다!',
      postCategory: 'REVIEW',
      activityId: 2,
      activityTitle: '자신감UP! 관계소통UP! 마음 성장 보드게임',
      rating: 4,
      createdAt: '2024-08-10T16:00:00.000Z',
      likeCount: 8,
      commentCount: 3
    }
  ])
  const [dataLoading, setDataLoading] = useState(false)

  // 사용자 정보가 없으면 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoading && !currentUser) {
      toast.error('로그인이 필요합니다.')
      navigate('/login')
    }
  }, [currentUser, isLoading, navigate])

  // 로컬스토리지에서 내가 쓴 글/후기 데이터 로드
  useEffect(() => {
    const loadMyData = () => {
      try {
        // 로컬스토리지에서 내가 쓴 게시글 로드
        const savedMyPosts = JSON.parse(localStorage.getItem('myPosts') || '[]')
        if (savedMyPosts.length > 0) {
          setMyPosts(savedMyPosts)
        }
        // 로컬스토리지에 데이터가 없으면 더미 데이터 사용 (이미 useState에서 초기화됨)
        
        // 로컬스토리지에서 내가 쓴 후기 로드
        const savedMyReviews = JSON.parse(localStorage.getItem('myReviews') || '[]')
        if (savedMyReviews.length > 0) {
          setMyReviews(savedMyReviews)
        }
        // 로컬스토리지에 데이터가 없으면 더미 데이터 사용 (이미 useState에서 초기화됨)
      } catch (error) {
        console.log('로컬스토리지에서 내 데이터 로드 실패, 기본 더미 데이터 사용:', error.message)
      }
    }
    
    loadMyData()
  }, [])

  // 로컬스토리지에서 내가 쓴 게시글 조회 (더 이상 API 호출하지 않음)
  const fetchMyPosts = () => {
    try {
      const savedMyPosts = JSON.parse(localStorage.getItem('myPosts') || '[]')
      if (savedMyPosts.length > 0) {
        setMyPosts(savedMyPosts)
      }
    } catch (error) {
      console.error('내 게시글 조회 실패:', error)
    }
  }

  // 로컬스토리지에서 내가 쓴 댓글 조회 (더 이상 API 호출하지 않음)
  const fetchMyComments = () => {
    try {
      // 댓글은 더미 데이터만 사용
      setMyComments([
        {
          id: 1,
          content: '정말 좋은 글이네요! 공감합니다.',
          postId: 1,
          postTitle: '오늘의 감정 기록',
          createdAt: '2024-08-20T11:00:00.000Z',
          likeCount: 2
        },
        {
          id: 2,
          content: '저도 비슷한 경험이 있어요. 힘내세요!',
          postId: 2,
          postTitle: '마음 훈련 후기',
          createdAt: '2024-08-18T15:00:00.000Z',
          likeCount: 1
        },
        {
          id: 3,
          content: '추천해주신 프로그램 궁금하네요.',
          postId: 2,
          postTitle: '마음 훈련 후기',
          createdAt: '2024-08-18T16:30:00.000Z',
          likeCount: 0
        }
      ])
    } catch (error) {
      console.error('내 댓글 조회 실패:', error)
    }
  }

  // 로컬스토리지에서 내가 쓴 후기 조회 (더 이상 API 호출하지 않음)
  const fetchMyReviews = () => {
    try {
      const savedMyReviews = JSON.parse(localStorage.getItem('myReviews') || '[]')
      if (savedMyReviews.length > 0) {
        setMyReviews(savedMyReviews)
      }
    } catch (error) {
      console.error('내 후기 조회 실패:', error)
    }
  }

  // 탭 변경 시 해당 데이터 로드
  useEffect(() => {
    if (currentUser?.id) {
      switch (activeContentTab) {
        case '게시글':
          fetchMyPosts()
          break
        case '댓글':
          fetchMyComments()
          break
        case '후기':
          fetchMyReviews()
          break
        default:
          break
      }
    }
  }, [activeContentTab, currentUser?.id])

  // 페이지 포커스 시 데이터 새로고침 (새로 작성한 글이 반영되도록)
  useEffect(() => {
    const handleFocus = () => {
      if (currentUser?.id) {
        fetchMyPosts()
        fetchMyReviews()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [currentUser?.id])

  const navItems = [
    { label: '홈', active: false, icon: Home },
    { label: '활동 추천', active: false, icon: Star },
    { label: '커뮤니티', active: false, icon: Users },
    { label: '마음 훈련', active: false, icon: Brain },
    { label: '내 마음', active: true, icon: Heart }
  ]

  const handleTabClick = (tabLabel) => {
    if (tabLabel === '홈') {
      navigate('/')
    } else {
      // 다른 탭으로 이동하는 로직
      console.log(`Navigate to ${tabLabel}`)
    }
  }

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`)
  }

  const renderContent = () => {
    switch (activeContentTab) {
      case '게시글':
        return (
          <ContentArea>
            {dataLoading ? (
              <EmptyState>
                <EmptyText>로딩 중...</EmptyText>
              </EmptyState>
            ) : myPosts.length > 0 ? (
              myPosts.map((post) => (
                <PostCard key={post.id} onClick={() => handlePostClick(post.id)}>
                  <PostContent>
                    <PostTitle>{post.title}</PostTitle>
                    <PostMeta>
                      <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '날짜 없음'}</span>
                      <CommentCount>
                        <CommentCountText>{post.commentCount || 0}</CommentCountText>
                      </CommentCount>
                    </PostMeta>
                  </PostContent>
                </PostCard>
              ))
            ) : (
              <EmptyState>
                <EmptyText>작성한 게시글이 없습니다</EmptyText>
              </EmptyState>
            )}
          </ContentArea>
        )

      case '댓글':
        return (
          <ContentArea>
            {dataLoading ? (
              <EmptyState>
                <EmptyText>로딩 중...</EmptyText>
              </EmptyState>
            ) : myComments.length > 0 ? (
              myComments.map((comment) => (
                <PostCard key={comment.id} onClick={() => handlePostClick(comment.postId)}>
                  <PostContent>
                    <PostTitle>{comment.content}</PostTitle>
                    <PostMeta>
                      <span>{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : '날짜 없음'}</span>
                    </PostMeta>
                  </PostContent>
                </PostCard>
              ))
            ) : (
              <EmptyState>
                <EmptyText>작성한 댓글이 없습니다</EmptyText>
              </EmptyState>
            )}
          </ContentArea>
        )

      case '후기':
        return (
          <ContentArea>
            {dataLoading ? (
              <EmptyState>
                <EmptyText>로딩 중...</EmptyText>
              </EmptyState>
            ) : myReviews.length > 0 ? (
              myReviews.map((review) => (
                <PostCard key={review.id} onClick={() => handlePostClick(review.id)}>
                  <PostContent>
                    <PostTitle>{review.title}</PostTitle>
                    <PostMeta>
                      <span>{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : '날짜 없음'}</span>
                      {review.rating && (
                        <CommentCount>
                          <CommentCountText>⭐ {review.rating}</CommentCountText>
                        </CommentCount>
                      )}
                    </PostMeta>
                  </PostContent>
                </PostCard>
              ))
            ) : (
              <EmptyState>
                <EmptyText>작성한 후기가 없습니다</EmptyText>
              </EmptyState>
            )}
          </ContentArea>
        )

      default:
        return null
    }
  }

  // 로딩 중이거나 사용자 정보가 없으면 아무것도 렌더링하지 않음
  if (isLoading || !currentUser) {
    return null
  }

  return (
    <Container>
      {/* Header */}
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
        </BackButton>
        <HeaderTitle>내 활동</HeaderTitle>
      </Header>

      {/* Main Content */}
      <MainContent>
        <ContentWrapper>
          {/* Profile Section */}
          <ProfileSection>
            <ProfileIcon>👤</ProfileIcon>
            <ProfileInfo>
              <ProfileName>{currentUser?.nickname || '사용자'}</ProfileName>
              <ProfileEmail>{currentUser?.email || '123@gmail.com'}</ProfileEmail>
            </ProfileInfo>
          </ProfileSection>

          {/* Content Tabs */}
          <TabContainer>
            {['게시글', '댓글', '후기'].map((tab) => (
              <TabButton
                key={tab}
                onClick={() => setActiveContentTab(tab)}
                active={activeContentTab === tab}
              >
                {tab}
              </TabButton>
            ))}
          </TabContainer>

          {/* Content */}
          {renderContent()}
        </ContentWrapper>
      </MainContent>

      {/* Bottom Navigation */}
      <BottomNav>
        <BottomNavContent>
          <NavItems>
            {navItems.map((item, index) => {
              const IconComponent = item.icon
              return (
                <NavButton
                  key={index}
                  onClick={() => handleTabClick(item.label)}
                  active={item.active}
                >
                  <NavIcon active={item.active}>
                    <IconComponent size={20} />
                  </NavIcon>
                  {item.label}
                </NavButton>
              )
            })}
          </NavItems>
        </BottomNavContent>
      </BottomNav>
    </Container>
  )
}

const Container = styled.div`
  min-height: 100vh;
  background-color: #F2F2FC;
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.6rem;
  margin-bottom: 0;
  padding: 2rem 1.6rem;
  min-height: 6.8rem;
  background: #ffffff;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  z-index: 100;
`

const BackButton = styled.button`
  background: transparent;
  border: none;
  font-size: 2rem;
  color: var(--foreground);
  padding: 0.4rem;
  cursor: pointer;
  position: absolute;
  left: 1.6rem;
`

const HeaderTitle = styled.h1`
  margin: 0;
  color: #111111;
  font-size: 1.8rem;
`

const MainContent = styled.div`
  flex: 1;
  padding: 1.6rem;
  padding-bottom: 8rem;
`

const ContentWrapper = styled.div`
  max-width: 44rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.6rem;
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
  color: var(--foreground);
`

const ProfileEmail = styled.p`
  margin: 0;
  color: var(--muted-foreground);
  font-size: 1.4rem;
`

const TabContainer = styled.div`
  display: flex;
  gap: 0.4rem;
  background: var(--muted);
  border-radius: 0.8rem;
  padding: 0.4rem;
  width: 100%;
  max-width: 44rem;
  margin: 0 auto;
  justify-content: center;
  margin-bottom: 1.6rem;
`

const TabButton = styled.button`
  flex: 1;
  padding: 0.8rem 1.2rem;
  border-radius: 0.8rem;
  border: none;
  background: ${p => p.active ? '#ffffff' : 'transparent'};
  color: ${p => p.active ? 'var(--primary)' : 'var(--muted-foreground)'};
  font-size: 1.5rem;
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${p => p.active ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'};
  
  &:hover {
    background: ${p => p.active ? '#ffffff' : 'rgba(255,255,255,0.5)'};
  }
`

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const PostCard = styled.button`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 0.8rem;
  cursor: pointer;
  width: 100%;
  text-align: left;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transform: translateY(-1px);
  }
`

const PostContent = styled.div`
  padding: 1.6rem;
`

const PostTitle = styled.h3`
  font-weight: 500;
  color: var(--foreground);
  margin-bottom: 0.8rem;
  font-size: 1.6rem;
  line-height: 1.4;
`

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.4rem;
  color: var(--muted-foreground);
`

const CommentCount = styled.div`
  width: 2.4rem;
  height: 2.4rem;
  background-color: #F2F2FC;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
`

const CommentCountText = styled.span`
  font-size: 1.2rem;
  color: var(--foreground);
  font-weight: 500;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 0;
`

const EmptyText = styled.p`
  color: var(--muted-foreground);
  font-size: 1.6rem;
  margin: 0;
`

const BottomNav = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  border-top: 1px solid var(--border);
  padding: 0.8rem 1.6rem;
  z-index: 100;
`

const BottomNavContent = styled.div`
  max-width: 44rem;
  margin: 0 auto;
`

const NavItems = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const NavButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.8rem 0.4rem;
  font-size: 1.2rem;
  transition: color 0.2s;
  background: none;
  border: none;
  cursor: pointer;
  
  ${props => props.active ? `
    color: var(--primary);
  ` : `
    color: var(--muted-foreground);
    
    &:hover {
      color: var(--foreground);
    }
  `}
`

const NavIcon = styled.div`
  margin-bottom: 0.4rem;
  transition: color 0.2s;
  
  ${props => props.active ? `
    color: var(--primary);
  ` : `
    color: var(--muted-foreground);
  `}
`