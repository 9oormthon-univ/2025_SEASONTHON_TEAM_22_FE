import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Check, Home, Star, Users, BookOpen, Heart } from 'lucide-react';

export default function ActivityCompletion() {
  const navigate = useNavigate();
  
  // URL에서 activityTitle과 activityDuration 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const activityTitle = urlParams.get('title') || '활동';
  const activityDuration = urlParams.get('duration') || '5분';

  const navItems = [
    { label: '홈', active: false, icon: Home },
    { label: '활동 추천', active: true, icon: Star },
    { label: '커뮤니티', active: false, icon: Users },
    { label: '마음 훈련', active: false, icon: BookOpen },
    { label: '내 마음', active: false, icon: Heart }
  ];

  const handleTabClick = (tabLabel) => {
    if (tabLabel === '홈') {
      navigate('/');
    } else {
      navigate(`/${tabLabel === '활동 추천' ? 'recommend' : 
                      tabLabel === '커뮤니티' ? 'community' :
                      tabLabel === '마음 훈련' ? 'training' :
                      tabLabel === '내 마음' ? 'mypage' : ''}`);
    }
  };

  const handleComplete = () => {
    navigate('/');
  };

  return (
    <Container>
      {/* Header */}
      <Header>
        <HeaderContent>
          <HeaderSpacer />
          <HeaderTitle>활동 추천</HeaderTitle>
          <HeaderSpacer />
        </HeaderContent>
      </Header>

      {/* Completion Content */}
      <CompletionContent>
        <CompletionWrapper>
          {/* Success Animation */}
          <SuccessAnimation>
            <SuccessIconContainer>
              <SuccessIcon>
                <Check size={48} color="white" strokeWidth={3} />
              </SuccessIcon>
              {/* Decorative circles */}
              <DecorativeCircle1 />
              <DecorativeCircle2 />
            </SuccessIconContainer>
          </SuccessAnimation>

          {/* Completion Message */}
          <CompletionTitle>
            활동 완료!
          </CompletionTitle>

          <CompletionMessage>
            {activityTitle}을(를) 성공적으로 완료했어요!<br/>
            마음이 한결 편안해졌을 거예요 🚀
          </CompletionMessage>

          {/* Stats Card */}
          <StatsCard>
            <StatsGrid>
              <StatItem>
                <StatNumber>{activityDuration}</StatNumber>
                <StatLabel>소요 시간</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>100%</StatNumber>
                <StatLabel>달성률</StatLabel>
              </StatItem>
              <StatItem>
                <StatEmoji>⭐</StatEmoji>
                <StatLabel>완료</StatLabel>
              </StatItem>
            </StatsGrid>
          </StatsCard>

          {/* Motivational Message */}
          <MotivationalCard>
            <MotivationalText>
              "오늘도 한 걸음 더 나아간 당신이 정말 자랑스러워요! 💪"
            </MotivationalText>
          </MotivationalCard>

          {/* Home Button */}
          <HomeButton onClick={handleComplete}>
            홈으로 돌아가기
          </HomeButton>

          {/* Small decorative text */}
          <DecorativeText>
            내일도 함께 마음을 돌봐요 🌱
          </DecorativeText>
        </CompletionWrapper>
      </CompletionContent>

      {/* Bottom Navigation */}
      <BottomNav>
        <NavContent>
          <NavItems>
            {navItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <NavButton
                  key={index}
                  onClick={() => handleTabClick(item.label)}
                  $active={item.active}
                >
                  <NavIcon $active={item.active}>
                    <IconComponent size={20} />
                  </NavIcon>
                  {item.label}
                </NavButton>
              );
            })}
          </NavItems>
        </NavContent>
      </BottomNav>
    </Container>
  );
}

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: #F2F2FC;
  display: flex;
  flex-direction: column;
  position: relative;
`

const Header = styled.div`
  background: white;
  padding: 2.4rem 1.6rem;
  border-bottom: 1px solid #E0D9F0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const HeaderContent = styled.div`
  max-width: 38.4rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
`

const HeaderTitle = styled.h1`
  flex: 1;
  text-align: center;
  font-size: 1.8rem;
  font-weight: 500;
  color: #333333;
`

const HeaderSpacer = styled.div`
  width: 4rem;
`

const CompletionContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.4rem;
  background: linear-gradient(135deg, #F8F6FF 0%, #F2F2FC 50%, #E8E3FF 100%);
`

const CompletionWrapper = styled.div`
  max-width: 38.4rem;
  margin: 0 auto;
  text-align: center;
`

const SuccessAnimation = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3.2rem;
`

const SuccessIconContainer = styled.div`
  position: relative;
`

const SuccessIcon = styled.div`
  width: 9.6rem;
  height: 9.6rem;
  background: linear-gradient(135deg, #8A79BA 0%, #9B8BC7 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 40px rgba(138, 121, 186, 0.3);
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`

const DecorativeCircle1 = styled.div`
  position: absolute;
  top: -0.8rem;
  right: -0.8rem;
  width: 2.4rem;
  height: 2.4rem;
  background: #FFD700;
  border-radius: 50%;
  animation: ping 2s infinite;
  
  @keyframes ping {
    0% { transform: scale(1); opacity: 1; }
    75%, 100% { transform: scale(1.5); opacity: 0; }
  }
`

const DecorativeCircle2 = styled.div`
  position: absolute;
  bottom: -0.4rem;
  left: -0.4rem;
  width: 1.6rem;
  height: 1.6rem;
  background: #FF6B9D;
  border-radius: 50%;
  animation: ping 2s infinite;
  animation-delay: 0.3s;
`

const CompletionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 500;
  color: #333333;
  margin-bottom: 1.6rem;
`

const CompletionMessage = styled.p`
  color: #666666;
  margin-bottom: 3.2rem;
  line-height: 1.6;
  padding: 0 1.6rem;
`

const StatsCard = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 1.6rem;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 2.4rem;
  margin-bottom: 3.2rem;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.6rem;
`

const StatItem = styled.div`
  text-align: center;
`

const StatNumber = styled.div`
  font-size: 2.4rem;
  font-weight: bold;
  color: #8A79BA;
`

const StatEmoji = styled.div`
  font-size: 2.4rem;
  font-weight: bold;
  color: #8A79BA;
`

const StatLabel = styled.div`
  font-size: 1.2rem;
  color: #666666;
`

const MotivationalCard = styled.div`
  background: linear-gradient(90deg, rgba(138, 121, 186, 0.1) 0%, rgba(155, 139, 199, 0.1) 100%);
  border-radius: 1.6rem;
  padding: 1.6rem;
  margin-bottom: 3.2rem;
  border: 1px solid rgba(138, 121, 186, 0.2);
`

const MotivationalText = styled.p`
  color: #8A79BA;
  font-size: 1.4rem;
  font-weight: 500;
`

const HomeButton = styled.button`
  width: 100%;
  max-width: 22rem;
  background: linear-gradient(90deg, #8A79BA 0%, #9B8BC7 100%);
  color: white;
  border-radius: 1.6rem;
  padding: 1.6rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 8px 24px rgba(138, 121, 186, 0.3);
  
  &:hover {
    background: linear-gradient(90deg, #6B5A9E 0%, #8A7AB8 100%);
    box-shadow: 0 12px 32px rgba(138, 121, 186, 0.4);
    transform: scale(1.05);
  }
`

const DecorativeText = styled.p`
  font-size: 1.2rem;
  color: #999999;
  margin-top: 2.4rem;
`

const BottomNav = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #E0D9F0;
  padding: 0.8rem 1.6rem;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
`

const NavContent = styled.div`
  max-width: 38.4rem;
  margin: 0 auto;
`

const NavItems = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const NavButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.8rem 0.4rem;
  font-size: 1.2rem;
  transition: color 0.2s;
  color: ${props => props.$active ? '#8A79BA' : '#999999'};
  
  &:hover {
    color: ${props => props.$active ? '#8A79BA' : '#666666'};
  }
`

const NavIcon = styled.div`
  margin-bottom: 0.4rem;
  transition: color 0.2s;
  color: ${props => props.$active ? '#8A79BA' : '#999999'};
`
