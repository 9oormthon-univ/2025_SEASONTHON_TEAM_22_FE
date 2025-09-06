import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { useState, useEffect } from 'react'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'
import { Check, Home, Star, Users, BookOpen, Heart } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getPrevious, getNext } from '../services/questionCardApi'
import { createAnswer } from '../services/answerApi'
import { toast } from 'sonner'

export default function Training() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // 기본 질문 데이터 (API 실패 시 사용)
  const defaultQuestions = [
    {
      id: 1,
      cardType: "감정 이해",
      content: "오늘 하루 중 가장 기분 좋았던 순간이 언제인가요?",
      placeholder: "자유롭게 생각을 작성해보세요...",
    },
    {
      id: 2,
      cardType: "자기 이해",
      content: "나는 언제 나답다고 느끼나요?",
      placeholder: "자유롭게 생각을 작성해보세요...",
    },
    {
      id: 3,
      cardType: "관계 이해",
      content:
        "내 주변 사람들 중 가장 소중한 사람은 누구인가요? 그 이유는 무엇인가요?",
      placeholder: "자유롭게 생각을 작성해보세요...",
    },
    {
      id: 4,
      cardType: "목표 설정",
      content: "내가 이루고 싶은 작은 목표가 있다면 무엇인가요?",
      placeholder: "자유롭게 생각을 작성해보세요...",
    },
    {
      id: 5,
      cardType: "감사 표현",
      content: "오늘 감사했던 일이나 사람이 있다면 무엇인가요?",
      placeholder: "자유롭게 생각을 작성해보세요...",
    },
    {
      id: 6,
      cardType: "미래 계획",
      content: "내일은 어떤 하루가 되었으면 좋겠나요?",
      placeholder: "자유롭게 생각을 작성해보세요...",
    },
  ];

  const [questions, setQuestions] = useState(defaultQuestions);
  // --- 1. idx 상태를 제거하고 currentQuestionId를 유일한 상태 기준으로 사용 ---
  const [currentQuestionId, setCurrentQuestionId] = useState(
    defaultQuestions[0].id
  );
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // --- 2. id를 기준으로 현재 질문(current)과 순서(currentIndex)를 동적으로 계산 ---
  const currentIndex = questions.findIndex((q) => q.id === currentQuestionId);
  const current = questions[currentIndex];
  const total = questions.length;
  
  // 디버깅용 로그
  console.log('현재 질문 정보:', { currentIndex, current, total, currentQuestionId });
  const answeredCount = Object.keys(answers).filter(
    (k) => (answers[k] || "").trim().length > 0
  ).length;

  // 모든 질문이 완료되었는지 확인
  const allQuestionsAnswered = questions.every(
    (question) => answers[question.id]?.trim().length > 0
  );
  const isCompleted = allQuestionsAnswered && answeredCount === total;

  // --- 3. 핸들러 로직을 idx 대신 currentIndex 기준으로 변경 ---
  // 이전 질문 카드 조회
  const handlePreviousQuestion = () => {
    if (currentIndex <= 0) return;
    const previousQuestionId = questions[currentIndex - 1].id;
    setCurrentQuestionId(previousQuestionId);
    // API 호출 로직은 필요 시 유지할 수 있으나, 현재는 ID 기반 네비게이션에 집중
  };

  // 다음 질문 카드 조회
  const handleNextQuestion = () => {
    if (currentIndex >= total) return;
    const nextQuestionId = questions[currentIndex + 1].id;
    setCurrentQuestionId(nextQuestionId);
    // API 호출 로직은 필요 시 유지할 수 있으나, 현재는 ID 기반 네비게이션에 집중
  };

  // 답변 저장
  const handleSaveAnswer = async () => {
    // current가 존재하지 않는 경우를 방어
    if (!current || !currentUser?.id || !answers[current.id]?.trim()) {
      console.log('답변 저장 조건 미충족:', { current, currentUser, answer: answers[current?.id] });
      return;
    }

    try {
      console.log('답변 저장 시도:', {
        memberId: currentUser.id,
        questionCardId: current.id,
        content: answers[current.id]
      });
      
      await createAnswer(
        currentUser.id,
        current.id,
        answers[current.id]
      );
      toast.success("답변이 저장되었습니다.");
    } catch (error) {
      console.error("답변 저장 실패:", error);
      toast.error("답변 저장에 실패했습니다.");
    }
  };

  const handleComplete = () => {
    // 완료 후 데이터 초기화하고 홈으로 이동
    setAnswers({});
    // 첫 번째 질문으로 상태 초기화
    setCurrentQuestionId(defaultQuestions[0].id);
    setQuestions(defaultQuestions);
    navigate("/");
  };

  const handleTabClick = (tabLabel) => {
    if (tabLabel === "홈") {
      navigate("/");
    } else {
      navigate(
        `/${
          tabLabel === "활동 추천"
            ? "recommend"
            : tabLabel === "커뮤니티"
            ? "community"
            : tabLabel === "마음 훈련"
            ? "training"
            : tabLabel === "내 마음"
            ? "mypage"
            : ""
        }`
      );
    }
  };

  const navItems = [
    { label: "홈", active: false, icon: Home },
    { label: "활동 추천", active: false, icon: Star },
    { label: "커뮤니티", active: false, icon: Users },
    { label: "마음 훈련", active: true, icon: BookOpen },
    { label: "내 마음", active: false, icon: Heart },
  ];

  // 완료 화면
  if (isCompleted) {
    return (
      <CompletionWrap>
        {/* Header */}
        <CompletionHeader>
          <CompletionHeaderContent>
            <HeaderSpacer />
            <CompletionHeaderTitle>마음 훈련</CompletionHeaderTitle>
            <HeaderSpacer />
          </CompletionHeaderContent>
        </CompletionHeader>

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
            <CompletionTitle>마음 훈련 성공!</CompletionTitle>

            <CompletionMessage>
              6개의 질문에 모두 답하며
              <br />
              소중한 마음 여행을 완성했어요! 🚀
            </CompletionMessage>

            {/* Stats Card */}
            <StatsCard>
              <StatsGrid>
                <StatItem>
                  <StatNumber>6</StatNumber>
                  <StatLabel>완료한 질문</StatLabel>
                </StatItem>
                <StatItem>
                  <StatNumber>100%</StatNumber>
                  <StatLabel>달성률</StatLabel>
                </StatItem>
                <StatItem>
                  <StatEmoji>⭐</StatEmoji>
                  <StatLabel>성취 완료</StatLabel>
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
            <HomeButton onClick={handleComplete}>홈으로 돌아가기</HomeButton>

            {/* Small decorative text */}
            <DecorativeText>내일도 함께 마음을 돌봐요 🌱</DecorativeText>
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
      </CompletionWrap>
    );
  }

  return (
    <Wrap>
      <PageHeader title="마음 훈련" />

      <Card>
        <RowBetween>
          <SmallMuted>진행률</SmallMuted>
          <SmallStrong>
            {answeredCount}/{total}
          </SmallStrong>
        </RowBetween>
        <Progress>
          <ProgressBar width={`${(answeredCount / total) * 100}%`} />
        </Progress>
      </Card>

      <QuestionCard>
        <Badge>{current.cardType}</Badge>
        <Question>{current.content}</Question>
      </QuestionCard>

      <NavRow>
        <NavBtn
          // --- 수정: 'idx' 대신 'currentIndex' 사용 ---
          disabled={currentIndex === 0 || isLoading}
          onClick={handlePreviousQuestion}
        >
          <IoChevronBack size={16} />
          <span>이전</span>
        </NavBtn>
        <Dots>
          {questions.map((q, i) => {
            const done = (answers[q.id] || "").trim().length > 0;
            return (
              <Dot
                key={q.id}
                // --- 수정: 'idx' 대신 'currentIndex'로 활성 상태 체크 ---
                $active={i === currentIndex}
                $done={done}
                // --- 수정: 클릭 시 'idx'가 아닌 'currentQuestionId'를 변경 ---
                onClick={() => setCurrentQuestionId(q.id)}
              />
            );
          })}
        </Dots>
        <NavBtn
          // --- 수정: 'idx' 대신 'currentIndex' 사용 ---
          disabled={currentIndex === total - 1 || isLoading}
          onClick={handleNextQuestion}
        >
          <span>다음</span>
          <IoChevronForward size={16} />
        </NavBtn>
      </NavRow>

      <AnswerCard>
        <SectionTitle>내 생각 적어보기</SectionTitle>
        <Textarea
          placeholder={current.placeholder}
          value={answers[current.id] || ""}
          onChange={(e) =>
            setAnswers((prev) => ({ ...prev, [current.id]: e.target.value }))
          }
        />
        <RightMuted>{(answers[current.id] || "").length}/500</RightMuted>

        <Buttons>
          <GhostButton
            onClick={() => {
              // --- 수정: 'idx' 대신 'currentQuestionId'를 초기화 ---
              setCurrentQuestionId(defaultQuestions[0].id);
              setAnswers({});
            }}
          >
            그만하기
          </GhostButton>
          <PrimaryButton
            disabled={!(answers[current.id] || "").trim() || isLoading}
            onClick={async () => {
              // 6번 질문은 API 호출하지 않고 바로 완료 처리
              if (current.id === 6) {
                toast.success('모든 질문이 완료되었습니다!')
                navigate('/training-record')
                return;
              }
              
              await handleSaveAnswer();
              // 마지막 질문이 아닌 경우에만 다음 질문으로 이동
              if (currentIndex < total - 1) {
                await handleNextQuestion();
              } else {
                // 마지막 질문 완료 시 완료 처리
                toast.success('모든 질문이 완료되었습니다!')
                navigate('/training-record')
              }
            }}
          >
            {isLoading ? "저장 중..." : (currentIndex < total - 1 ? "저장하기" : "완료하기")}
          </PrimaryButton>
        </Buttons>
      </AnswerCard>
    </Wrap>
  );
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
  width: ${props => props.width || '0%'};
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
  background: ${p=> p.$active ? 'var(--primary)' : p.$done ? 'rgba(138,121,186,0.6)' : 'var(--border)'};
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

// Completion Screen Styles
const CompletionWrap = styled.div`
  min-height: 100vh;
  background: #F2F2FC;
  display: flex;
  flex-direction: column;
  position: relative;
`

const CompletionHeader = styled.div`
  background: white;
  padding: 2.4rem 1.6rem;
  border-bottom: 1px solid #E0D9F0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const CompletionHeaderContent = styled.div`
  max-width: 38.4rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
`

const CompletionHeaderTitle = styled.h1`
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
  background: linear-gradient(135deg, #7E6BB5 0%, #9B8BC7 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 40px rgba(126, 107, 181, 0.3);
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
  color: #7E6BB5;
`

const StatEmoji = styled.div`
  font-size: 2.4rem;
  font-weight: bold;
  color: #7E6BB5;
`

const StatLabel = styled.div`
  font-size: 1.2rem;
  color: #666666;
`

const MotivationalCard = styled.div`
  background: linear-gradient(90deg, rgba(126, 107, 181, 0.1) 0%, rgba(155, 139, 199, 0.1) 100%);
  border-radius: 1.6rem;
  padding: 1.6rem;
  margin-bottom: 3.2rem;
  border: 1px solid rgba(126, 107, 181, 0.2);
`

const MotivationalText = styled.p`
  color: #7E6BB5;
  font-size: 1.4rem;
  font-weight: 500;
`

const HomeButton = styled.button`
  width: 100%;
  max-width: 22rem;
  background: linear-gradient(90deg, #7E6BB5 0%, #9B8BC7 100%);
  color: white;
  border-radius: 1.6rem;
  padding: 1.6rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 8px 24px rgba(126, 107, 181, 0.3);
  
  &:hover {
    background: linear-gradient(90deg, #6B5A9E 0%, #8A7AB8 100%);
    box-shadow: 0 12px 32px rgba(126, 107, 181, 0.4);
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
  color: ${props => props.$active ? '#7E6BB5' : '#999999'};
  
  &:hover {
    color: ${props => props.$active ? '#7E6BB5' : '#666666'};
  }
`

const NavIcon = styled.div`
  margin-bottom: 0.4rem;
  transition: color 0.2s;
  color: ${props => props.$active ? '#7E6BB5' : '#999999'};
`
