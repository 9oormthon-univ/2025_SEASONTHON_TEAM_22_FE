import styled from 'styled-components'
import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import { getEmotions } from '../services/emotionService'

export default function MoodRecord() {
  const [emotions, setEmotions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
        setEmotions([])
      } finally {
        setLoading(false)
      }
    }

    fetchEmotions()
  }, [])

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
        emoji: getEmojiByMood(emotion.mood),
        mood: getMoodText(emotion.mood),
        date: formatDate(emotion.createdAt),
        reason: emotion.reason || emotion.note || '감정 기록'
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
      'happy': '행복해요',
      'neutral': '보통이에요',
      'sad': '슬퍼요', 
      'angry': '화나요',
      'worried': '걱정돼요'
    }
    return moodMap[mood] || '보통이에요'
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
  const weeklyMoodData = [
    { week: '1주차', moods: currentMonthData?.weeks[0] || [] },
    { week: '2주차', moods: currentMonthData?.weeks[1] || [] },
    { week: '3주차', moods: currentMonthData?.weeks[2] || [] },
    { week: '4주차', moods: currentMonthData?.weeks[3] || [] },
    { week: '5주차', moods: currentMonthData?.weeks[4] || [] }
  ]

  // 로컬 저장 감정 기록과 API 데이터를 병합(저장 데이터가 상단)
  let storedRecords = []
  try {
    const raw = localStorage.getItem('moodRecords')
    storedRecords = raw ? JSON.parse(raw) : []
  } catch {}
  const base = monthlyRecords[currentMonthIndex] || []
  const recentRecords = [...storedRecords, ...base].slice(0, 7)
  const globalMaxCount = Math.max(
    ...allMonthlyMoodData.flatMap((m) => m.weeks.flatMap((w) => w.map((x) => x.count)))
  )

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
          <ChartRow>
            {weeklyMoodData.map((week, wi) => (
              <WeekCol key={wi}>
                <Bars>
                  {week.moods.map((m, mi) => (
                    <Bar key={mi} height={`${(m.count / globalMaxCount) * 120 + 12}px`} background={m.color} />
                  ))}
                </Bars>
                <WeekLabel>{week.week}</WeekLabel>
              </WeekCol>
            ))}
          </ChartRow>
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


