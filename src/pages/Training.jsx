import styled from 'styled-components'
import PageHeader from '../components/PageHeader'
import { useState } from 'react'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

export default function Training() {
  const questions = [
    { id: 1, category: '감정 이해', question: '오늘 하루 중 가장 기분 좋았던 순간이 언제인가요?', placeholder: '자유롭게 생각을 작성해보세요...' },
    { id: 2, category: '자기 이해', question: '나는 언제 나답다고 느끼나요?', placeholder: '자유롭게 생각을 작성해보세요...' },
    { id: 3, category: '관계 이해', question: '내 주변 사람들 중 가장 소중한 사람은 누구인가요? 그 이유는 무엇인가요?', placeholder: '자유롭게 생각을 작성해보세요...' },
    { id: 4, category: '목표 설정', question: '내가 이루고 싶은 작은 목표가 있다면 무엇인가요?', placeholder: '자유롭게 생각을 작성해보세요...' },
    { id: 5, category: '감사 표현', question: '오늘 감사했던 일이나 사람이 있다면 무엇인가요?', placeholder: '자유롭게 생각을 작성해보세요...' },
    { id: 6, category: '미래 계획', question: '내일은 어떤 하루가 되었으면 좋겠나요?', placeholder: '자유롭게 생각을 작성해보세요...' },
  ]

  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({})

  const current = questions[idx]
  const total = questions.length
  const answeredCount = Object.keys(answers).filter(k => (answers[k] || '').trim().length > 0).length

  return (
    <Wrap>
      <PageHeader title="마음 훈련" />

      <Card>
        <RowBetween>
          <SmallMuted>진행률</SmallMuted>
          <SmallStrong>{answeredCount}/{total}</SmallStrong>
        </RowBetween>
        <Progress>
          <ProgressBar style={{ width: `${(answeredCount/total)*100}%` }} />
        </Progress>
      </Card>

      <QuestionCard>
        <Badge>{current.category}</Badge>
        <Question>{current.question}</Question>
      </QuestionCard>

      <NavRow>
        <NavBtn disabled={idx===0} onClick={()=> setIdx(p=>Math.max(0,p-1))}>
          <IoChevronBack size={16} />
          <span>이전</span>
        </NavBtn>
        <Dots>
          {questions.map((q, i)=>{
            const done = (answers[q.id]||'').trim().length>0
            return <Dot key={q.id} active={i===idx} done={done} onClick={()=>setIdx(i)} />
          })}
        </Dots>
        <NavBtn disabled={idx===total-1} onClick={()=> setIdx(p=>Math.min(total-1,p+1))}>
          <span>다음</span>
          <IoChevronForward size={16} />
        </NavBtn>
      </NavRow>

      <AnswerCard>
        <SectionTitle>내 생각 적어보기</SectionTitle>
        <Textarea
          placeholder={current.placeholder}
          value={answers[current.id]||''}
          onChange={(e)=> setAnswers(prev=>({...prev, [current.id]: e.target.value}))}
        />
        <RightMuted>{(answers[current.id]||'').length}/500</RightMuted>

        <Buttons>
          <GhostButton onClick={()=>{ setIdx(0); setAnswers({}) }}>그만하기</GhostButton>
          <PrimaryButton disabled={!((answers[current.id]||'').trim())} onClick={()=> idx<total-1 && setIdx(idx+1)}>저장하기</PrimaryButton>
        </Buttons>
      </AnswerCard>
    </Wrap>
  )
}

const Wrap = styled.div`
  padding: 0 1.6rem;
`

const Card = styled.div`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 1.2rem;
  padding: 1.2rem;
  margin-bottom: 1.6rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
`

const RowBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.8rem;
`

const SmallMuted = styled.span`
  color: #666666;
  font-size: 1.4rem;
`

const SmallStrong = styled.span`
  color: var(--foreground);
  font-size: 1.4rem;
  font-weight: var(--font-weight-medium);
`

const Progress = styled.div`
  width: 100%;
  height: 0.8rem;
  background: var(--border);
  border-radius: 9999px;
`

const ProgressBar = styled.div`
  height: 100%;
  background: var(--primary);
  border-radius: 9999px;
  transition: width 0.3s ease;
`

const QuestionCard = styled.div`
  background: #E0D9F0;
  border-radius: 1.2rem;
  padding: 1.6rem;
  margin-bottom: 1.2rem;
`

const Badge = styled.span`
  display: inline-block;
  background: #fff;
  color: var(--primary);
  padding: 0.4rem 0.8rem;
  border-radius: 9999px;
  font-size: 1.2rem;
  margin-bottom: 0.8rem;
`

const Question = styled.h2`
  margin: 0;
  font-size: 1.6rem;
  color: var(--foreground);
  line-height: 1.6;
`

const NavRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.2rem;
`

const NavBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.8rem 1.2rem;
  background: transparent;
  border: none;
  color: var(--primary);
  border-radius: 0.8rem;

  &:disabled { color: #CCCCCC; cursor: not-allowed; }
  &:not(:disabled):hover { background: var(--muted); }
`

const Dots = styled.div`
  display: flex;
  gap: 0.6rem;
`

const Dot = styled.button`
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  background: ${p=> p.active ? 'var(--primary)' : p.done ? 'rgba(138,121,186,0.6)' : 'var(--border)'};
  border: none;
`

const AnswerCard = styled.div`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 1.2rem;
  padding: 1.6rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
`

const SectionTitle = styled.h3`
  margin: 0 0 1.2rem 0;
  color: var(--foreground);
  font-size: 1.6rem;
`

const Textarea = styled.textarea`
  width: 100%;
  min-height: 12rem;
  border: 1px solid var(--border);
  border-radius: 1.2rem;
  padding: 1.2rem;
  resize: none;
  font-size: 1.4rem;
  outline: none;
  &:focus { border-color: var(--primary); box-shadow: 0 0 0 1px var(--primary); }
`

const RightMuted = styled.div`
  text-align: right;
  color: #999999;
  font-size: 1.2rem;
`

const Buttons = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: 1.2rem;
`

const GhostButton = styled.button`
  flex: 1;
  background: #fff;
  border: 2px solid var(--border);
  color: #666666;
  padding: 1.2rem;
  border-radius: 1.2rem;
  font-size: 1.4rem;
  cursor: pointer;
  &:hover { background: #F8F8F8; border-color: #CCCCCC; }
`

const PrimaryButton = styled.button`
  flex: 1;
  background: #6B5A9E;
  color: #fff;
  border: none;
  padding: 1.2rem;
  border-radius: 1.2rem;
  font-size: 1.4rem;
  cursor: pointer;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
  &:not(:disabled):hover { background: #5A4A8E; }
`
