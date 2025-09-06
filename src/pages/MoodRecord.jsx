import styled from 'styled-components';
import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { getEmotions, getMonthlyEmotionStats } from '../services/emotionApi';
import { useAuth } from '../contexts/AuthContext';

// ----------------------------------------------------------------
// #region 유틸리티 함수 (별도 파일(utils.js)로 분리하는 것을 권장)
// ----------------------------------------------------------------

// API 데이터를 차트 형식으로 변환하는 함수
const convertApiDataToChartFormat = (apiData) => {
  if (!apiData || apiData.length === 0) return [];
  
  const emotionColors = {
    '행복': '#FFD700', '보통': '#C0C0C0', '슬픔': '#87CEEB',
    '화남': '#FFA500', '걱정': '#FF6B6B'
  };

  return apiData.map(weekData => {
    const moods = [];
    const percentages = weekData.percentages;
    Object.entries(percentages).forEach(([emotion, percentage]) => {
      if (percentage > 0) {
        moods.push({
          emotion: emotion.toLowerCase(),
          percentage,
          color: emotionColors[emotion] || '#CCCCCC'
        });
      }
    });
    return { week: `${weekData.week}주차`, moods };
  });
};

// 감정 타입에 따른 이모지 반환
const getEmojiByMood = (mood) => ({
  'happy': '😊', 'neutral': '😐', 'sad': '😢', 'angry': '😠', 'worried': '😰'
}[mood] || '😐');

// 감정 타입에 따른 텍스트 반환
const getMoodText = (mood) => ({
  'happy': '행복해요', 'neutral': '보통이에요', 'sad': '슬퍼요',
  'angry': '화나요', 'worried': '걱정돼요'
}[mood] || '보통이에요');

// 날짜 포맷팅
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

// #endregion

// ----------------------------------------------------------------
// #region 더미 데이터 (미래 시점용)
// ----------------------------------------------------------------

const dummyMonthlyData = [
  { week: 1, percentages: { "행복": 30, "보통": 40, "슬픔": 20, "화남": 5, "걱정": 5 }},
  { week: 2, percentages: { "행복": 25, "보통": 35, "슬픔": 25, "화남": 10, "걱정": 5 }},
  { week: 3, percentages: { "행복": 40, "보통": 30, "슬픔": 15, "화남": 10, "걱정": 5 }},
  { week: 4, percentages: { "행복": 35, "보통": 25, "슬픔": 20, "화남": 15, "걱정": 5 }},
  { week: 5, percentages: { "행복": 20, "보통": 30, "슬픔": 25, "화남": 15, "걱정": 10 }}
];

// #endregion


export default function MoodRecord() {
  const { currentUser } = useAuth();
  
  // 상태 관리
  const [recentEmotions, setRecentEmotions] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 현재 시스템의 실제 월과 년도
  const now = new Date();
  const currentSystemMonth = now.getMonth() + 1;
  const currentSystemYear = now.getFullYear();

  // 사용자가 선택한 월 (1-12). 기본값은 현재 시스템 월.
  const [selectedMonth, setSelectedMonth] = useState(currentSystemMonth);

  // '최근 감정 기록' 목록을 가져오는 Effect (한 번만 실행)
  useEffect(() => {
    const fetchRecentEmotions = async () => {
      try {
        const response = await getEmotions({ page: 0, size: 7, sort: ['createdAt,desc'] });
        setRecentEmotions(response.content || []);
      } catch (err) {
        console.error('최근 감정 기록 로드 실패:', err);
      }
    };
    fetchRecentEmotions();
  }, []);

  // 월간 통계를 가져오는 Effect (선택한 월이 바뀔 때마다 실행)
  useEffect(() => {
    const fetchOrUseDummyStats = async () => {
      if (!currentUser?.id) return;
      
      setLoading(true);
      setError(null);
      
      // 백엔드 년도는 2025로 고정
      const targetYear = 2025;

      // 요청하려는 년/월이 시스템의 현재 년/월보다 미래인지 확인
      const isFuture = targetYear > currentSystemYear || 
                      (targetYear === currentSystemYear && selectedMonth > currentSystemMonth);

      if (isFuture) {
        console.log(`[DUMMY DATA] ${targetYear}년 ${selectedMonth}월은 미래 시점이므로 더미 데이터를 사용합니다.`);
        setMonthlyStats(dummyMonthlyData);
        setLoading(false);
      } else {
        try {
          console.log(`[API CALL] ${targetYear}년 ${selectedMonth}월 데이터를 API로 요청합니다.`);
          const response = await getMonthlyEmotionStats(currentUser.id, targetYear, selectedMonth);
          setMonthlyStats(response.data || []);
        } catch (err) {
          console.error('월간 감정 통계 로드 실패:', err);
          setError('데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
          setMonthlyStats([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrUseDummyStats();
  }, [currentUser?.id, selectedMonth, currentSystemYear, currentSystemMonth]);

  // UI 렌더링을 위한 데이터 가공
  const weeklyChartData = convertApiDataToChartFormat(monthlyStats);
  const recentRecordsData = recentEmotions.map(e => ({
    emoji: getEmojiByMood(e.mood),
    mood: getMoodText(e.mood),
    date: formatDate(e.createdAt),
    reason: e.reason || e.note || '감정 기록'
  }));

  const moodLabels = [
    { color: '#FFD700', label: '행복' }, { color: '#C0C0C0', label: '보통' },
    { color: '#87CEEB', label: '슬픔' }, { color: '#FFA500', label: '화남' },
    { color: '#FF6B6B', label: '걱정' }
  ];

  const previousSystemMonth = currentSystemMonth === 1 ? 12 : currentSystemMonth - 1;

  return (
    <Wrap>
      <PageHeader title="감정 기록" />
      
      <Card>
        <CardBody>
          <MonthSelector>
            <MonthButton 
              $active={selectedMonth === currentSystemMonth} 
              onClick={() => setSelectedMonth(currentSystemMonth)}
            >
              이번 달
            </MonthButton>
            <MonthButton 
              $active={selectedMonth === previousSystemMonth} 
              onClick={() => setSelectedMonth(previousSystemMonth)}
            >
              지난 달
            </MonthButton>
          </MonthSelector>
          
          {loading && <LoadingMessage>데이터를 불러오는 중...</LoadingMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          {!loading && !error && (
            weeklyChartData.length > 0 ? (
              <>
                <ChartRow>
                  {weeklyChartData.map((week, wi) => (
                    <WeekCol key={wi}>
                      <Bars>
                        {week.moods.map((m, mi) => (
                          <Bar key={mi} height={`${m.percentage * 1.2 + 12}px`} background={m.color} />
                        ))}
                      </Bars>
                      <WeekLabel>{week.week}</WeekLabel>
                    </WeekCol>
                  ))}
                </ChartRow>
                <Legend>
                  {moodLabels.map((m, i) => (
                    <LegendItem key={i}>
                      <LegendColor background={m.color} />
                      <LegendText>{m.label}</LegendText>
                    </LegendItem>
                  ))}
                </Legend>
              </>
            ) : (
              <EmptyMessage>해당 월의 통계 데이터가 없습니다.</EmptyMessage>
            )
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Title>최근 감정 기록</Title>
          <Records>
            {recentRecordsData.length > 0 ? recentRecordsData.map((r, i) => (
              <Record key={i}>
                <Emoji>{r.emoji}</Emoji>
                <RecordMain>
                  <RecordTop>
                    <RecordMood>{r.mood}</RecordMood>
                    <RecordDate>{r.date}</RecordDate>
                  </RecordTop>
                  <Reason>{r.reason}</Reason>
                </RecordMain>
              </Record>
            )) : (
              <EmptyMessage>최근 감정 기록이 없습니다.</EmptyMessage>
            )}
          </Records>
        </CardBody>
      </Card>
    </Wrap>
  );
}

// ----------------------------------------------------------------
// #region Styled Components
// ----------------------------------------------------------------

const Wrap = styled.div`
  padding: 0 1.6rem 8rem;
`;

const Card = styled.div`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 1.2rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
  margin-top: 1.6rem;
`;

const CardBody = styled.div`
  padding: 1.6rem;
`;

const MonthSelector = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-bottom: 1.6rem;
  justify-content: center;
`;

const MonthButton = styled.button`
  padding: 0.8rem 1.6rem;
  border: 2px solid ${props => props.$active ? '#7E6BB5' : '#E0D9F0'};
  background: ${props => props.$active ? '#7E6BB5' : 'white'};
  color: ${props => props.$active ? 'white' : '#7E6BB5'};
  border-radius: 2rem;
  font-size: 1.4rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #7E6BB5;
    background: ${props => props.$active ? '#7E6BB5' : '#F8F6FF'};
  }
`;

const ChartRow = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 20rem;
  padding: 0 1rem;
  margin-bottom: 1.2rem;
`;

const WeekCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
`;

const Bars = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
  align-items: center;
  height: 16rem;
  gap: 0.4rem;
`;

const Bar = styled.div`
  width: 1.6rem;
  border-radius: 0.2rem;
  height: ${props => props.height || '12px'};
  background: ${props => props.background || '#ccc'};
`;

const WeekLabel = styled.span`
  color: #666666;
  font-size: 1.2rem;
`;

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.2rem;
  margin-top: 1.2rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const LegendColor = styled.div`
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 0.2rem;
  background: ${props => props.background || '#ccc'};
`;

const LegendText = styled.span`
  color: #666666;
  font-size: 1.2rem;
`;

const Title = styled.h3`
  margin: 0 0 1.2rem 0;
  font-size: 1.6rem;
  color: var(--foreground);
`;

const Records = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const Record = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  background: #F8F8FA;
  border-radius: 0.8rem;
  padding: 1.2rem;
`;

const Emoji = styled.span`
  font-size: 2.2rem;
`;

const RecordMain = styled.div`
  flex: 1;
`;

const RecordTop = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const RecordMood = styled.span`
  font-weight: var(--font-weight-medium);
  color: var(--foreground);
`;

const RecordDate = styled.span`
  color: #666666;
  font-size: 1.2rem;
`;

const Reason = styled.p`
  margin: 0.4rem 0 0 0;
  color: #666666;
  font-size: 1.4rem;
`;

const Message = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #666666;
  font-size: 1.4rem;
  min-height: 20rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingMessage = styled(Message)``;

const EmptyMessage = styled(Message)``;

const ErrorMessage = styled(Message)`
  color: #ff6b6b;
  background: #fff5f5;
  border-radius: 0.8rem;
`;

// #endregion