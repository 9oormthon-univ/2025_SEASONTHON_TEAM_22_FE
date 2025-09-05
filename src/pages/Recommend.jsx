import { useState, useEffect } from 'react'
import styled from 'styled-components'
import PageHeader from '../components/PageHeader'
import Tabs from '../components/Tabs'
import { IoLocationOutline, IoTimeOutline, IoPersonOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { Compass, TreePine, BookOpen, Headphones, Target, Gamepad2, Cloud, Smile, Zap, Meh, Angry, Frown, Heart, MessageCircle } from 'lucide-react'
import { likeActivity, unlikeActivity, getActivities } from '../services/emotionService'
import { toast } from 'sonner'

export default function Recommend() {
  const [activeTab, setActiveTab] = useState('alone')
  const [favoriteActivities, setFavoriteActivities] = useState([])
  const [groupActivities, setGroupActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // 카테고리별 아이콘/색상 매핑
  const CATEGORY_META = {
    '보통': { Icon: Meh, color: '#8E8E93' },
    '행복': { Icon: Smile, color: '#F6C000' },
    '화남': { Icon: Angry, color: '#FF8E53' },
    '걱정': { Icon: Zap, color: '#F59E0B' },
    '슬픔': { Icon: Frown, color: '#3B82F6' },
    '불안': { Icon: Cloud, color: '#FF6B6B' }
  }

  // 피그마 tsx 데이터 구조 적용
  const soloActivities = [
    {
      title: '명상',
      description: '5분간 깊은 호흡으로 마음을 차분하게 해보세요',
      duration: '5~10분',
      difficulty: '쉬움',
      icon: Compass,
      category: '보통, 화남, 걱정',
    },
    {
      title: '산책하기',
      description: '20분간 자연과 함께 걸으며 마음을 편안하게 해보세요',
      duration: '20분',
      difficulty: '쉬움',
      icon: TreePine,
      category: '행복, 화남, 걱정',
    },
    {
      title: '일기쓰기',
      description: '오늘의 감정과 생각을 글로 정리해보세요',
      duration: '15분',
      difficulty: '쉬움',
      icon: BookOpen,
      category: '보통, 슬픔',
    },
    {
      title: '음악감상',
      description: '차분한 음악을 들으며 마음을 달래보세요',
      duration: '20분',
      difficulty: '쉬움',
      icon: Headphones,
      category: '행복, 슬픔',
    }
  ]

  // API에서 그룹 활동 데이터 로드
  useEffect(() => {
    const fetchGroupActivities = async () => {
      try {
        setLoading(true)
        const response = await getActivities({ 
          page: 0, 
          size: 20, 
          sort: ['createdAt,desc'] 
        })
        
        if (response.content) {
          // API 데이터를 UI에 맞게 변환
          const transformedActivities = response.content.map(activity => ({
            id: activity.id,
            title: activity.title,
            description: activity.content || '활동 설명이 없습니다.',
            duration: '매주 화요일', // 기본값, 실제로는 API에서 받아와야 함
            timeRange: '10:00~12:00', // 기본값, 실제로는 API에서 받아와야 함
            difficulty: '만19세~만39세', // 기본값, 실제로는 API에서 받아와야 함
            icon: Target, // 기본 아이콘
            category: '불안', // 기본 카테고리
            emotionCategory: '불안',
            image: 'https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjB3b3Jrc2hvcCUyMGNyZWF0aXZlfGVufDF8fHx8MTc1NjcwNDY3M3ww&ixlib=rb-4.0.3&q=80&w=1080&utm_source=figma&utm_medium=referral',
            recruitStatus: activity.recruitStatus,
            likes: activity.likes || 0,
            applyStartAt: activity.applyStartAt,
            applyEndAt: activity.applyEndAt,
            status: activity.recruitStatus === 'CLOSED' ? 'closed' : 'open'
          }))
          
          setGroupActivities(transformedActivities)
        }
      } catch (error) {
        console.warn('API에서 활동 데이터 로드 실패, 더미 데이터 사용:', error.message)
        
        // API 실패 시 더미 데이터 사용
        setGroupActivities([
          {
            id: 1,
            title: '청년직업역량개발 [도전! 디자이너!] 프로그램',
            description: '서울특별시 경계선지능 평생교육 지원센터',
            duration: '매주 화요일',
            timeRange: '10:00~12:00',
            difficulty: '만19세~만39세',
            icon: Target,
            category: '불안',
            emotionCategory: '불안',
            image: 'https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjB3b3Jrc2hvcCUyMGNyZWF0aXZlfGVufDF8fHx8MTc1NjcwNDY3M3ww&ixlib=rb-4.0.3&q=80&w=1080&utm_source=figma&utm_medium=referral',
          },
          {
            id: 2,
            title: '자신감UP! 관계소통UP! 마음 성장 보드게임',
            description: '서울특별시 경계선지능 평생교육 지원센터',
            duration: '매주 화요일',
            timeRange: '10:00~12:00',
            difficulty: '만19세~만39세',
            icon: Gamepad2,
            category: '걱정',
            emotionCategory: '걱정',
            image: 'https://images.unsplash.com/photo-1676277758786-c2ce791b7a85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxib2FyZCUyMGdhbWUlMjB0aGVyYXB5JTIwZ3JvdXAlMjBzb2NpYWx8ZW58MXx8fHwxNzU2NzA2Njc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            status: 'closed'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchGroupActivities()
  }, [])

  // 더미 데이터 (API 실패 시 사용)
  const defaultGroupActivities = [
    {
      id: 1,
      title: '청년직업역량개발 [도전! 디자이너!] 프로그램',
      description: '서울특별시 경계선지능 평생교육 지원센터',
      duration: '매주 화요일',
      timeRange: '10:00~12:00',
      difficulty: '만19세~만39세',
      icon: Target,
      category: '불안',
      emotionCategory: '불안',
      image: 'https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjB3b3Jrc2hvcCUyMGNyZWF0aXZlfGVufDF8fHx8MTc1NjcwNDY3M3ww&ixlib=rb-4.0.3&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: 2,
      title: '자신감UP! 관계소통UP! 마음 성장 보드게임',
      description: '서울특별시 경계선지능 평생교육 지원센터',
      duration: '매주 화요일',
      timeRange: '10:00~12:00',
      difficulty: '만19세~만39세',
      icon: Gamepad2,
      category: '걱정',
      emotionCategory: '걱정',
      image: 'https://images.unsplash.com/photo-1676277758786-c2ce791b7a85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2FyZCUyMGdhbWUlMjB0aGVyYXB5JTIwZ3JvdXAlMjBzb2NpYWx8ZW58MXx8fHwxNzU2NzA2Njc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      status: 'closed'
    }
  ]

  // 프로그램별 후기 개수 데이터
  const reviewCounts = {
    '청년직업역량개발 [도전! 디자이너!] 프로그램': 2,
    '자신감UP! 관계소통UP! 마음 성장 보드게임': 3
  }

  // 찜하기 상태 확인 함수
  const isFavorite = (activityId) => {
    return favoriteActivities.some(fav => fav.id === activityId)
  }

  // 찜하기 토글 함수
  const handleFavoriteToggle = async (activity, e) => {
    e.stopPropagation() // 카드 클릭 이벤트 방지
    
    try {
      if (isFavorite(activity.id)) {
        // 찜 해제
        await unlikeActivity(activity.id)
        setFavoriteActivities(prev => prev.filter(fav => fav.id !== activity.id))
        toast.success('찜을 해제했습니다')
      } else {
        // 찜하기
        await likeActivity(activity.id)
        setFavoriteActivities(prev => [...prev, {
          id: activity.id,
          title: activity.title,
          category: activity.category
        }])
        toast.success('활동을 찜했습니다!')
      }
    } catch (error) {
      console.error('찜하기 실패:', error)
      if (error.message.includes('이미 찜한')) {
        toast.info('이미 찜한 활동입니다.')
      } else if (error.message.includes('찜하지 않은')) {
        toast.info('찜하지 않은 활동입니다.')
      } else {
        toast.error('찜하기에 실패했습니다.')
      }
    }
  }

  // 후기 보기 함수
  const handleReviewClick = (activity, e) => {
    e.stopPropagation() // 카드 클릭 이벤트 방지
    navigate('/community', { state: { initialTab: 'reviews', filterBy: activity.title } })
  }

  return (
    <Wrap>
      <PageHeader title="활동 추천" />
      
      <Tabs 
        tabs={[{ label: '혼자하기', value: 'alone' }, { label: '함께하기', value: 'together' }]} 
        activeValue={activeTab} 
        onChange={setActiveTab}
      />

      {activeTab === 'alone' ? (
        <ActivityList>
          {soloActivities.map((activity, index) => {
            const Icon = activity.icon
            return (
            <AloneCard key={index}>
              <CardHeader>
                <ActivityIcon>
                  <Icon size={20} />
                </ActivityIcon>
                <CardTitle>{activity.title}</CardTitle>
              </CardHeader>
              <CardDescription>{activity.description}</CardDescription>
              <CardDetails>
                <DetailItem>
                  <IoTimeOutline />
                  <span>{activity.duration}</span>
                </DetailItem>
                <DetailItem>
                  <span>⭐</span>
                  <span>{activity.difficulty}</span>
                </DetailItem>
                {activity.category.split(',').map((c, i) => {
                  const name = c.trim()
                  const meta = CATEGORY_META[name] || { Icon: Cloud, color: 'var(--muted-foreground)' }
                  const IconComp = meta.Icon
                  return (
                    <Tag key={i} color={meta.color}>
                      <IconComp size={14} />
                      <span>{name}</span>
                    </Tag>
                  )
                })}
              </CardDetails>
              <StartButton onClick={() => {
                if (activity.title === '명상') navigate('/meditation')
                if (activity.title === '산책하기') navigate('/walking')
                if (activity.title === '일기쓰기') navigate('/journaling')
                if (activity.title === '음악감상') navigate('/music')
              }}>시작하기</StartButton>
            </AloneCard>
          )})}
        </ActivityList>
      ) : (
        <ActivityList>
          {groupActivities.map(activity => (
            <TogetherCard key={activity.id}>
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
                <TagRow>
                  {(() => {
                    const name = activity.emotionCategory
                    const meta = CATEGORY_META[name] || { Icon: Cloud, color: 'var(--muted-foreground)' }
                    const IconComp = meta.Icon
                    return (
                      <Tag color={meta.color}>
                        <IconComp size={14} />
                        <span>{name}</span>
                      </Tag>
                    )
                  })()}
                </TagRow>
                <CardDetails>
                  <DetailItem>
                    <IoLocationOutline />
                    <span>{activity.description}</span>
                  </DetailItem>
                  <DetailItem>
                    <IoTimeOutline />
                    <span>{`${activity.duration} ${activity.timeRange}`}</span>
                  </DetailItem>
                  <DetailItem>
                    <IoPersonOutline />
                    <span>{activity.difficulty}</span>
                  </DetailItem>
                </CardDetails>
                <ActionButton 
                  status={activity.status === 'closed' ? 'closed' : 'active'}
                  disabled={activity.status === 'closed'}
                  onClick={() => {
                    navigate(`/activity/${activity.id}`)
                  }}
                >
                  {activity.status === 'closed' ? '마감' : '자세히 보기'}
                </ActionButton>
              </CardContent>
            </TogetherCard>
          ))}
        </ActivityList>
      )}
    </Wrap>
  )
}

const Wrap = styled.div`
  padding: 0 1.6rem;
`

/* tabs has own wrapper */

/* tabs moved to component */

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`

const AloneCard = styled.div`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 1.2rem;
  padding: 1.6rem;
`

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 0.8rem;
`

const ActivityIcon = styled.div`
  font-size: 2.4rem;
  width: 4.8rem;
  height: 4.8rem;
  background: var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.8rem;
  font-weight: var(--font-weight-medium);
`

const CardDescription = styled.p`
  margin: 0 0 1.2rem 0;
  color: var(--muted-foreground);
  font-size: 1.4rem;
  line-height: 1.5;
`

const CardDetails = styled.div`
  display: flex;
  gap: 1.6rem;
  margin-bottom: 1.6rem;
  flex-wrap: wrap;
`

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--muted-foreground);
  font-size: 1.2rem;
`

const EmotionIcon = styled.span`
  color: ${props => props.color};
`

const StartButton = styled.button`
  width: 100%;
  background: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: 0.8rem;
  padding: 1.2rem;
  font-size: 1.6rem;
  font-weight: var(--font-weight-medium);
  cursor: pointer;
`

const TogetherCard = styled.div`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 1.2rem;
  overflow: hidden;
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

const ActionButton = styled.button`
  width: 100%;
  background: ${props => props.status === 'active' ? 'var(--primary)' : 'var(--muted)'};
  color: ${props => props.status === 'active' ? 'var(--primary-foreground)' : 'var(--muted-foreground)'};
  border: none;
  border-radius: 0.8rem;
  padding: 1.2rem;
  font-size: 1.6rem;
  font-weight: var(--font-weight-medium);
  cursor: ${props => props.status === 'active' ? 'pointer' : 'not-allowed'};
  margin-top: 1.2rem;
`

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  color: var(--muted-foreground);
  border-radius: 0;
  padding: 0;
  font-size: 1.2rem;

  svg {
    color: ${props => props.color || 'var(--muted-foreground)'};
  }
`

const TagRow = styled.div`
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin: 0.8rem 0;
`
