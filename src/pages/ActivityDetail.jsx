import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import PageHeader from '../components/PageHeader'
import { Users, BookOpen, MapPin, Calendar, Clock } from 'lucide-react'
import { getActivity } from '../services/activityApi'
import useApplicationsStore from '../stores/applicationsStore'

export default function ActivityDetail() {
  const { id } = useParams()
  const [activity, setActivity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // 신청한 활동 스토어
  const { applyActivity, isApplied } = useApplicationsStore()

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true)
        const data = await getActivity(id)
        setActivity(data)
      } catch (err) {
        console.error('활동 조회 실패:', err)
        setError(err.message)
        // API 실패 시 더미 데이터 사용
        setActivity({
          id: parseInt(id) || 0,
          title: '청년직업역량개발 [도전! 디자이너!] 프로그램',
          content: '서울특별시 경계선지능 평생교육 지원센터',
          location: '서울시 강남구',
          activityType: 'GROUP',
          recruitStatus: 'OPEN',
          likes: 15,
          applyStartAt: '2025-01-01T00:00:00Z',
          applyEndAt: '2025-12-31T23:59:59Z',
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchActivity()
  }, [id])

  if (loading) {
    return (
      <Wrap>
        <PageHeader title="활동 추천" />
        <LoadingMessage>활동 정보를 불러오는 중...</LoadingMessage>
      </Wrap>
    )
  }

  if (error && !activity) {
    return (
      <Wrap>
        <PageHeader title="활동 추천" />
        <ErrorMessage>활동 정보를 불러올 수 없습니다: {error}</ErrorMessage>
      </Wrap>
    )
  }

  const handleApply = async () => {
    if (activity) {
      // 활동 데이터를 applicationsStore 형식에 맞게 변환
      const activityData = {
        id: activity.id,
        title: activity.title,
        category: '함께하기',
        image: 'https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?auto=format&fit=crop&w=800&q=60',
        description: activity.content || '활동 설명',
        duration: '매주 화요일',
        timeRange: '10:00~12:00',
        difficulty: '만19세~만39세',
        location: activity.location || '서울시 강남구',
        maxParticipants: 20,
        currentParticipants: 15,
        date: new Date(activity.applyStartAt).toLocaleDateString('ko-KR'),
        time: '10:00'
      }
      
      await applyActivity(activityData)
    }
  }

  return (
    <Wrap>
      <PageHeader title="활동 추천" />

      <CardImage src="https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?auto=format&fit=crop&w=800&q=60" alt={activity.title} />

      <Title>{activity.title}</Title>

      <Section>
        <SecHeader><Users size={18} className="icon" /><h3>활동 정보</h3></SecHeader>
        <P>활동 유형: {activity.activityType === 'ALONE' ? '혼자하기' : '함께하기'}</P>
        <P>모집 상태: {activity.recruitStatus === 'OPEN' ? '모집중' : '마감'}</P>
        <P>좋아요: {activity.likes}개</P>
      </Section>

      <Section>
        <SecHeader><BookOpen size={18} className="icon" /><h3>활동 내용</h3></SecHeader>
        <P>{activity.content || '활동에 대한 상세한 내용이 여기에 표시됩니다.'}</P>
      </Section>

      <Section>
        <SecHeader><MapPin size={18} className="icon" /><h3>장소</h3></SecHeader>
        <P>{activity.location || '장소 정보가 없습니다.'}</P>
      </Section>

      <Section>
        <SecHeader><Calendar size={18} className="icon" /><h3>신청 기간</h3></SecHeader>
        <P>신청 시작: {new Date(activity.applyStartAt).toLocaleDateString('ko-KR')}</P>
        <P>신청 마감: {new Date(activity.applyEndAt).toLocaleDateString('ko-KR')}</P>
      </Section>

      <Section>
        <SecHeader><Clock size={18} className="icon" /><h3>신청기간</h3></SecHeader>
        <P>25.08.26(화) 15시 - 25.09.09(화) 15시</P>
        <P>• 1차 선발(20명): 09.15(일) 15시 예정</P>
        <P>• 최종 선발(8명): 9.22(일) 13시 예정</P>
      </Section>

      <ApplyButton
        disabled={activity.recruitStatus === 'CLOSED' || isApplied(activity.id)}
        onClick={handleApply}
      >
        {activity.recruitStatus === 'CLOSED' ? '마감' : 
         isApplied(activity.id) ? '신청 완료' : '신청하기'}
      </ApplyButton>
    </Wrap>
  )
}

const Wrap = styled.div`
  padding: 0 1.6rem 8rem;
`

const CardImage = styled.img`
  width: 100%;
  height: 18rem;
  object-fit: cover;
  background: var(--muted);
  border: 1px solid var(--border);
  border-radius: 1.2rem;
  margin-bottom: 1.2rem;
`

const Title = styled.h2`
  margin: 0 0 0.8rem 0;
  font-size: 1.8rem;
  text-align: center;
`

const Section = styled.div`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 1.2rem;
  padding: 1.2rem;
  margin-bottom: 1rem;
`

const SecHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.6rem;
  .icon { color: var(--primary); }
  h3 { margin: 0; font-size: 1.4rem; }
`

const P = styled.p`
  margin: 0.2rem 0;
  color: #666666;
  font-size: 1.3rem;
  line-height: 1.5;
`

const ApplyButton = styled.button`
  width: 100%;
  padding: 1.2rem;
  border: none;
  border-radius: 1rem;
  font-size: 1.6rem;
  font-weight: 500;
  background: ${p => p.disabled ? '#CCCCCC' : 'var(--primary)'};
  color: ${p => p.disabled ? '#666666' : 'var(--primary-foreground)'};
  cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'};
`

const LoadingMessage = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #666666;
  font-size: 1.4rem;
`

const ErrorMessage = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #e74c3c;
  font-size: 1.4rem;
  background: #fdf2f2;
  border: 1px solid #fecaca;
  border-radius: 1rem;
  margin: 1rem;
`


