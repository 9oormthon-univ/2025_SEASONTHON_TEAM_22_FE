import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { ChevronLeft, Home, Star, Users, Brain, Heart, Calendar, BookOpen } from 'lucide-react'

export default function TrainingDetail() {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentTab, setCurrentTab] = useState('내 마음')

  // location.state에서 데이터 가져오기 (없으면 기본값 사용)
  const date = location.state?.date || '2025.08.30'

  const navItems = [
    { label: '홈', active: currentTab === '홈', icon: Home },
    { label: '활동 추천', active: currentTab === '활동 추천', icon: Star },
    { label: '커뮤니티', active: currentTab === '커뮤니티', icon: Users },
    { label: '마음 훈련', active: currentTab === '마음 훈련', icon: BookOpen },
    { label: '내 마음', active: currentTab === '내 마음', icon: Heart }
  ];

  const handleTabClick = (tabLabel) => {
    if (tabLabel === '홈') {
      navigate('/');
    } else {
      setCurrentTab(tabLabel);
      navigate(`/${tabLabel === '활동 추천' ? 'recommend' : 
                      tabLabel === '커뮤니티' ? 'community' :
                      tabLabel === '마음 훈련' ? 'training' :
                      tabLabel === '내 마음' ? 'mypage' : ''}`);
    }
  };

  const handleBack = () => {
    navigate('/training-record');
  };

  // 해당 날짜의 질문과 답변 데이터
  const questionsAnswers = [
    {
      category: '감정',
      question: '오늘 하루 중 가장 기분 좋았던 순간은 언제인가요?',
      answer: '친구랑 맛있는 저녁 먹어서 좋았어요.'
    },
    {
      category: '자기애',
      question: '나는 언제 가장 나답다고 느끼나요?',
      answer: '일상에서의 하는 프로그램에 집중할때요'
    },
    {
      category: '관계',
      question: '고마움을 표현하고 싶은 사람이 있나요?',
      answer: '아빠요. 항상 챙겨주셔서 감사해요.'
    },
    {
      category: '감정조절',
      question: '화가 날 때 나는 어떤 행동을 하나요?',
      answer: '말수가 줄고 말이 틀어가라요.'
    },
    {
      category: '미래계획',
      question: '내일 하고 싶은 작은 일 하나는?',
      answer: '운동 30분 하기'
    },
    {
      category: '자기돌봄',
      question: '최근에 도전해볼 것을이 있나요?',
      answer: '떡볶이 만들어 먹어어라요.'
    }
  ];

  const getCategoryStyle = (category) => {
    const styles = {
      '감정': { bgColor: '#FFE1E6', textColor: '#C2185B' },
      '자기애': { bgColor: '#E8F5E8', textColor: '#2E7D2E' },
      '관계': { bgColor: '#E3F2FD', textColor: '#1976D2' },
      '감정조절': { bgColor: '#FFF3E0', textColor: '#F57C00' },
      '미래계획': { bgColor: '#F3E5F5', textColor: '#7B1FA2' },
      '자기돌봄': { bgColor: '#E0F2F1', textColor: '#00695C' }
    };
    return styles[category] || { bgColor: '#F5F5F5', textColor: '#666666' };
  };

  return (
    <Container>
      {/* Header */}
      <Header>
        <HeaderContent>
          <BackButton onClick={handleBack}>
            <ChevronLeft size={20} color="#333333" />
          </BackButton>
          <HeaderTitle>마음 훈련 기록</HeaderTitle>
          <HeaderSpacer />
        </HeaderContent>
      </Header>

      {/* Main Content */}
      <MainContent>
        <ContentWrapper>
          {/* Date Header */}
          <DateHeader>
            <DateIcon>
              <Calendar size={20} color="#7E6BB5" />
            </DateIcon>
            <DateTitle>{date}</DateTitle>
          </DateHeader>

          {/* Questions and Answers */}
          <QuestionsList>
            {questionsAnswers.map((qa, index) => {
              const categoryStyle = getCategoryStyle(qa.category);
              return (
                <QuestionCard key={index}>
                  {/* Category Badge */}
                  <CategoryBadge>
                    <Badge $bgColor={categoryStyle.bgColor} $textColor={categoryStyle.textColor}>
                      {qa.category}
                    </Badge>
                  </CategoryBadge>

                  {/* Question */}
                  <QuestionSection>
                    <QuestionLabel>Q.</QuestionLabel>
                    <QuestionText>{qa.question}</QuestionText>
                  </QuestionSection>

                  {/* Answer */}
                  <AnswerSection>
                    <AnswerLabel>A.</AnswerLabel>
                    <AnswerText>{qa.answer}</AnswerText>
                  </AnswerSection>
                </QuestionCard>
              );
            })}
          </QuestionsList>

          {/* Completion Summary */}
          <CompletionSummary>
            <SummaryContent>
              <SummaryIcon>
                <Brain size={20} color="white" />
              </SummaryIcon>
              <SummaryTitle>훈련 완료!</SummaryTitle>
              <SummaryText>{questionsAnswers.length}개의 질문에 답변하셨어요</SummaryText>
              <SummaryMessage>꾸준한 마음 훈련으로 더 건강한 마음을 가꿔보세요 ✨</SummaryMessage>
            </SummaryContent>
          </CompletionSummary>
        </ContentWrapper>
      </MainContent>

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

const Container = styled.div`
  min-height: 100vh;
  background: #F2F2FC;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Header = styled.div`
  background: white;
  padding: 1.6rem;
  border-bottom: 1px solid #E0D9F0;
`;

const HeaderContent = styled.div`
  max-width: 38.4rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
`;

const BackButton = styled.button`
  padding: 0.8rem;
  border-radius: 0.8rem;
  transition: background-color 0.2s;
  
  &:hover {
    background: #F2F2FC;
  }
`;

const HeaderTitle = styled.h1`
  flex: 1;
  text-align: center;
  font-weight: 500;
  color: #333333;
  font-size: 1.8rem;
`;

const HeaderSpacer = styled.div`
  width: 4rem;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 1.6rem;
  padding-bottom: 9.6rem;
`;

const ContentWrapper = styled.div`
  max-width: 38.4rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

const DateHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 2.4rem;
`;

const DateIcon = styled.div`
  width: 4rem;
  height: 4rem;
  background: #F8F6FF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DateTitle = styled.h2`
  font-size: 2rem;
  font-weight: 500;
  color: #333333;
`;

const QuestionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

const QuestionCard = styled.div`
  background: white;
  border-radius: 1.2rem;
  border: 1px solid #E0D9F0;
  padding: 1.6rem;
`;

const CategoryBadge = styled.div`
  margin-bottom: 1.2rem;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 0.4rem 1.2rem;
  border-radius: 2rem;
  font-size: 1.2rem;
  font-weight: 500;
  background: ${props => props.$bgColor};
  color: ${props => props.$textColor};
`;

const QuestionSection = styled.div`
  margin-bottom: 1.2rem;
`;

const QuestionLabel = styled.p`
  font-size: 1.4rem;
  color: #666666;
  margin-bottom: 0.4rem;
`;

const QuestionText = styled.p`
  color: #333333;
  line-height: 1.6;
`;

const AnswerSection = styled.div``;

const AnswerLabel = styled.p`
  font-size: 1.4rem;
  color: #666666;
  margin-bottom: 0.4rem;
`;

const AnswerText = styled.p`
  color: #333333;
  line-height: 1.6;
`;

const CompletionSummary = styled.div`
  background: #F8F6FF;
  border-radius: 1.2rem;
  border: 1px solid #E0D9F0;
  padding: 1.6rem;
  margin-top: 2.4rem;
`;

const SummaryContent = styled.div`
  text-align: center;
`;

const SummaryIcon = styled.div`
  width: 4.8rem;
  height: 4.8rem;
  background: #7E6BB5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.2rem;
`;

const SummaryTitle = styled.h3`
  font-weight: 500;
  color: #333333;
  margin-bottom: 0.8rem;
`;

const SummaryText = styled.p`
  font-size: 1.4rem;
  color: #666666;
`;

const SummaryMessage = styled.p`
  font-size: 1.2rem;
  color: #7E6BB5;
  margin-top: 0.8rem;
`;

const BottomNav = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #E0D9F0;
  padding: 0.8rem 1.6rem;
`;

const NavContent = styled.div`
  max-width: 38.4rem;
  margin: 0 auto;
`;

const NavItems = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.8rem 0.4rem;
  font-size: 1.2rem;
  transition: color 0.2s;
  color: ${props => props.$active ? '#7E6BB5' : '#999999'};
  
  &:hover {
    color: ${props => props.$active ? '#7E6BB5' : '#666666'};
  }
`;

const NavIcon = styled.div`
  margin-bottom: 0.4rem;
  transition: color 0.2s;
  color: ${props => props.$active ? '#7E6BB5' : '#999999'};
`;