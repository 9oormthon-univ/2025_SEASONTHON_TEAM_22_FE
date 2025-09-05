import styled from 'styled-components'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TreePine, Compass } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()
  const [selectedMood, setSelectedMood] = useState(null)
  const [showJournalInput, setShowJournalInput] = useState(false)
  const [journalText, setJournalText] = useState('')
  const moodEmoji = { '행복': '😊', '보통': '🙂', '슬픔': '😢', '화남': '😠', '걱정': '😟' }

  const handleMoodSelect = (label) => {
    setSelectedMood(label)
    setShowJournalInput(true)
  }

  const handleSaveJournal = () => {
    const now = new Date()
    const dateLabel = `${now.getMonth()+1}월 ${now.getDate()}일`
    try {
      const raw = localStorage.getItem('moodRecords')
      const list = raw ? JSON.parse(raw) : []
      list.unshift({ emoji: moodEmoji[selectedMood] || '🙂', mood: `${selectedMood}해요`, date: dateLabel, reason: journalText })
      localStorage.setItem('moodRecords', JSON.stringify(list))
    } catch {}
    setJournalText('')
    setShowJournalInput(false)
  }
  return (
    <Wrap>
      <GreetingSection>
        <Heading>안녕하세요, 사용자님! 👋</Heading>
        <Sub>오늘 하루는 어떠셨나요?</Sub>
      </GreetingSection>

      <Section>
        <Panel>
          <SectionTitle>지금 기분은 어떠신가요?</SectionTitle>
          <MoodRow>
            <MoodButton type="button" onClick={()=>handleMoodSelect('행복')} aria-label="행복" data-active={selectedMood==='행복'}>😊<span>행복</span></MoodButton>
            <MoodButton type="button" onClick={()=>handleMoodSelect('보통')} aria-label="보통" data-active={selectedMood==='보통'}>🙂<span>보통</span></MoodButton>
            <MoodButton type="button" onClick={()=>handleMoodSelect('슬픔')} aria-label="슬픔" data-active={selectedMood==='슬픔'}>😢<span>슬픔</span></MoodButton>
            <MoodButton type="button" onClick={()=>handleMoodSelect('화남')} aria-label="화남" data-active={selectedMood==='화남'}>😠<span>화남</span></MoodButton>
            <MoodButton type="button" onClick={()=>handleMoodSelect('걱정')} aria-label="걱정" data-active={selectedMood==='걱정'}>😟<span>걱정</span></MoodButton>
          </MoodRow>
        </Panel>
      </Section>

      {showJournalInput && (
        <Section>
          <RecordCard>
            <JournalMoodText>오늘 기분: {moodEmoji[selectedMood]} {selectedMood}</JournalMoodText>
            <JournalSpacer />
            <JournalQuestionText>어떤 일이 있었나요?</JournalQuestionText>
            <JournalTextarea
              placeholder="감정의 이유를 간단히 적어보세요..."
              value={journalText}
              onChange={(e)=> setJournalText(e.target.value)}
              maxLength={100}
            />
            <JournalFooter>
              <JournalCounter>{journalText.length}/100</JournalCounter>
              <JournalSaveButton onClick={handleSaveJournal}>감정 기록하기</JournalSaveButton>
            </JournalFooter>
          </RecordCard>
        </Section>
      )}

      <Section>
        <SectionHeader>
          <SectionTitle>오늘의 추천 활동</SectionTitle>
          <MoreButton type="button" onClick={()=> navigate('/recommend')}>더보기</MoreButton>
        </SectionHeader>

        <Card>
          <CardLeft>
            <IconBox><TreePine size={32} /></IconBox>
            <CardTexts>
              <CardTitle>산책하기</CardTitle>
              <CardDesc>가까운 공원이나 거리를 걸어보세요</CardDesc>
              <Chips>
                <Chip>15분</Chip>
              </Chips>
            </CardTexts>
          </CardLeft>
          <PrimaryButton onClick={()=> navigate('/walking')}>시작하기</PrimaryButton>
        </Card>

        <Card>
          <CardLeft>
            <IconBox><Compass size={32} /></IconBox>
            <CardTexts>
              <CardTitle>5분 명상</CardTitle>
              <CardDesc>깊은 호흡으로 마음을 진정시켜 보세요</CardDesc>
              <Chips>
                <Chip>5분</Chip>
              </Chips>
            </CardTexts>
          </CardLeft>
          <PrimaryButton onClick={()=> navigate('/meditation')}>시작하기</PrimaryButton>
        </Card>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>최근 감정 기록</SectionTitle>
          <MoreButton type="button" onClick={()=> navigate('/moods')}>전체보기</MoreButton>
        </SectionHeader>

        <RecordCard>
          <WeekRow>
            <Day><Emo>😊</Emo><DayLabel>월</DayLabel></Day>
            <Day><Emo>🙂</Emo><DayLabel>화</DayLabel></Day>
            <Day><Emo>🙂</Emo><DayLabel>수</DayLabel></Day>
            <Day><Emo>😢</Emo><DayLabel>목</DayLabel></Day>
            <Day><Emo>😊</Emo><DayLabel>금</DayLabel></Day>
            <Day><Emo>😊</Emo><DayLabel>토</DayLabel></Day>
            <Day $active><Emo>🙂</Emo><DayLabel>일</DayLabel></Day>
          </WeekRow>
          <Divider />
          <SummaryRow>
            <SummaryText>이번 주 가장 많은 감정</SummaryText>
            <RightMood>
              <SummaryEmoji>😊</SummaryEmoji>
              <SummaryMoodText>행복 (2일)</SummaryMoodText>
            </RightMood>
          </SummaryRow>
        </RecordCard>
      </Section>
    </Wrap>
  )
}

const Wrap = styled.div`
  padding: 0 2rem;
  max-width: 430px;
  margin: 0 auto;

  @media (max-width: 430px) {
    padding: 0 1.6rem;
  }

  @media (max-width: 375px) {
    padding: 0 1.2rem;
  }
`

const GreetingSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 4rem;
  margin-bottom: 1.6rem;
`

const Heading = styled.h2`
  font-size: 2.6rem;
  font-weight: 700;
`

const Sub = styled.p`
  color: var(--muted-foreground);
`

const Section = styled.section`
  margin-top: 3rem; /* 섹션 간 간격 증가 */
  padding-bottom: 0.4rem;
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.8rem;
`

const SectionTitle = styled.h3`
  font-size: 1.8rem;
`

const Panel = styled.div`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 1.2rem;
  padding: 1.2rem 1.2rem 1.6rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`

const MoreButton = styled.button`
  background: transparent;
  border: none;
  color: var(--primary);
  padding: 0.4rem 0.8rem;
`

const MoodRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.8rem;
  background: var(--card);
  padding: 1.6rem;
`

const MoodButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  font-size: 2.2rem;
  border: none;
  background: transparent;
  color: var(--foreground);

  span { font-size: 1.2rem; color: var(--muted-foreground); }

  &[data-active='true'] {
    background: #E8DDF7;
    border: 2px solid var(--primary);
    border-radius: 0.8rem;
    padding: 0.4rem;
  }
`

const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 1.2rem;
  padding: 1.4rem; /* 카드 높이 +0.2rem */
  margin-bottom: 0.8rem;
`

const CardLeft = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
`

const IconBox = styled.div`
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 0.8rem;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
`

const CardTexts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`

const CardTitle = styled.h4`
  font-size: 1.6rem;
`

const CardDesc = styled.p`
  color: var(--muted-foreground);
  font-size: 1.4rem;
`

const Chips = styled.div`
  display: flex;
  gap: 0.6rem;
`

const Chip = styled.span`
  font-size: 1.2rem;
  color: var(--muted-foreground);
  background: var(--muted);
  border-radius: 999px;
  padding: 0.2rem 0.8rem;
`

const PrimaryButton = styled.button`
  background: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: 0.8rem;
  padding: 0.6rem 1.6rem; /* 높이 살짝 증가 */
  min-width: 10rem; /* 버튼 너비 확대 */
`

const RecordCard = styled.div`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 1.2rem;
  padding: 2rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
`

const JournalTextarea = styled.textarea`
  width: 100%;
  min-height: 10rem;
  border: 1px solid var(--border);
  border-radius: 1.2rem;
  padding: 1.2rem;
  resize: none;
  margin: 0.8rem 0;
  font-size: 1.4rem;
  &:focus { border-color: var(--primary); box-shadow: 0 0 0 1px var(--primary); outline: none; }
`

const JournalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #999999;
  font-size: 1.2rem;
`

const JournalMoodText = styled.p`
  margin: 0;
  color: var(--foreground);
  font-weight: 500;
`

const JournalSpacer = styled.div`
  height: 0.8rem;
`

const JournalQuestionText = styled.p`
  margin: 0;
  color: var(--foreground);
`

const JournalCounter = styled.span`
  color: #999999;
  font-size: 1.2rem;
`

const JournalSaveButton = styled.button`
  background: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: 0.8rem;
  padding: 0.6rem 1.6rem;
  width: 100%;
  margin-top: 0.8rem;
`

const WeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.8rem;
  margin-bottom: 1.2rem;
  width: 100%;
  overflow: hidden;

  @media (max-width: 375px) {
    gap: 0.4rem;
  }
`

const Day = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  color: var(--foreground);
  min-width: 0;
  width: 100%;

  &.active, &[data-active] {
    ${/* 강조 테두리 */''}
  }
`

const Emo = styled.div`
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 999px;
  background: #F8F8F8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  position: relative;
  flex-shrink: 0;

  @media (max-width: 375px) {
    width: 2.4rem;
    height: 2.4rem;
    font-size: 1.4rem;
  }

  ${Day}[data-active] & {
    box-shadow: 0 0 0 2px #8A79BA;
    background: #F2F2FC;
  }
`

const DayLabel = styled.span`
  font-size: 1.2rem;
  color: var(--muted-foreground);

  @media (max-width: 375px) {
    font-size: 1rem;
  }
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #F0F0F0;
  margin: 1.2rem 0;
`

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--muted-foreground);
`

const RightMood = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--foreground);
`

const SummaryText = styled.span`
  color: var(--muted-foreground);
`

const SummaryEmoji = styled.span`
  font-size: 1.6rem;
`

const SummaryMoodText = styled.span`
  color: var(--foreground);
`


