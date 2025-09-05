import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Home, Star, Users, Brain, Heart, MessageCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import styled from 'styled-components'

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

export default function MyPosts() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [activeContentTab, setActiveContentTab] = useState('게시글')

  // 내가 쓴 게시글 데이터 (임시)
  const myPosts = [
    {
      id: 1,
      title: '자조모임 처음 참여해봤는데',
      date: '2024-08-31',
      commentCount: 3,
      content: '처음에는 긴장되었지만 다들 친절하게 대해주셔서 좋았어요.'
    }
  ]

  // 내가 쓴 댓글 데이터 (임시)
  const myComments = [
    {
      id: 1,
      content: '공감합니다(내가 단 댓글)',
      originalPost: '자조모임 처음 나가봄에 대해서(내가 댓글 단 게시글)',
      date: '2024-08-30',
      postId: 2
    }
  ]

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
            {myPosts.length > 0 ? (
              myPosts.map((post) => (
                <PostCard key={post.id} onClick={() => handlePostClick(post.id)}>
                  <PostContent>
                    <PostTitle>{post.title}</PostTitle>
                    <PostMeta>
                      <span>{post.date}</span>
                      <CommentCount>
                        <CommentCountText>{post.commentCount}</CommentCountText>
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
            {myComments.length > 0 ? (
              myComments.map((comment) => (
                <PostCard key={comment.id} onClick={() => handlePostClick(comment.postId)}>
                  <PostContent>
                    <PostTitle>{comment.content}</PostTitle>
                    <PostMeta>
                      <span>{comment.originalPost}</span>
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
          <EmptyState>
            <EmptyText>작성한 후기가 없습니다</EmptyText>
          </EmptyState>
        )

      default:
        return null
    }
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
