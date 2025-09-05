import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { BarChart3, Brain, Clock, Calendar } from 'lucide-react'

export default function TrainingRecord() {
  const navigate = useNavigate();
  
  // 샘플 + 저장 데이터 병합
  const sample = [
    { date: '2025.08.30', questionsAnswered: 6, completionRate: 100 },
    { date: '2025.08.29', questionsAnswered: 6, completionRate: 100 },
    { date: '2025.08.28', questionsAnswered: 4, completionRate: 67 },
    { date: '2025.08.27', questionsAnswered: 6, completionRate: 100 },
    { date: '2025.08.26', questionsAnswered: 5, completionRate: 83 },
    { date: '2025.08.25', questionsAnswered: 3, completionRate: 50 },
  ]

  let stored = []
  try {
    const raw = localStorage.getItem('trainingRecords')
    stored = raw ? JSON.parse(raw) : []
  } catch {}

  const records = [...stored, ...sample]

  const totalSessions = records.length
  const totalQuestions = records.reduce((sum, r) => sum + (r.questionsAnswered || 0), 0)
  const averageCompletion = Math.round(
    (records.reduce((sum, r) => sum + (r.completionRate || 0), 0) || 0) / (records.length || 1)
  )

  return (
    <Wrap>
      <PageHeader title="마음 훈련 기록" />

      <Card>
        <CardBody>
          <CardTitle>진행 현황</CardTitle>
          <Stats>
            <Stat>
              <StatIcon>
                <BarChart3 size={20} color="#7E6BB5" />
              </StatIcon>
              <StatLabel>총 훈련 세션</StatLabel>
              <StatValue>{totalSessions}회</StatValue>
            </Stat>
            <Stat>
              <StatIcon>
                <Brain size={20} color="#7E6BB5" />
              </StatIcon>
              <StatLabel>답한 질문</StatLabel>
              <StatValue>{totalQuestions}회</StatValue>
            </Stat>
            <Stat>
              <StatIcon>
                <Clock size={20} color="#7E6BB5" />
              </StatIcon>
              <StatLabel>평균 완성도</StatLabel>
              <StatValue>{averageCompletion}%</StatValue>
            </Stat>
          </Stats>
        </CardBody>
      </Card>

      <SectionTitleRow>
        <SectionIcon>
          <Calendar size={20} color="#7E6BB5" />
        </SectionIcon>
        <SectionTitle>날짜별 기록</SectionTitle>
      </SectionTitleRow>
      <Hint>날짜를 클릭하면 해당 날짜 훈련 기록을 볼 수 있어요</Hint>

      <List>
        {records.map((r, i) => (
          <Row key={i} onClick={() => navigate('/training-detail', { state: { date: r.date } })}>
            <RowLeft>
              <RowIcon>
                <Calendar size={16} color="#7E6BB5" />
              </RowIcon>
              <RowText>
                <RowTitle>{r.date} 기록</RowTitle>
                <RowSub>답변한 질문: {r.questionsAnswered}개</RowSub>
              </RowText>
            </RowLeft>
            <Badge $rate={r.completionRate}>{r.completionRate}% 완료</Badge>
          </Row>
        ))}
      </List>
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
  margin-top: 1.6rem;
`

const CardBody = styled.div`
  padding: 1.6rem;
`

const CardTitle = styled.h3`
  margin: 0 0 1.2rem 0;
  color: var(--foreground);
  font-size: 1.6rem;
`

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;
`

const Stat = styled.div`
  text-align: center;
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: 1.2rem;
  padding: 1.2rem 0.8rem;
`

const StatIcon = styled.div`
  width: 4.4rem;
  height: 4.4rem;
  border-radius: 999px;
  background: #F8F6FF;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.6rem;
`

const StatLabel = styled.div`
  color: #666666;
  font-size: 1.2rem;
  margin-bottom: 0.2rem;
`

const StatValue = styled.div`
  color: var(--foreground);
  font-size: 1.6rem;
  font-weight: var(--font-weight-medium);
`

const SectionTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 1.6rem;
`

const SectionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const SectionTitle = styled.h3`
  margin: 0;
  color: var(--foreground);
  font-size: 1.6rem;
`

const Hint = styled.p`
  margin: 0.4rem 0 1.2rem 0;
  color: #666666;
  font-size: 1.2rem;
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`

const Row = styled.button`
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: 1.2rem;
  padding: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #F8F6FF;
    border-color: #7E6BB5;
  }
`

const RowLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`

const RowIcon = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 999px;
  background: #F8F6FF;
  display: flex;
  align-items: center;
  justify-content: center;
`

const RowText = styled.div``

const RowTitle = styled.div`
  color: var(--foreground);
  font-weight: var(--font-weight-medium);
`

const RowSub = styled.div`
  color: #666666;
  font-size: 1.2rem;
`

const Badge = styled.div`
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  font-size: 1.2rem;
  color: ${props => props.$rate === 100 ? '#2E7D2E' : props.$rate >= 70 ? '#F57C00' : '#D32F2F'};
  background: ${props => props.$rate === 100 ? '#E8F5E8' : props.$rate >= 70 ? '#FFF8E1' : '#FFF2F2'};
`


