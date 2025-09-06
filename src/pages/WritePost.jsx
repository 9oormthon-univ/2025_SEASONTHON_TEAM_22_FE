import { useState } from 'react'
import styled from 'styled-components'
import PageHeader from '../components/PageHeader'
import { Star, ChevronDown } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { createPost } from '../services/postApi'
import { toast } from 'sonner'

export default function WritePost() {
  const navigate = useNavigate()
  const [search] = useSearchParams()
  const initialMode = (search.get('mode') === 'review') ? 'review' : 'post'
  const [mode, setMode] = useState(initialMode) // 'post' | 'review'
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState(initialMode === 'review' ? '후기' : '게시글')
  const [showDropdown, setShowDropdown] = useState(false)
  const [rating, setRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = ['게시글', '후기']

  const isReview = mode === 'review' || category === '후기'
  const disabled = !title.trim() || !content.trim() || (isReview && rating === 0)

  const handleSubmit = async () => {
    if (disabled || isSubmitting) return
    
    setIsSubmitting(true)
    
    try {
      if (isReview) {
        // 후기 작성 - API 호출
        const reviewData = {
          postCategory: 'REVIEW',
          title,
          content,
          activityId: 1, // 기본값, 실제로는 선택된 활동 ID를 사용해야 함
          rating
        }
        
        await createPost(reviewData)
        toast.success('후기가 성공적으로 작성되었습니다!')
        navigate('/community')
      } else {
        // 게시글 작성 - API 호출
        const postData = {
          postCategory: 'POST',
          title,
          content
        }
        
        await createPost(postData)
        toast.success('게시글이 성공적으로 작성되었습니다!')
        navigate('/community')
      }
    } catch (error) {
      console.error('게시글/후기 작성 실패:', error)
      toast.error('작성에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Wrap>
      <PageHeader title="커뮤니티" />

      <TitleWrap>
        <H2>{isReview ? '후기 작성하기' : '글 작성하기'}</H2>
      </TitleWrap>

      <Form>
        <Field>
          <Label>제목</Label>
          <Input value={title} onChange={(e)=> setTitle(e.target.value)} />
        </Field>

        <Field>
          <Label>내용</Label>
          <Textarea value={content} onChange={(e)=> setContent(e.target.value)} />
        </Field>

        <FieldWrapper>
          <Label>카테고리</Label>
          <Select onClick={()=> setShowDropdown(!showDropdown)}>
            <span>{category}</span>
            <ChevronDown size={18} />
          </Select>
          {showDropdown && (
            <Dropdown>
              {categories.map(cat => (
                <DropdownItem key={cat} onClick={()=>{ setCategory(cat); setMode(cat==='후기' ? 'review' : 'post'); setShowDropdown(false) }}>{cat}</DropdownItem>
              ))}
            </Dropdown>
          )}
        </FieldWrapper>

        {isReview && (
          <Field>
            <Label>별점</Label>
            <Stars>
              {[1,2,3,4,5].map(n => (
                <StarButton key={n} type="button" onClick={()=> setRating(n)} aria-label={`${n}점`}>
                  <Star size={24} className={n<=rating ? 'filled' : ''} />
                </StarButton>
              ))}
            </Stars>
          </Field>
        )}

        <Actions>
          <GhostButton onClick={()=> navigate(-1)}>취소</GhostButton>
          <PrimaryButton onClick={handleSubmit} disabled={disabled || isSubmitting}>
            {isSubmitting ? '작성 중...' : '등록'}
          </PrimaryButton>
        </Actions>
      </Form>
    </Wrap>
  )
}

const Wrap = styled.div` padding: 0 1.6rem 8rem; `

const TitleWrap = styled.div` text-align:center; margin-bottom: 1.2rem; `
const H2 = styled.h2` margin:0; font-size: 1.8rem; color: var(--foreground); `

const Form = styled.div` max-width: 48rem; margin: 0 auto; display:flex; flex-direction:column; gap: 1.2rem; `
const Field = styled.div` display:flex; flex-direction:column; gap:0.6rem; `

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  position: relative;
`
const Label = styled.label` color: var(--foreground); font-size: 1.4rem; `

const Input = styled.input`
  height: 4.4rem; padding: 0 1.2rem; border: 2px solid var(--border); border-radius: 1.2rem; background: #fff;
  &:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 1px var(--primary); }
`

const Textarea = styled.textarea`
  min-height: 14rem; padding: 1rem 1.2rem; border: 2px solid var(--border); border-radius: 1.2rem; background: #fff; resize: none;
  &:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 1px var(--primary); }
`

const Select = styled.button`
  height: 4.4rem; padding: 0 1.2rem; border: 2px solid var(--border); border-radius: 1.2rem; background: #fff; text-align:left;
  display:flex; align-items:center; justify-content:space-between; gap:0.8rem;
  &:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 1px var(--primary); }
`

const Dropdown = styled.div`
  position: absolute; top: 7.2rem; left: 0; right: 0; background: #fff; border: 2px solid var(--border); border-radius: 1.2rem; overflow:hidden; box-shadow: 0 6px 16px rgba(0,0,0,0.08);
  z-index: 20; /* 상단에 오도록 */
`
const DropdownItem = styled.button` width: 100%; padding: 1rem 1.2rem; text-align:left; background:#fff; border: none; border-bottom: 1px solid var(--border); &:last-child{ border-bottom: none } &:hover{ background: var(--muted); } `

const Stars = styled.div` display:flex; gap:0.4rem; `
const StarButton = styled.button`
  border:none; background:transparent; padding:0.2rem; cursor:pointer;
  svg { color: #CCCCCC; }
  svg.filled { color: #F6C000; fill: #F6C000; }
`

const Actions = styled.div` display:flex; gap:0.8rem; margin-top: 0.4rem; `
const GhostButton = styled.button` flex:1; height: 4.4rem; border:2px solid var(--border); background:#fff; color:#666; border-radius:1.2rem; cursor:pointer; &:hover{ background:#F8F8F8; } `
const PrimaryButton = styled.button` flex:1; height: 4.4rem; border:none; background: var(--primary); color: var(--primary-foreground); border-radius:1.2rem; cursor:pointer; opacity:${p=>p.disabled?0.6:1}; pointer-events:${p=>p.disabled?'none':'auto'}; &:hover{ filter: brightness(0.95); } `


