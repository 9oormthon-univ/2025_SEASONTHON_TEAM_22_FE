import styled from 'styled-components'
import PageHeader from '../components/PageHeader'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function PostDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { state } = useLocation()
  const [post, setPost] = useState(state?.post || null)

  useEffect(() => {
    if (!post) {
      try {
        const raw = localStorage.getItem('posts')
        if (raw) {
          const found = JSON.parse(raw).find((p) => String(p.id) === String(id))
          if (found) setPost(found)
        }
      } catch {}
    }
  }, [id, post])

  return (
    <Wrap>
      <PageHeader title="커뮤니티" onBack={() => navigate(-1)} />
      {post && (
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

