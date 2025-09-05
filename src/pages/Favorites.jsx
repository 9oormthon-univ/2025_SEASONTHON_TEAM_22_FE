import { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Heart, MessageCircle } from 'lucide-react'
import { IoLocationOutline, IoTimeOutline, IoPersonOutline } from 'react-icons/io5'
import useFavoritesStore from '../stores/favoritesStore'

export default function Favorites() {
  const navigate = useNavigate()
  const { favoriteActivities, toggleFavorite, isFavorite } = useFavoritesStore()

  // 후기 보기 함수
  const handleReviewClick = (activity, e) => {
    e.stopPropagation() // 카드 클릭 이벤트 방지
    navigate('/community', { state: { initialTab: 'reviews', filterBy: activity.title } })
  }

  // 찜하기 토글 함수
  const handleFavoriteToggle = async (activity, e) => {
    e.stopPropagation() // 카드 클릭 이벤트 방지
    await toggleFavorite(activity)
  }

  // 프로그램별 후기 개수 데이터 (실제로는 API에서 가져와야 함)
  const reviewCounts = {
    '청년직업역량개발 [도전! 디자이너!] 프로그램': 2,
    '자신감UP! 관계소통UP! 마음 성장 보드게임': 3
  }

  return (
    <Container>
      {/* Header */}
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
        </BackButton>
        <HeaderTitle>찜한 활동</HeaderTitle>
      </Header>

      {/* Main Content */}
      <MainContent>
        <ContentWrapper>
          {favoriteActivities.length > 0 ? (
            <ActivityList>
              {favoriteActivities.map(activity => (
                <ActivityCard key={activity.id}>
                  <ImageContainer>
                    <CardImage as="img" src={activity.image} alt={activity.title} />
                    {/* Top Right Buttons */}
                    <ButtonContainer>
                      {/* Review Button */}
                      <TopButton onClick={(e) => handleReviewClick(activity, e)}>
                        <MessageCircle size={20} />
                        {reviewCounts[activity.title] && (
                          <Badge>{reviewCounts[activity.title]}</Badge>
                        )}
                      </TopButton>
                      
                      {/* Heart Button */}
                      <TopButton onClick={(e) => handleFavoriteToggle(activity, e)}>
                        <Heart 
                          size={20} 
                          fill={isFavorite(activity.id) ? 'red' : 'none'}
                          color={isFavorite(activity.id) ? 'red' : '#999999'}
                        />
                      </TopButton>
                    </ButtonContainer>
                  </ImageContainer>
                  <CardContent>
                    <CardTitle>{activity.title}</CardTitle>
                    <CardDetails>
                      <DetailItem>
                        <IoLocationOutline />
                        <span>{activity.description}</span>
                      </DetailItem>
                      <DetailItem>
                        <IoTimeOutline />
                        <span>{`${activity.duration} ${activity.timeRange || ''}`}</span>
                      </DetailItem>
                      <DetailItem>
                        <IoPersonOutline />
                        <span>{activity.difficulty}</span>
                      </DetailItem>
                    </CardDetails>
                    <ActionButton 
                      onClick={() => {
                        navigate(`/activity/${activity.id}`)
                      }}
                    >
                      자세히 보기
                    </ActionButton>
                  </CardContent>
                </ActivityCard>
              ))}
            </ActivityList>
          ) : (
            <EmptyState>
              <EmptyIcon>
                <Heart size={48} color="#999999" />
              </EmptyIcon>
              <EmptyTitle>찜한 활동이 없습니다</EmptyTitle>
              <EmptyDescription>
                마음에 드는 활동을 찜해보세요!
              </EmptyDescription>
              <GoToRecommendButton onClick={() => navigate('/recommend')}>
                활동 둘러보기
              </GoToRecommendButton>
            </EmptyState>
          )}
        </ContentWrapper>
      </MainContent>
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
  padding-bottom: 2rem;
`

const ContentWrapper = styled.div`
  max-width: 44rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`

const ActivityCard = styled.div`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 1.2rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transform: translateY(-1px);
  }
`

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 16rem;
`

const CardImage = styled.div`
  width: 100%;
  height: 100%;
  background: var(--muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4.8rem;
  border-bottom: 1px solid var(--border);
  object-fit: cover;
`

const ButtonContainer = styled.div`
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  display: flex;
  gap: 0.8rem;
`

const TopButton = styled.button`
  width: 4rem;
  height: 4rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.05);
  }
`

const Badge = styled.span`
  position: absolute;
  top: -0.4rem;
  right: -0.4rem;
  width: 2rem;
  height: 2rem;
  background: var(--primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
`

const CardContent = styled.div`
  padding: 1.6rem;
`

const CardTitle = styled.h3`
  margin: 0 0 1.2rem 0;
  font-size: 1.8rem;
  font-weight: var(--font-weight-medium);
  line-height: 1.4;
`

const CardDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1.6rem;
`

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: var(--muted-foreground);
  font-size: 1.4rem;
`

const ActionButton = styled.button`
  width: 100%;
  background: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: 0.8rem;
  padding: 1.2rem;
  font-size: 1.6rem;
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: var(--primary-hover, #6B5A9E);
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`

const EmptyIcon = styled.div`
  margin-bottom: 1.6rem;
`

const EmptyTitle = styled.h2`
  margin: 0 0 0.8rem 0;
  font-size: 2rem;
  font-weight: var(--font-weight-medium);
  color: var(--foreground);
`

const EmptyDescription = styled.p`
  margin: 0 0 2.4rem 0;
  color: var(--muted-foreground);
  font-size: 1.6rem;
  line-height: 1.5;
`

const GoToRecommendButton = styled.button`
  background: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: 0.8rem;
  padding: 1.2rem 2.4rem;
  font-size: 1.6rem;
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: var(--primary-hover, #6B5A9E);
  }
`
