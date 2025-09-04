import styled from 'styled-components'
import PageHeader from '../components/PageHeader'
import { Users, BookOpen, MapPin, Calendar, Clock } from 'lucide-react'

export default function ActivityDetail() {
  // 더미 데이터 (상태 전달 없이 사용)
  const activity = {
    id: 0,
    title: '청년직업역량개발 [도전! 디자이너!] 프로그램',
    description: '서울특별시 경계선지능 평생교육 지원센터',
    image: 'https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?auto=format&fit=crop&w=800&q=60',
    duration: '매주 화요일',
    timeRange: '10:00~12:00',
    difficulty: '만19세~만39세',
    status: 'active'
  }

  const handleApply = () => {
    window.open(
      'https://docs.google.com/forms/d/1hlkND-OMIie_-rsW9jwW3cjNG-6OcjCXzjdBXjR7oQI/viewform?edit_requested=true',
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <Wrap>
      <PageHeader title="활동 추천" />

      <CardImage src={activity.image} alt={activity.title} />

      <Title>{activity.title}</Title>

      <Section>
        <SecHeader><Users size={18} className="icon" /><h3>모집대상</h3></SecHeader>
        <P>서울 거주 또는 서울 소재 학교/직장에 다니고 있는 경계선지능(웩슬러지능검사 기준 65~84) 청년</P>
        <P>• 1차 20명 선정후 면접(미니 오디션)을 통해 최종 8명 선발</P>
      </Section>

      <Section>
        <SecHeader><BookOpen size={18} className="icon" /><h3>교육내용</h3></SecHeader>
        <P>디자인 기초, 캐릭터만들기(나와 서브캐릭터), 국립 중앙박물관 관람 및 몽조살 견학, 굿즈 제작부터 홍보, 수익화 전환 등</P>
      </Section>

      <Section>
        <SecHeader><MapPin size={18} className="icon" /><h3>교육장소</h3></SecHeader>
        <P>밑센터 프로그램실</P>
      </Section>

      <Section>
        <SecHeader><Calendar size={18} className="icon" /><h3>교육일정</h3></SecHeader>
        <P>25.09.19(금) - 25.12.18(목), 매주 화요일 및 목요일 오후 2시~4시 (총 25회)</P>
      </Section>

      <Section>
        <SecHeader><Clock size={18} className="icon" /><h3>신청기간</h3></SecHeader>
        <P>25.08.26(화) 15시 - 25.09.09(화) 15시</P>
        <P>• 1차 선발(20명): 09.15(일) 15시 예정</P>
        <P>• 최종 선발(8명): 9.22(일) 13시 예정</P>
      </Section>

      <ApplyButton
        disabled={activity.status === 'closed'}
        onClick={handleApply}
      >
        {activity.status === 'closed' ? '마감' : '신청하기'}
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


