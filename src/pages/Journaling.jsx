import { useEffect, useState } from 'react'
import styled from 'styled-components'
import PageHeader from '../components/PageHeader'
import { BookOpen, Edit3, Heart, Play, Pause, RotateCcw } from 'lucide-react'

export default function Journaling() {
  const [activityTime, setActivityTime] = useState(15 * 60)
  const [timeRemaining, setTimeRemaining] = useState(15 * 60)
  const [isPlaying, setIsPlaying] = useState(false)
  const [title, setTitle] = useState('')
  const [entry, setEntry] = useState('')

  useEffect(() => {
    if (!isPlaying) return
    if (timeRemaining <= 0) { setIsPlaying(false); return }
    const id = setInterval(() => setTimeRemaining((t) => Math.max(0, t - 1)), 1000)
    return () => clearInterval(id)
  }, [isPlaying, timeRemaining])

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0')
    const s = String(sec % 60).padStart(2, '0')
    return `${m}:${s}`
  }

  const preset = (m) => {
    const t = m * 60
    setActivityTime(t)
    setTimeRemaining(t)
    setIsPlaying(false)
  }

  return (
    <Wrap>
      <PageHeader title="일기쓰기" />

      <Space />

      <Card>
        <Center>
          <GradientIcon>
            <BookOpen size={28} color="#fff" />
          </GradientIcon>
          <div>
            <CardTitle>마음 일기</CardTitle>
            <SubText>오늘의 감정과 생각을 자유롭게 적어보세요</SubText>
          </div>
        </Center>
      </Card>

      <Card>
        <Field>
          <Label><Edit3 size={16} color="#F29E4C" /> 제목</Label>
          <Input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="오늘의 제목을 입력해주세요" />
        </Field>
        <Field>
          <Label><Heart size={16} color="#F29E4C" /> 마음의 기록</Label>
          <Textarea value={entry} onChange={(e)=>setEntry(e.target.value)} placeholder="오늘은 어떤 하루였나요? 감정이나 생각을 자유롭게 적어보세요..." rows={6} />
        </Field>
      </Card>

      <SmallCard>
        <Center>
          <TimeText>{formatTime(timeRemaining)}</TimeText>
          <SmallMuted>집중 시간</SmallMuted>
          {isPlaying && (
            <ProgressWrap>
              <ProgressBar />
              <SmallMuted style={{ color: '#F29E4C' }}>일기 작성 중...</SmallMuted>
            </ProgressWrap>
          )}
          <Controls>
            <MiniCircle onClick={()=> setIsPlaying(v=>!v)} active>
              {isPlaying ? <Pause size={20} color="#fff" /> : <Play size={20} color="#fff" />}
            </MiniCircle>
            <MiniCircle onClick={()=>{ setIsPlaying(false); setTimeRemaining(activityTime) }}>
              <RotateCcw size={20} />
            </MiniCircle>
          </Controls>
        </Center>
      </SmallCard>

      <SmallCard>
        <SmallTitle>일기 시간 선택</SmallTitle>
        <PresetRow>
          {[10,15,30].map((m)=> (
            <PresetKey key={m} active={activityTime===m*60} onClick={()=>preset(m)}>{m}분</PresetKey>
          ))}
        </PresetRow>
      </SmallCard>

      <TipCard>
        <TipRow>
          <TipIcon>
            <Edit3 size={16} color="#F29E4C" />
          </TipIcon>
          <div>
            <TipTitle>일기 팁</TipTitle>
            <TipText>정답은 없습니다. 오늘 느낀 감정이나 생각을 솔직하게 적어보세요.</TipText>
          </div>
        </TipRow>
      </TipCard>
    </Wrap>
  )
}

const Wrap = styled.div`
  padding: 0 1.6rem 8rem;
  background: linear-gradient(135deg, #FFF2E0, #F2F2FC 40%, #FFF2E0);
  min-height: 100dvh;
`
const Space = styled.div` height: 0.8rem; `

const Card = styled.div`
  background: rgba(255,255,255,0.9);
  border: 1px solid rgba(255,255,255,0.5);
  border-radius: 1.6rem;
  padding: 2rem;
  margin-bottom: 1.2rem;
  backdrop-filter: blur(6px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.06);
`
const SmallCard = styled(Card)` padding: 1.4rem; `

const Center = styled.div` display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1.2rem; `
const GradientIcon = styled.div` width: 6.4rem; height: 6.4rem; border-radius: 50%; background: linear-gradient(135deg, #F6C88F, #F29E4C); display:flex; align-items:center; justify-content:center; box-shadow: 0 10px 20px rgba(242,158,76,0.35); `
const CardTitle = styled.h3` margin: 0 0 0.2rem 0; color: #333; `
const SubText = styled.p` margin: 0; color: #666; font-size: 1.3rem; `

const Field = styled.div` width: 100%; margin-bottom: 1.2rem; `
const Label = styled.div` display:flex; align-items:center; gap:0.6rem; color:#333; font-size:1.3rem; margin-bottom:0.6rem; `
const Input = styled.input` width:100%; border:2px solid #E0D9F0; border-radius:1.2rem; padding:1rem 1.2rem; background:#fff; &:focus{outline:none; border-color:#F6C88F; box-shadow:0 0 0 2px rgba(246,200,143,0.2);} `
const Textarea = styled.textarea` width:100%; border:2px solid #E0D9F0; border-radius:1.2rem; padding:1rem 1.2rem; background:#fff; resize:none; min-height:12rem; &:focus{outline:none; border-color:#F6C88F; box-shadow:0 0 0 2px rgba(246,200,143,0.2);} `

const TimeText = styled.div` font-size: 2.4rem; font-weight:300; color:#333; `
const SmallMuted = styled.p` margin:0; color:#666; font-size:1.2rem; `
const ProgressWrap = styled.div` display:flex; flex-direction:column; align-items:center; gap:0.6rem; `
const ProgressBar = styled.div` width: 3.2rem; height:0.4rem; border-radius: 9999px; background: linear-gradient(90deg,#F6C88F,#F29E4C); animation: pulse 1.5s infinite; @keyframes pulse{0%,100%{opacity:.7}50%{opacity:1}} `

const Controls = styled.div` display:flex; gap:0.8rem; align-items:center; justify-content:center; `
const MiniCircle = styled.button` width:4.8rem; height:4.8rem; border-radius:50%; border:${p=>p.active?'none':'2px solid #E0D9F0'}; background:${p=>p.active?'linear-gradient(90deg,#F6C88F,#F29E4C)':'#fff'}; color:${p=>p.active?'#fff':'#666'}; display:flex; align-items:center; justify-content:center; box-shadow:${p=>p.active?'0 6px 14px rgba(242,158,76,0.35)':'0 4px 10px rgba(0,0,0,0.06)'}; cursor:pointer; `

const SmallTitle = styled.h4` margin:0 0 0.8rem 0; color:#333; text-align:center; font-size:1.4rem; `
const PresetRow = styled.div` display:flex; gap:0.8rem; justify-content:center; `
const PresetKey = styled.button` padding:0.8rem 1.2rem; border-radius:1.2rem; font-size:1.4rem; cursor:pointer; border:${p=>p.active?'none':'1px solid #E0D9F0'}; background:${p=>p.active?'#F6C88F':'rgba(255,255,255,0.8)'}; color:${p=>p.active?'#fff':'#666'}; box-shadow:${p=>p.active?'0 4px 12px rgba(246,200,143,0.3)':'none'}; `

const TipCard = styled.div`
  background: linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,242,224,0.6));
  border: 1px solid rgba(255,255,255,0.5);
  border-radius: 1.2rem;
  padding: 1.2rem;
  backdrop-filter: blur(6px);
`

const TipRow = styled.div` display:flex; gap:0.8rem; align-items:flex-start; `
const TipIcon = styled.div`
  width: 3.2rem; height: 3.2rem; border-radius: 0.8rem; background: rgba(242,158,76,0.15);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
`
const TipTitle = styled.h4` margin: 0 0 0.2rem 0; color: #333; font-size: 1.4rem; `
const TipText = styled.p` margin: 0; color: #666; font-size: 1.2rem; `


