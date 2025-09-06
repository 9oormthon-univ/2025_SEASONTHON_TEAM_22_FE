import { X, Heart } from 'lucide-react'
import styled from 'styled-components'

const MoodCompleteModal = ({ isOpen, onClose, selectedMood }) => {
  if (!isOpen) return null

  const getMoodDisplay = (mood) => {
    const moodMap = {
      '행복': { emoji: '😊', label: '행복해요' },
      '보통': { emoji: '🙂', label: '보통이에요' },
      '슬픔': { emoji: '😢', label: '슬퍼요' },
      '화남': { emoji: '😠', label: '화나요' },
      '걱정': { emoji: '😟', label: '걱정돼요' },
      // API에서 받는 영어 값들도 지원
      'HAPPY': { emoji: '😊', label: '행복해요' },
      'SOSO': { emoji: '🙂', label: '보통이에요' },
      'SAD': { emoji: '😢', label: '슬퍼요' },
      'ANGER': { emoji: '😠', label: '화나요' },
      'WORRY': { emoji: '😟', label: '걱정돼요' }
    }
    return moodMap[mood] || { emoji: '😊', label: '행복해요' }
  }

  const moodDisplay = getMoodDisplay(selectedMood)

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalCard>
          <ModalContent>
            {/* Close Button */}
            <CloseButton onClick={onClose}>
              <X size={14} />
            </CloseButton>

            {/* Content */}
            <ContentWrapper>
              {/* Success Icon with Heart */}
              <IconWrapper>
                <HeartIcon>
                  <Heart size={16} />
                </HeartIcon>
              </IconWrapper>

              {/* Message */}
              <MessageWrapper>
                <Title>감정 기록을 완료하였어요!</Title>
                <MoodDisplay>
                  <MoodInfo>
                    <MoodEmoji>{moodDisplay.emoji}</MoodEmoji>
                    <MoodText>
                      <MoodLabel>오늘 기분</MoodLabel>
                      <MoodValue>{moodDisplay.label}</MoodValue>
                    </MoodText>
                  </MoodInfo>
                </MoodDisplay>
              </MessageWrapper>

              {/* Confirm Button */}
              <ButtonWrapper>
                <ConfirmButton onClick={onClose}>
                  확인
                </ConfirmButton>
              </ButtonWrapper>
            </ContentWrapper>
          </ModalContent>
        </ModalCard>
      </ModalContainer>
    </ModalOverlay>
  )
}

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
`

const ModalContainer = styled.div`
  width: 100%;
  max-width: 22rem;
`

const ModalCard = styled.div`
  border: 1px solid #E0D9F0;
  background: white;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border-radius: 1.5rem;
`

const ModalContent = styled.div`
  padding: 1.25rem;
  padding-bottom: 0.75rem;
  position: relative;
`

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem;
  color: #666666;
  background: none;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #f3f4f6;
  }
`

const ContentWrapper = styled.div`
  text-align: center;
  padding-top: 0.25rem;
`

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 0.75rem;
`

const HeartIcon = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  background: #A89CC8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  
  svg {
    color: white;
    fill: currentColor;
    width: 22px;
    height: 22px;
  }
`

const MessageWrapper = styled.div`
  margin-bottom: 0.75rem;
`

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333333;
  line-height: 1.4;
  margin-bottom: 0.5rem;
`

const MoodDisplay = styled.div`
  background: #F8F6FC;
  border-radius: 0.75rem;
  padding: 0.625rem;
`

const MoodInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
`

const MoodEmoji = styled.span`
  font-size: 2rem;
`

const MoodText = styled.div`
  text-align: left;
`

const MoodLabel = styled.p`
  font-size: 1rem;
  color: #666666;
  margin: 0;
`

const MoodValue = styled.p`
  font-size: 1.125rem;
  color: #333333;
  font-weight: 600;
  margin: 0;
`

const ButtonWrapper = styled.div`
  padding-top: 0.5rem;
`

const ConfirmButton = styled.button`
  width: 100%;
  background: #8A79BA;
  color: white;
  border: none;
  border-radius: 1.2rem;
  padding: 0.875rem;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: #6B5A9E;
  }
`

export default MoodCompleteModal
