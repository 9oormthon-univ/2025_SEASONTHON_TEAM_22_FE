import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { Compass, Play, Pause, RotateCcw, Heart } from 'lucide-react'

export default function Meditation() {
  const navigate = useNavigate()
  const [activityTime, setActivityTime] = useState(5 * 60)
  const [timeRemaining, setTimeRemaining] = useState(5 * 60)
  const [isPlaying, setIsPlaying] = useState(false)

  // 타이머
  useEffect(() => {
    if (!isPlaying) return
    if (timeRemaining <= 0) {
      setIsPlaying(false)
      // 활동 완료 시 완료 화면으로 이동
      const minutes = Math.floor(activityTime / 60)
      navigate(`/activity-completion?title=명상&duration=${minutes}분`)
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

  const handlePreset = (min) => {
    const t = min * 60
    setActivityTime(t)
    setTimeRemaining(t)
    setIsPlaying(false)
  }

  return (
    <Wrap>
      <PageHeader title="명상" />

      <Space />

      <Card>
        <Center>
          <GradientIcon>
            <Compass size={28} color="#fff" />
          </GradientIcon>
          <CardTitle>마음 챙김 명상</CardTitle>
        </Center>
      </Card>

      <Card>
        <Center>
          <TimeText>{formatTime(timeRemaining)}</TimeText>
          <SubText>깊은 호흡으로 마음을 차분하게 해보세요</SubText>
          {isPlaying && (
            <BreathWrap>
              <PulseDot />
              <Guide>천천히 숨을 들이마시고 내쉬세요</Guide>
            </BreathWrap>
          )}
          <Controls>
            <CircleButton onClick={() => setIsPlaying((v) => !v)} active>
              {isPlaying ? <Pause size={28} color="#fff" /> : <Play size={28} color="#fff" />}
            </CircleButton>
            <CircleButton onClick={() => { setIsPlaying(false); setTimeRemaining(activityTime) }}>
              <RotateCcw size={24} />
            </CircleButton>
          </Controls>
        </Center>
      </Card>

      <SmallCard>
        <SmallTitle>명상 시간 선택</SmallTitle>
        <PresetRow>
          {[1, 10, 15].map((m) => (
            <PresetKey
              key={m}
              active={activityTime === m * 60}
              onClick={() => handlePreset(m)}
            >
              {m}분
            </PresetKey>
          ))}
        </PresetRow>
      </SmallCard>

      <TipCard>
        <TipRow>
          <TipIcon>
            <Heart size={16} color="#7E6BB5" />
          </TipIcon>
          <div>
            <TipTitle>명상 팁</TipTitle>
            <TipText>편안한 자세로 앉아 코로 천천히 숨을 들이마시고, 입으로 길게 내쉬어 보세요.</TipText>
          </div>
        </TipRow>
      </TipCard>
    </Wrap>
  )
}

const Wrap = styled.div`
  padding: 0 1.6rem 8rem;
  background: linear-gradient(135deg, #E5E1F7, #F2F2FC 40%, #E5E1F7);
  min-height: 100dvh;
`

const Space = styled.div`
  height: 0.8rem;
`

const Card = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 1.6rem;
  padding: 2rem;
  margin-bottom: 1.2rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
`

const SmallCard = styled(Card)`
  padding: 1.4rem;
`

const TipCard = styled.div`
  background: linear-gradient(90deg, rgba(255,255,255,0.6), rgba(229,225,247,0.6));
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 1.2rem;
  padding: 1.2rem;
`

const Center = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
`

const GradientIcon = styled.div`
  width: 6.4rem;
  height: 6.4rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #A89CC8, #7E6BB5);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(126,107,181,0.35);
`

const CardTitle = styled.h3`
  margin: 0;
  color: #333333;
`

const TimeText = styled.div`
  font-size: 4rem;
  font-weight: 300;
  letter-spacing: -0.02em;
  color: #333333;
`

const SubText = styled.p`
  margin: 0;
  color: #666666;
`

const BreathWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
`

const PulseDot = styled.div`
  width: 4.8rem;
  height: 4.8rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #A89CC8, #7E6BB5);
  animation: pulse 1.6s ease-in-out infinite;
  box-shadow: 0 10px 20px rgba(126,107,181,0.35);

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.85; }
    50% { transform: scale(1.1); opacity: 1; }
  }
`

const Guide = styled.p`
  margin: 0;
  font-size: 1.3rem;
  color: #7E6BB5;
  font-weight: 500;
`

const Controls = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  justify-content: center;
`

const CircleButton = styled.button`
  width: 6.4rem;
  height: 6.4rem;
  border-radius: 50%;
  border: ${p => p.active ? 'none' : '2px solid #E0D9F0'};
  background: ${p => p.active ? 'linear-gradient(90deg, #A89CC8, #7E6BB5)' : '#fff'};
  color: ${p => p.active ? '#fff' : '#666'};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${p => p.active ? '0 10px 20px rgba(126,107,181,0.35)' : '0 4px 10px rgba(0,0,0,0.06)'};
  cursor: pointer;
`

const SmallTitle = styled.h4`
  margin: 0 0 0.8rem 0;
  color: #333333;
  text-align: center;
  font-size: 1.4rem;
`

const PresetRow = styled.div`
  display: flex;
  gap: 0.8rem;
  justify-content: center;
`

const PresetKey = styled.button`
  padding: 0.8rem 1.2rem;
  border-radius: 1.2rem;
  border: ${p => p.active ? 'none' : '1px solid #E0D9F0'};
  background: ${p => p.active ? '#A89CC8' : 'rgba(255,255,255,0.8)'};
  color: ${p => p.active ? '#fff' : '#666'};
  cursor: pointer;
  box-shadow: ${p => p.active ? '0 4px 12px rgba(126,107,181,0.3)' : 'none'};
  font-size: 1.4rem;
`

const TipRow = styled.div`
  display: flex;
  gap: 0.8rem;
  align-items: flex-start;
`

const TipIcon = styled.div`
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 0.8rem;
  background: rgba(168,156,200,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

const TipTitle = styled.h4`
  margin: 0 0 0.2rem 0;
  color: #333333;
  font-size: 1.4rem;
`

const TipText = styled.p`
  margin: 0;
  color: #666666;
  font-size: 1.2rem;
`


