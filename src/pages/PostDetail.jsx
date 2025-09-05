import styled from 'styled-components'
import PageHeader from '../components/PageHeader'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getPost } from '../services/emotionService'
import { toast } from 'sonner'

export default function PostDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { state } = useLocation()
  const [post, setPost] = useState(state?.post || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      if (!post && id) {
        try {
          setLoading(true)
          setError(null)
          
          // API에서 게시글 데이터 가져오기
          const apiPost = await getPost(id)
          
          // API 데이터를 UI에 맞게 변환
          const transformedPost = {
            ...apiPost,
            author: '익명', // 기본값, 실제로는 API에서 받아와야 함
            timeAgo: '방금 전', // 기본값, 실제로는 API에서 받아와야 함
            isLiked: false, // 기본값, 실제로는 API에서 받아와야 함
            comments: 0 // 기본값, 실제로는 API에서 받아와야 함
          }
          
          setPost(transformedPost)
        } catch (apiError) {
          console.warn('API에서 게시글 로드 실패, 로컬 스토리지에서 찾기:', apiError.message)
          
          // API 실패 시 로컬 스토리지에서 찾기
          try {
            const raw = localStorage.getItem('posts')
            if (raw) {
              const found = JSON.parse(raw).find((p) => String(p.id) === String(id))
              if (found) {
                setPost(found)
              } else {
                setError('게시글을 찾을 수 없습니다.')
              }
            } else {
              setError('게시글을 찾을 수 없습니다.')
            }
          } catch (localError) {
            console.error('로컬 스토리지 읽기 실패:', localError)
            setError('게시글을 불러오는데 실패했습니다.')
          }
        } finally {
          setLoading(false)
        }
      }
    }

    fetchPost()
  }, [id, post])

  return (
    <Wrap>
      <PageHeader title="커뮤니티" onBack={() => navigate(-1)} />
      
      {loading && (
        <LoadingMessage>게시글을 불러오는 중...</LoadingMessage>
      )}
      
      {error && (
        <ErrorMessage>{error}</ErrorMessage>
      )}
      
      {post && !loading && (
        <Card>
          <CardBody>
            <Title>{post.title}</Title>
            <Meta>
              <Badge>{post.author || '익명'}</Badge>
              <Dot>•</Dot>
              <Small>{post.timeAgo}</Small>
            </Meta>
            <Content>{post.content}</Content>
          </CardBody>
        </Card>
      )}
    </Wrap>
  )
}

const Wrap = styled.div`
  padding: 0 1.6rem 8rem;
`

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--muted-foreground);
  font-size: 1.4rem;
`

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--destructive);
  font-size: 1.4rem;
`

const Card = styled.div`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 1.2rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
  margin-top: 1.6rem;
`

const CardBody = styled.div`
  padding: 1.6rem;
`

const Title = styled.h2`
  margin: 0 0 0.6rem 0;
  font-size: 1.8rem;
  font-weight: var(--font-weight-medium);
  color: var(--foreground);
`

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.2rem;
`

const Badge = styled.span`
  background: var(--muted);
  color: var(--muted-foreground);
  border-radius: 0.8rem;
  padding: 0.2rem 0.6rem;
  font-size: 1.2rem;
`

const Dot = styled.span`
  color: #999999;
  font-size: 1.2rem;
`

const Small = styled.span`
  color: #999999;
  font-size: 1.2rem;
`

const Content = styled.p`
  margin: 0;
  color: #666666;
  font-size: 1.5rem;
  line-height: 1.7;
  white-space: pre-wrap;
`

