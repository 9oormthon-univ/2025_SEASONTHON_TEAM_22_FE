import styled from 'styled-components'
import PageHeader from '../components/PageHeader'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Tabs from '../components/Tabs'
import { useState } from 'react'
import { Heart as HeartIcon } from 'lucide-react'
import { getPosts, likePost, unlikePost } from '../services/emotionService'
import { toast } from 'sonner'

export default function Community() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('posts')
  const [posts, setPosts] = useState([
    { id: 1, title: '자조모임 처음 나가봤는데', author: '미르미', timeAgo: '2025-08-30 20:50', content: '정말 따뜻하고 안전한 공간이었어요. 처음에는 긴장했지만 모든 분들이 친절하게 대해주셔서 마음이 편해졌습니다. 혼자가 아니라는 걸 느낄 수 있었어요.', isLiked: false, comments: 3 },
    { id: 2, title: '오늘 처음 명상 활동 참여했어요', author: '익명1', timeAgo: '2시간 전', content: '처음에는 많이 떨렸는데 다들 친절하게 맞아주셔서 감사했습니다.', isLiked: true, comments: 3 },
    { id: 3, title: '산책 모임 후기', author: '익명2', timeAgo: '1일 전', content: '날씨도 좋고 함께 걷는 분들도 좋아서 마음이 많이 편해졌어요.', isLiked: false, comments: 5 }
  ])
  const [reviews, setReviews] = useState([
    { id: 1, title: '함께 걷기 모임', subtitle: '미르미', rating: 5, timeAgo: '1일 전', content: '정말 따뜻하고 안전한 공간이었어요. 처음에는 긴장했었지만 모든 분들이 친절하게 대해주셔서 마음이 편해졌습니다. 혼자서 하기 힘든 것도 있었어요.' },
    { id: 2, title: '보드게임 활동 경험공유교육', subtitle: '미르미2', rating: 5, timeAgo: '3일 전', content: '새롭 통해 다양한 관계를 맺을 수 있었고, 다른 분들의 생각도 들어볼 수 있어서 잘 진행했네 신청해야 할 어렵게 느껴서 다음엔 더 많이 알아보았 안하면 잘 될겁였어요.' },
    { id: 3, title: '청년 D.I.Y 자조모임', subtitle: '미르미3', rating: 4, timeAgo: '2024-05-27', content: '똑똑아라 힘들었어요. 할 편 너희랑 그래도 결원 할 수 있었죠.' }
  ])

  const toggleLike = async (id, e) => {
    e.stopPropagation() // 카드 클릭 이벤트 방지
    
    try {
      const post = posts.find(p => p.id === id)
      if (!post) return
      
      if (post.isLiked) {
        await unlikePost(id)
        setPosts(prev => prev.map(p => 
          p.id === id ? { ...p, isLiked: false, likes: Math.max(0, (p.likes || 0) - 1) } : p
        ))
        toast.success('좋아요를 취소했습니다.')
      } else {
        await likePost(id)
        setPosts(prev => prev.map(p => 
          p.id === id ? { ...p, isLiked: true, likes: (p.likes || 0) + 1 } : p
        ))
        toast.success('좋아요를 눌렀습니다!')
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error)
      toast.error(`좋아요 처리 실패: ${error.message}`)
    }
  }

  const renderStars = (rating) => {
    const full = Math.floor(rating)
    const hasHalf = rating % 1 !== 0
    const arr = Array(5).fill('☆').map((s, i) => (i < full ? '★' : s))
    if (hasHalf && full < 5) arr[full] = '☆'
    return arr.join(' ')
  }

  // API에서 게시글/후기 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 게시글 데이터 로드
        const postsData = await getPosts({ category: 'POST', page: 0, size: 20 })
        if (postsData.content) {
          setPosts(postsData.content.map(post => ({
            ...post,
            isLiked: false, // 기본값, 실제로는 API에서 받아와야 함
            comments: 0 // 기본값, 실제로는 API에서 받아와야 함
          })))
        }
        
        // 후기 데이터 로드
        const reviewsData = await getPosts({ category: 'REVIEW', page: 0, size: 20 })
        if (reviewsData.content) {
          setReviews(reviewsData.content.map(review => ({
            ...review,
            subtitle: '익명', // 기본값
            timeAgo: '방금 전' // 기본값, 실제로는 API에서 받아와야 함
          })))
        }
      } catch (error) {
        console.warn('API에서 데이터 로드 실패, 로컬 데이터 사용:', error.message)
        
        // API 실패 시 로컬 저장소의 작성된 글/후기 반영
        try {
          const rawPosts = localStorage.getItem('posts')
          if (rawPosts) {
            const stored = JSON.parse(rawPosts)
            const storedIds = new Set(stored.map((p) => String(p.id)))
            setPosts([...stored, ...posts.filter((p) => !storedIds.has(String(p.id)))])
          }
          const rawReviews = localStorage.getItem('reviews')
          if (rawReviews) {
            const stored = JSON.parse(rawReviews)
            const storedIds = new Set(stored.map((r) => String(r.id)))
            setReviews([...stored, ...reviews.filter((r) => !storedIds.has(String(r.id)))])
          }
        } catch {}
      }
    }
    
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Wrap>
      <PageHeader title="커뮤니티" />

      <Tabs
        tabs={[{ label: '게시글', value: 'posts' }, { label: '후기', value: 'reviews' }]}
        activeValue={activeTab}
        onChange={setActiveTab}
      />

      <WriteRow>
        <WriteButton onClick={() => navigate('/write?mode=' + (activeTab==='reviews' ? 'review' : 'post'))}>
          <Plus>+</Plus>
          <span>{activeTab === 'reviews' ? '후기 작성' : '글 작성'}</span>
        </WriteButton>
      </WriteRow>

      <List>
        {activeTab === 'reviews' ? (
          reviews.map((r) => (
            <Card key={r.id} onClick={() => navigate(`/review/${r.id}`, { state: { review: r } })}>
              <CardBody>
                <CardHeader>
                  <div>
                    <Title>{r.title}</Title>
                    <Meta>
                      <Stars>{renderStars(r.rating)}</Stars>
                      <Badge>{r.subtitle}</Badge>
                    </Meta>
                  </div>
                  <Time>{r.timeAgo}</Time>
                </CardHeader>
                <Content>{r.content}</Content>
              </CardBody>
            </Card>
          ))
        ) : (
          posts.map((p) => (
            <Card key={p.id} onClick={() => navigate(`/post/${p.id}`, { state: { post: p } })}>
              <CardBody>
                <CardHeader>
                  <div>
                    <Title>{p.title}</Title>
                    <Meta>
                      <Badge>{p.author}</Badge>
                      <Dot>•</Dot>
                      <Small>{p.timeAgo}</Small>
                    </Meta>
                  </div>
                </CardHeader>
                <Content>{p.content}</Content>
                <Footer>
                  <LikeButton onClick={(e) => toggleLike(p.id, e)}>
                    <HeartIcon size={18} className={p.isLiked ? 'liked' : ''} />
                    {p.likes > 0 && <span>{p.likes}</span>}
                  </LikeButton>
                  <Small>댓글 {p.comments}</Small>
                </Footer>
              </CardBody>
            </Card>
          ))
        )}
      </List>
    </Wrap>
  )
}

const Wrap = styled.div`
  padding: 0 1.6rem;
`

/* tabs has own wrapper */

/* tabs moved to component */

const WriteRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.2rem;
`

const WriteButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: #7E6BB5;
  color: #ffffff;
  border: none;
  border-radius: 1.2rem;
  padding: 0.8rem 1.2rem;
  font-size: 1.4rem;
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);

  &:hover { background: #6B5A9E; }
`

const Plus = styled.span`
  font-size: 1.6rem;
  line-height: 1;
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding-bottom: 8rem;
`

const Card = styled.div`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 1.2rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
`

const CardBody = styled.div`
  padding: 1.6rem;
`

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.8rem;
`

const Title = styled.h3`
  margin: 0 0 0.4rem 0;
  font-size: 1.6rem;
  font-weight: var(--font-weight-medium);
  color: var(--foreground);
`

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`

const Stars = styled.span`
  color: #F6C000;
  font-size: 1.2rem;
`

const Badge = styled.span`
  background: var(--muted);
  color: var(--muted-foreground);
  border-radius: 0.8rem;
  padding: 0.2rem 0.6rem;
  font-size: 1.2rem;
`

const Time = styled.span`
  color: #999999;
  font-size: 1.2rem;
`

const Small = styled.span`
  color: #999999;
  font-size: 1.2rem;
`

const Dot = styled.span`
  color: #999999;
  font-size: 1.2rem;
`

const Content = styled.p`
  margin: 0;
  color: #666666;
  font-size: 1.4rem;
  line-height: 1.6;
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.8rem;
  border-top: 1px solid var(--muted);
`

const LikeButton = styled.button`
  border: none;
  background: transparent;
  padding: 0.4rem 0.8rem;
  border-radius: 0.8rem;
  cursor: pointer;

  svg { color: #999999; }
  .liked { color: #EF4444; fill: #EF4444; }
`
