import styled from 'styled-components'
import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import { getEmotions, getMonthlyEmotionStats } from '../services/emotionApi'
import { useAuth } from '../contexts/AuthContext'

export default function MoodRecord() {
  const { currentUser } = useAuth()
  const [emotions, setEmotions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [monthlyStats, setMonthlyStats] = useState([])
  const [statsLoading, setStatsLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState('current') // 'current' 또는 'previous'

  // API에서 감정 기록 데이터 가져오기
  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        setLoading(true)
        const response = await getEmotions({ page: 0, size: 50, sort: ['createdAt,desc'] })
        setEmotions(response.content || [])
        setError(null)
      } catch (err) {
        console.error('감정 기록 로드 실패:', err)
        setError('감정 기록을 불러오는데 실패했습니다.')
        // API 실패 시 기존 더미 데이터 사용
        setEmotions([
          {
            id: 1,
            emotionState: 'SOSO',
            emotionText: '주말이라 좋았어요',
            createdAt: '2024-07-29T10:00:00.000Z'
          },
          {
            id: 2,
            emotionState: 'SOSO',
            emotionText: '그냥 평범한 하루였어요',
            createdAt: '2024-07-28T10:00:00.000Z'
          },
          {
            id: 3,
            emotionState: 'HAPPY',
            emotionText: '친구들과 만났어요',
            createdAt: '2024-07-27T10:00:00.000Z'
          },
          {
            id: 4,
            emotionState: 'SAD',
            emotionText: '비가 와서 기분이 다운되었어요',
            createdAt: '2024-07-15T10:00:00.000Z'
          },
          {
            id: 5,
            emotionState: 'ANGER',
            emotionText: '교통이 너무 막혔어요',
            createdAt: '2024-07-10T10:00:00.000Z'
          },
          {
            id: 6,
            emotionState: 'HAPPY',
            emotionText: '맛있는 걸 먹었어요',
            createdAt: '2024-07-08T10:00:00.000Z'
          },
          {
            id: 7,
            emotionState: 'SOSO',
            emotionText: '무난한 하루',
            createdAt: '2024-07-06T10:00:00.000Z'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchEmotions()
  }, [])

  // 월간 감정 통계 데이터 가져오기
  useEffect(() => {
    const fetchMonthlyStats = async () => {
      if (!currentUser?.id) return
      
      try {
        setStatsLoading(true)
        const currentDate = new Date()
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth() + 1 // 1-12월
        
        console.log(`현재 년월: ${year}년 ${month}월`)
        
        const response = await getMonthlyEmotionStats(currentUser.id, year, month)
        setMonthlyStats(response.data || [])
      } catch (err) {
        console.error('월간 감정 통계 로드 실패:', err)
        // API 실패 시 빈 배열로 초기화
        setMonthlyStats([])
      } finally {
        setStatsLoading(false)
      }
    }

    fetchMonthlyStats()
  }, [currentUser?.id])

  // API 데이터를 차트 형식으로 변환하는 함수
  const convertApiDataToChartFormat = (apiData) => {
    const emotionColors = {
      '행복': '#FFD700',
      '보통': '#C0C0C0', 
      '슬픔': '#87CEEB',
      '화남': '#FFA500',
      '걱정': '#FF6B6B'
    }

    return apiData.map(weekData => {
      const moods = []
      const percentages = weekData.percentages
      
      // 각 감정별로 데이터 생성 (퍼센트를 그대로 사용)
      Object.entries(percentages).forEach(([emotion, percentage]) => {
        if (percentage > 0) {
          moods.push({
            emotion: emotion.toLowerCase(),
            percentage: percentage, // 퍼센트를 그대로 사용
            color: emotionColors[emotion] || '#CCCCCC'
          })
        }
      })
      
      return {
        week: `${weekData.week}주차`,
        moods: moods
      }
    })
  }

  // 더미 데이터 (이전 월용)
  const dummyMonthlyData = [
    {
      week: 1,
      percentages: {
        "행복": 30,
        "보통": 40,
        "슬픔": 20,
        "화남": 5,
        "걱정": 5
      }
    },
    {
      week: 2,
      percentages: {
        "행복": 25,
        "보통": 35,
        "슬픔": 25,
        "화남": 10,
        "걱정": 5
      }
    },
    {
      week: 3,
      percentages: {
        "행복": 40,
        "보통": 30,
        "슬픔": 15,
        "화남": 10,
        "걱정": 5
      }
    },
    {
      week: 4,
      percentages: {
        "행복": 35,
        "보통": 25,
        "슬픔": 20,
        "화남": 15,
        "걱정": 5
      }
    },
    {
      week: 5,
      percentages: {
        "행복": 20,
        "보통": 30,
        "슬픔": 25,
        "화남": 15,
        "걱정": 10
      }
    }
  ]

  // 선택된 월에 따라 데이터 결정
  const weeklyMoodData = selectedMonth === 'current' 
    ? (monthlyStats.length > 0 
        ? convertApiDataToChartFormat(monthlyStats)
        : convertApiDataToChartFormat(dummyMonthlyData))
    : convertApiDataToChartFormat(dummyMonthlyData) // 이전 월은 항상 더미 데이터

  const allMonthlyMoodData = [
    { 
      month: '7월',
      weeks: [
        [
          { emotion: 'happy', count: 2, color: '#FFD700' },
          { emotion: 'neutral', count: 4, color: '#C0C0C0' },
          { emotion: 'sad', count: 1, color: '#87CEEB' },
          { emotion: 'angry', count: 0, color: '#FFA500' },
          { emotion: 'worried', count: 0, color: '#FF6B6B' }
        ],
        [],
        [
          { emotion: 'happy', count: 1, color: '#FFD700' },
          { emotion: 'neutral', count: 2, color: '#C0C0C0' },
          { emotion: 'sad', count: 3, color: '#87CEEB' },
          { emotion: 'angry', count: 1, color: '#FFA500' },
          { emotion: 'worried', count: 0, color: '#FF6B6B' }
        ],
        [],
        [
          { emotion: 'happy', count: 0, color: '#FFD700' },
          { emotion: 'neutral', count: 1, color: '#C0C0C0' },
          { emotion: 'sad', count: 2, color: '#87CEEB' },
          { emotion: 'angry', count: 2, color: '#FFA500' },
          { emotion: 'worried', count: 2, color: '#FF6B6B' }
        ]
      ]
    },
    { 
      month: '8월',
      weeks: [
        [
          { emotion: 'happy', count: 3, color: '#FFD700' },
          { emotion: 'neutral', count: 2, color: '#C0C0C0' },
          { emotion: 'sad', count: 1, color: '#87CEEB' },
          { emotion: 'angry', count: 1, color: '#FFA500' },
          { emotion: 'worried', count: 0, color: '#FF6B6B' }
        ],
        [
          { emotion: 'happy', count: 4, color: '#FFD700' },
          { emotion: 'neutral', count: 1, color: '#C0C0C0' },
          { emotion: 'sad', count: 1, color: '#87CEEB' },
          { emotion: 'angry', count: 1, color: '#FFA500' },
          { emotion: 'worried', count: 0, color: '#FF6B6B' }
        ],
        [
          { emotion: 'happy', count: 2, color: '#FFD700' },
          { emotion: 'neutral', count: 3, color: '#C0C0C0' },
          { emotion: 'sad', count: 1, color: '#87CEEB' },
          { emotion: 'angry', count: 1, color: '#FFA500' },
          { emotion: 'worried', count: 0, color: '#FF6B6B' }
        ],
        [
          { emotion: 'happy', count: 3, color: '#FFD700' },
          { emotion: 'neutral', count: 2, color: '#C0C0C0' },
          { emotion: 'sad', count: 1, color: '#87CEEB' },
          { emotion: 'angry', count: 1, color: '#FFA500' },
          { emotion: 'worried', count: 1, color: '#FF6B6B' }
        ],
        []
      ]
    },
    { 
      month: '9월',
      weeks: [
        [
          { emotion: 'happy', count: 1, color: '#FFD700' },
          { emotion: 'neutral', count: 3, color: '#C0C0C0' },
          { emotion: 'sad', count: 2, color: '#87CEEB' },
          { emotion: 'angry', count: 1, color: '#FFA500' },
          { emotion: 'worried', count: 0, color: '#FF6B6B' }
        ],
        [],
        [],
        [
          { emotion: 'happy', count: 2, color: '#FFD700' },
          { emotion: 'neutral', count: 1, color: '#C0C0C0' },
          { emotion: 'sad', count: 1, color: '#87CEEB' },
          { emotion: 'angry', count: 2, color: '#FFA500' },
          { emotion: 'worried', count: 1, color: '#FF6B6B' }
        ],
        []
      ]
    }
  ]

  // API 데이터와 기존 더미 데이터 병합
  const getRecentRecords = () => {
    if (emotions.length > 0) {
      // API 데이터를 기존 형식으로 변환
      return emotions.slice(0, 7).map(emotion => ({
        emoji: getMoodEmoji(emotion.emotionState),
        mood: getMoodText(emotion.emotionState),
        date: formatDate(emotion.createdAt),
        reason: emotion.emotionText || '감정 기록'
      }))
    }
    
    // API 데이터가 없으면 기존 더미 데이터 사용
    return [
      { emoji: '😐', mood: '보통이에요', date: '7월 29일', reason: '주말이라 좋았어요' },
      { emoji: '😐', mood: '보통이에요', date: '7월 28일', reason: '그냥 평범한 하루였어요' },
      { emoji: '😊', mood: '행복해요', date: '7월 27일', reason: '친구들과 만났어요' },
      { emoji: '😢', mood: '슬퍼요', date: '7월 15일', reason: '비가 와서 기분이 다운되었어요' },
      { emoji: '😠', mood: '화나요', date: '7월 10일', reason: '교통이 너무 막혔어요' },
      { emoji: '😊', mood: '행복해요', date: '7월 08일', reason: '맛있는 걸 먹었어요' },
      { emoji: '😐', mood: '보통이에요', date: '7월 06일', reason: '무난한 하루' }
    ]
  }

  // 감정 타입에 따른 이모지 반환
  const getEmojiByMood = (mood) => {
    const moodMap = {
      'happy': '😊',
      'neutral': '😐', 
      'sad': '😢',
      'angry': '😠',
      'worried': '😰'
    }
    return moodMap[mood] || '😐'
  }

  // 감정 타입에 따른 텍스트 반환
  const getMoodText = (mood) => {
    const moodMap = {
      'HAPPY': '행복해요',
      'SOSO': '보통이에요',
      'SAD': '슬퍼요', 
      'ANGER': '화나요',
      'WORRY': '걱정돼요',
      'happy': '행복해요',
      'neutral': '보통이에요',
      'sad': '슬퍼요', 
      'angry': '화나요',
      'worried': '걱정돼요'
    }
    return moodMap[mood] || '보통이에요'
  }

  // 감정 타입에 따른 이모지 반환
  const getMoodEmoji = (mood) => {
    const emojiMap = {
      'HAPPY': '😊',
      'SOSO': '🙂',
      'SAD': '😢', 
      'ANGER': '😠',
      'WORRY': '😟',
      'happy': '😊',
      'neutral': '🙂',
      'sad': '😢', 
      'angry': '😠',
      'worried': '😟'
    }
    return emojiMap[mood] || '🙂'
  }

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month}월 ${day}일`
  }

  const monthlyRecords = {
    0: getRecentRecords(),
    1: [
      { emoji: '😊', mood: '행복해요', date: '8월 26일', reason: '새로운 취미를 시작했어요' },
      { emoji: '😐', mood: '보통이에요', date: '8월 25일', reason: '평범한 일요일이었어요' },
      { emoji: '😊', mood: '행복해요', date: '8월 24일', reason: '친구들과 영화를 봤어요' },
      { emoji: '😰', mood: '걱정돼요', date: '8월 23일', reason: '다음 주 일정이 걱정되어요' },
      { emoji: '😊', mood: '행복해요', date: '8월 12일', reason: '시험이 잘 끝났어요' },
      { emoji: '😐', mood: '보통이에요', date: '8월 08일', reason: '회사 일이 무난했어요' },
      { emoji: '😢', mood: '슬퍼요', date: '8월 05일', reason: '피곤했어요' }
    ],
    2: [
      { emoji: '😊', mood: '행복해요', date: '9월 28일', reason: '좋은 소식을 들었어요' },
      { emoji: '😐', mood: '보통이에요', date: '9월 25일', reason: '그냥 그런 하루였어요' },
      { emoji: '😢', mood: '슬퍼요', date: '9월 15일', reason: '좋아하던 드라마가 끝났어요' },
      { emoji: '😠', mood: '화나요', date: '9월 10일', reason: '일이 많아서 스트레스 받았어요' },
      { emoji: '😰', mood: '걱정돼요', date: '9월 5일', reason: '시험이 다가와서 걱정돼요' },
      { emoji: '😊', mood: '행복해요', date: '9월 3일', reason: '산책이 즐거웠어요' },
      { emoji: '😐', mood: '보통이에요', date: '9월 1일', reason: '무난한 시작' }
    ]
  }

  const currentMonthIndex = 1
  const currentMonthData = allMonthlyMoodData[currentMonthIndex]

  // 로컬스토리지 사용 제거 - API 데이터만 사용
  const base = monthlyRecords[currentMonthIndex] || []
  const recentRecords = [...base].slice(0, 7)
  const globalMaxCount = 100

  const moodLabels = [
    { color: '#FFD700', label: '행복' },
    { color: '#C0C0C0', label: '보통' },
    { color: '#87CEEB', label: '슬픔' },
    { color: '#FFA500', label: '화남' },
    { color: '#FF6B6B', label: '걱정' }
  ]

  return (
    <Wrap>
      <PageHeader title="감정 기록" />
      
      {/* 로딩 상태 표시 */}
      {loading && (
        <LoadingMessage>
          감정 기록을 불러오는 중...
        </LoadingMessage>
      )}
      
      {/* 에러 상태 표시 */}
      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}

      <Card>
        <CardBody>
          {/* 월 선택 버튼 */}
          <MonthSelector>
            <MonthButton 
              $active={selectedMonth === 'current'} 
              onClick={() => setSelectedMonth('current')}
            >
              이번 달
            </MonthButton>
            <MonthButton 
              $active={selectedMonth === 'previous'} 
              onClick={() => setSelectedMonth('previous')}
            >
              지난 달
            </MonthButton>
          </MonthSelector>
          
          {statsLoading ? (
            <LoadingMessage>
              감정 통계를 불러오는 중...
            </LoadingMessage>
          ) : (
            <ChartRow>
              {weeklyMoodData.map((week, wi) => (
                <WeekCol key={wi}>
                  <Bars>
                    {week.moods.map((m, mi) => (
                      <Bar key={mi} height={`${(m.percentage / globalMaxCount) * 120 + 12}px`} background={m.color} />
                    ))}
                  </Bars>
                  <WeekLabel>{week.week}</WeekLabel>
                </WeekCol>
              ))}
            </ChartRow>
          )}
          <Legend>
            {moodLabels.map((m, i) => (
              <LegendItem key={i}>
                <LegendColor background={m.color} />
                <LegendText>{m.label}</LegendText>
              </LegendItem>
            ))}
          </Legend>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Title>최근 감정 기록</Title>
          <Records>
            {recentRecords.map((r, i) => (
              <Record key={i}>
                <Emoji>{r.emoji}</Emoji>
                <RecordMain>
                  <RecordTop>
                    <RecordMood>{r.mood}</RecordMood>
                    <RecordDate>{r.date}</RecordDate>
                  </RecordTop>
                  <Reason>{r.reason}</Reason>
                </RecordMain>
              </Record>
            ))}
          </Records>
        </CardBody>
      </Card>
    </Wrap>
  )
}

const Wrap = styled.div`
  padding: 0 1.6rem 8rem;
`

const Card = styled.div`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 1.2rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
  margin-top: 1.6rem;
`

const CardBody = styled.div`
  padding: 1.6rem;
`

const MonthSelector = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-bottom: 1.6rem;
  justify-content: center;
`

const MonthButton = styled.button`
  padding: 0.8rem 1.6rem;
  border: 2px solid ${props => props.$active ? '#7E6BB5' : '#E0D9F0'};
  background: ${props => props.$active ? '#7E6BB5' : 'white'};
  color: ${props => props.$active ? 'white' : '#7E6BB5'};
  border-radius: 2rem;
  font-size: 1.4rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #7E6BB5;
    background: ${props => props.$active ? '#7E6BB5' : '#F8F6FF'};
  }
`

const ChartRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 20rem;
  margin-bottom: 1.2rem;
`

const WeekCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
`

const Bars = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  height: 16rem;
  gap: 0.4rem;
`

const Bar = styled.div`
  width: 1.6rem;
  border-radius: 0.2rem;
  height: ${props => props.height || '12px'};
  background: ${props => props.background || '#ccc'};
`

const WeekLabel = styled.span`
  color: #666666;
  font-size: 1.2rem;
`

const Legend = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.2rem;
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`

const LegendColor = styled.div`
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 0.2rem;
  background: ${props => props.background || '#ccc'};
`

const LegendText = styled.span`
  color: #666666;
  font-size: 1.2rem;
`

const Title = styled.h3`
  margin: 0 0 1.2rem 0;
  font-size: 1.6rem;
  color: var(--foreground);
`

const Records = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`

const Record = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  background: #F8F8FA;
  border-radius: 0.8rem;
  padding: 1.2rem;
`

const Emoji = styled.span`
  font-size: 2.2rem;
`

const RecordMain = styled.div`
  flex: 1;
`

const RecordTop = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`

const RecordMood = styled.span`
  font-weight: var(--font-weight-medium);
  color: var(--foreground);
`

const RecordDate = styled.span`
  color: #666666;
  font-size: 1.2rem;
`

const Reason = styled.p`
  margin: 0.4rem 0 0 0;
  color: #666666;
  font-size: 1.4rem;
`

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666666;
  font-size: 1.4rem;
`

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ff6b6b;
  font-size: 1.4rem;
  background: #fff5f5;
  border: 1px solid #ffebee;
  border-radius: 0.8rem;
  margin: 1rem;
`


