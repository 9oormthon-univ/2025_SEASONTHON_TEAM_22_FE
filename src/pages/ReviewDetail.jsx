import styled from 'styled-components'
import PageHeader from '../components/PageHeader'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function ReviewDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { state } = useLocation()
  const [review, setReview] = useState(state?.review || null)

  useEffect(() => {
    if (!review) {
      try {
        const raw = localStorage.getItem('reviews')
        if (raw) {
          const found = JSON.parse(raw).find((r) => String(r.id) === String(id))
          if (found) setReview(found)
        }
      } catch {}
    }
  }, [id, review])

  const renderStars = (rating) => {
    const full = Math.floor(rating || 0)
    const arr = Array(5).fill('☆').map((s, i) => (i < full ? '★' : s))
    return arr.join(' ')
  }

  return (
    <Wrap>
      <PageHeader title="커뮤니티" onBack={() => navigate(-1)} />
      {review && (
        <Card>
          <CardBody>
            <Title>{review.title}</Title>
            <Meta>
              <Stars>{renderStars(review.rating)}</Stars>
              <Badge>{review.subtitle || '익명'}</Badge>
              <Dot>•</Dot>
              <Small>{review.timeAgo}</Small>
            </Meta>
            <Content>{review.content}</Content>
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

