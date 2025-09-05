import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { Headphones, Play, Pause, RotateCcw, Volume2 } from 'lucide-react'

export default function Music() {
  const navigate = useNavigate()
  const [activityTime, setActivityTime] = useState(20 * 60)
  const [timeRemaining, setTimeRemaining] = useState(20 * 60)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!isPlaying) return
    if (timeRemaining <= 0) { 
      setIsPlaying(false)
      // 활동 완료 시 완료 화면으로 이동
      const minutes = Math.floor(activityTime / 60)
      navigate(`/activity-completion?title=음악감상&duration=${minutes}분`)
      return 
    }
    const id = setInterval(() => setTimeRemaining((t) => Math.max(0, t - 1)), 1000)
    return () => clearInterval(id)
  }, [isPlaying, timeRemaining, activityTime, navigate])

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
      <PageHeader title="음악감상" />
      <Space />

      <PlayerCard>
        <Center>
          <MusicIcon>
            <Headphones size={32} color="#fff" />
          </MusicIcon>
          <SongInfo>
            <h3>기분 좋은 팝송</h3>
            <p>차분한 피아노</p>
            <small>편안한 자연 소리</small>
          </SongInfo>

          <TimeText>{formatTime(timeRemaining)}</TimeText>
          <SubText>차분한 음악을 들으며 마음을 달래보세요</SubText>

          {isPlaying && (
            <Bars>
              {[0,1,2,3,4].map((i) => (
                <Bar key={i} delay={`${i * 0.1}s`} height={`${14 + i*2}px`} />
              ))}
            </Bars>
          )}

          <Controls>
            <CircleButton onClick={()=> setIsPlaying(v=>!v)} $active>
              {isPlaying ? <Pause size={28} color="#fff" /> : <Play size={28} color="#fff" />}
            </CircleButton>
            <CircleButton onClick={()=>{ setIsPlaying(false); setTimeRemaining(activityTime) }}>
              <RotateCcw size={24} />
            </CircleButton>
          </Controls>
        </Center>
      </PlayerCard>

      <SmallCard>
        <SmallTitle>감상 시간 선택</SmallTitle>
        <PresetRow>
          {[10,20,30].map((m)=> (
            <PresetKey key={m} $active={activityTime===m*60} onClick={()=>preset(m)}>{m}분</PresetKey>
          ))}
        </PresetRow>
      </SmallCard>

      <TipCard>
        <TipRow>
          <TipIcon>
            <Volume2 size={16} color="#5478C2" />
          </TipIcon>
          <div>
            <TipTitle>음악 감상 팁</TipTitle>
            <TipText>편안한 자세로 앉아 음악에 온전히 집중해보세요. 마음이 차분해질 때까지 천천히 들어보세요.</TipText>
          </div>
        </TipRow>
      </TipCard>
    </Wrap>
  )
}

const Wrap = styled.div`
  padding: 0 1.6rem 8rem;
  background: linear-gradient(135deg, #E5F2FB, #F2F2FC 40%, #E5F2FB);
  min-height: 100dvh;
`
const Space = styled.div` height: 0.8rem; `

const PlayerCard = styled.div`
  background: rgba(255,255,255,0.9);
  border: 1px solid rgba(255,255,255,0.5);
  border-radius: 1.6rem;
  padding: 2.4rem;
  margin-bottom: 1.2rem;
  backdrop-filter: blur(6px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.06);
`
const SmallCard = styled(PlayerCard)` padding: 1.4rem; `

const Center = styled.div` display:flex; flex-direction:column; align-items:center; text-align:center; gap:1.2rem; `
const MusicIcon = styled.div` width: 8rem; height: 8rem; border-radius:50%; background: linear-gradient(135deg,#9EC9EB,#5478C2); display:flex; align-items:center; justify-content:center; box-shadow: 0 10px 20px rgba(84,120,194,0.35); `
const SongInfo = styled.div` h3{margin:0;color:#333} p{margin:0;color:#666} small{color:#999} `
const TimeText = styled.div` font-size: 4rem; font-weight:300; color:#333; `
const SubText = styled.p` margin:0; color:#666; `

const Bars = styled.div` display:flex; gap:0.3rem; align-items:flex-end; justify-content:center; height:2.4rem; `
const Bar = styled.div`
  width: 0.4rem;
  background: linear-gradient(to top, #9EC9EB, #5478C2);
  border-radius: 9999px;
  animation: beat 0.8s infinite ease-in-out;
  animation-delay: ${props => props.delay || '0s'};
  height: ${props => props.height || '14px'};
  @keyframes beat {
    0%, 100% { transform: scaleY(0.7); opacity: .7 }
    50% { transform: scaleY(1.2); opacity: 1 }
  }
`

const Controls = styled.div` display:flex; gap:1.2rem; align-items:center; justify-content:center; padding-top:0.4rem; `
const CircleButton = styled.button` width:6.4rem; height:6.4rem; border-radius:50%; border:${p=>p.$active?'none':'2px solid #E0D9F0'}; background:${p=>p.$active?'linear-gradient(90deg,#9EC9EB,#5478C2)':'#fff'}; color:${p=>p.$active?'#fff':'#666'}; display:flex; align-items:center; justify-content:center; box-shadow:${p=>p.$active?'0 10px 20px rgba(84,120,194,0.35)':'0 4px 10px rgba(0,0,0,0.06)'}; cursor:pointer; `

const SmallTitle = styled.h4` margin:0 0 0.8rem 0; color:#333; text-align:center; font-size:1.4rem; `
const PresetRow = styled.div` display:flex; gap:0.8rem; justify-content:center; `
const PresetKey = styled.button` padding:0.8rem 1.2rem; border-radius:1.2rem; font-size:1.4rem; cursor:pointer; border:${p=>p.$active?'none':'1px solid #E0D9F0'}; background:${p=>p.$active?'#9EC9EB':'rgba(255,255,255,0.8)'}; color:${p=>p.$active?'#fff':'#666'}; box-shadow:${p=>p.$active?'0 4px 12px rgba(84,120,194,0.3)':'none'}; `

const TipCard = styled.div` background: linear-gradient(90deg, rgba(255,255,255,0.6), rgba(229,242,251,0.6)); border:1px solid rgba(255,255,255,0.5); border-radius:1.2rem; padding:1.2rem; backdrop-filter: blur(6px); `
const TipRow = styled.div` display:flex; gap:0.8rem; align-items:flex-start; `
const TipIcon = styled.div` width:3.2rem; height:3.2rem; border-radius:0.8rem; background: rgba(158,201,235,0.2); display:flex; align-items:center; justify-content:center; flex-shrink:0; `
const TipTitle = styled.h4` margin:0 0 0.2rem 0; color:#333; font-size:1.4rem; `
const TipText = styled.p` margin:0; color:#666; font-size:1.2rem; `


