import styled from 'styled-components'
import PageHeader from '../components/PageHeader'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getPost } from '../services/postApi'
import { getComments, createComment, updateComment, deleteComment } from '../services/commentApi'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'
import { MessageCircle, Send, Edit2, Trash2, MoreVertical } from 'lucide-react'

export default function PostDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { state } = useLocation()
  const { currentUser } = useAuth()
  const [post, setPost] = useState(state?.post || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // 댓글 관련 상태
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingContent, setEditingContent] = useState('')
  const [showCommentMenu, setShowCommentMenu] = useState(null)

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
          
          // 로컬스토리지 사용 제거
          setError('게시글을 찾을 수 없습니다.')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchPost()
  }, [id, post])

  // 댓글 목록 조회
  useEffect(() => {
    const fetchComments = async () => {
      if (id) {
        try {
          const response = await getComments(id)
          setComments(response.data?.content || [])
        } catch (error) {
          console.error('댓글 조회 실패:', error)
        }
      }
    }
    fetchComments()
  }, [id])

  // 댓글 작성
  const handleSubmitComment = async () => {
    if (!newComment.trim() || !currentUser) return
    
    try {
      setIsSubmittingComment(true)
      const response = await createComment(id, newComment.trim())
      setComments(prev => [response, ...prev])
      setNewComment('')
      toast.success('댓글이 작성되었습니다.')
    } catch (error) {
      console.error('댓글 작성 실패:', error)
      toast.error('댓글 작성에 실패했습니다.')
    } finally {
      setIsSubmittingComment(false)
    }
  }

  // 댓글 수정 시작
  const handleStartEdit = (comment) => {
    setEditingCommentId(comment.id)
    setEditingContent(comment.content)
    setShowCommentMenu(null)
  }

  // 댓글 수정 완료
  const handleUpdateComment = async () => {
    if (!editingContent.trim()) return
    
    try {
      const response = await updateComment(editingCommentId, editingContent.trim())
      setComments(prev => prev.map(comment => 
        comment.id === editingCommentId ? response.data : comment
      ))
      setEditingCommentId(null)
      setEditingContent('')
      toast.success('댓글이 수정되었습니다.')
    } catch (error) {
      console.error('댓글 수정 실패:', error)
      toast.error('댓글 수정에 실패했습니다.')
    }
  }

  // 댓글 수정 취소
  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditingContent('')
  }

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return
    
    try {
      await deleteComment(commentId)
      setComments(prev => prev.filter(comment => comment.id !== commentId))
      setShowCommentMenu(null)
      toast.success('댓글이 삭제되었습니다.')
    } catch (error) {
      console.error('댓글 삭제 실패:', error)
      toast.error('댓글 삭제에 실패했습니다.')
    }
  }

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) return '방금 전'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간 전`
    return `${Math.floor(diff / 86400000)}일 전`
  }

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
        <>
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

          {/* 댓글 섹션 */}
          <CommentsSection>
            <CommentsHeader>
              <MessageCircle size={20} />
              <CommentsTitle>댓글 {comments.length}</CommentsTitle>
            </CommentsHeader>

            {/* 댓글 작성 */}
            {currentUser && (
              <CommentForm>
                <CommentInput
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="댓글을 작성해주세요..."
                  maxLength={500}
                />
                <SendButton 
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isSubmittingComment}
                >
                  <Send size={16} />
                </SendButton>
              </CommentForm>
            )}

            {/* 댓글 목록 */}
            <CommentsList>
              {comments.map((comment) => (
                <CommentItem key={comment.id}>
                  {editingCommentId === comment.id ? (
                    <EditForm>
                      <EditInput
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        maxLength={500}
                      />
                      <EditButtons>
                        <EditButton onClick={handleUpdateComment}>
                          저장
                        </EditButton>
                        <CancelButton onClick={handleCancelEdit}>
                          취소
                        </CancelButton>
                      </EditButtons>
                    </EditForm>
                  ) : (
                    <>
                      <CommentContent>
                        <CommentText>{comment.content}</CommentText>
                        <CommentMeta>
                          <CommentAuthor>익명</CommentAuthor>
                          <CommentDate>{formatDate(comment.createdAt)}</CommentDate>
                        </CommentMeta>
                      </CommentContent>
                      {currentUser && currentUser.id === comment.memberId && (
                        <CommentMenu>
                          <MenuButton onClick={() => setShowCommentMenu(
                            showCommentMenu === comment.id ? null : comment.id
                          )}>
                            <MoreVertical size={16} />
                          </MenuButton>
                          {showCommentMenu === comment.id && (
                            <MenuDropdown>
                              <MenuItem onClick={() => handleStartEdit(comment)}>
                                <Edit2 size={14} />
                                수정
                              </MenuItem>
                              <MenuItem onClick={() => handleDeleteComment(comment.id)}>
                                <Trash2 size={14} />
                                삭제
                              </MenuItem>
                            </MenuDropdown>
                          )}
                        </CommentMenu>
                      )}
                    </>
                  )}
                </CommentItem>
              ))}
              
              {comments.length === 0 && (
                <EmptyComments>
                  <MessageCircle size={32} />
                  <EmptyText>아직 댓글이 없습니다.</EmptyText>
                  <EmptySubtext>첫 번째 댓글을 작성해보세요!</EmptySubtext>
                </EmptyComments>
              )}
            </CommentsList>
          </CommentsSection>
        </>
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

// 댓글 관련 스타일
const CommentsSection = styled.div`
  margin-top: 2rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 1.2rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
`

const CommentsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1.6rem 1.6rem 0 1.6rem;
  color: var(--foreground);
`

const CommentsTitle = styled.h3`
  margin: 0;
  font-size: 1.6rem;
  font-weight: var(--font-weight-medium);
`

const CommentForm = styled.div`
  display: flex;
  gap: 0.8rem;
  padding: 1.6rem;
  border-bottom: 1px solid var(--border);
`

const CommentInput = styled.textarea`
  flex: 1;
  min-height: 4rem;
  border: 1px solid var(--border);
  border-radius: 0.8rem;
  padding: 1rem;
  resize: none;
  font-size: 1.4rem;
  outline: none;
  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 1px var(--primary);
  }
`

const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:not(:disabled):hover {
    background: #6B5A9E;
  }
`

const CommentsList = styled.div`
  padding: 1.6rem;
`

const CommentItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.2rem 0;
  border-bottom: 1px solid var(--border);
  
  &:last-child {
    border-bottom: none;
  }
`

const CommentContent = styled.div`
  flex: 1;
`

const CommentText = styled.p`
  margin: 0 0 0.8rem 0;
  color: var(--foreground);
  font-size: 1.4rem;
  line-height: 1.6;
`

const CommentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`

const CommentAuthor = styled.span`
  color: #999999;
  font-size: 1.2rem;
`

const CommentDate = styled.span`
  color: #999999;
  font-size: 1.2rem;
`

const CommentMenu = styled.div`
  position: relative;
`

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.2rem;
  height: 3.2rem;
  background: transparent;
  border: none;
  border-radius: 0.6rem;
  color: #999999;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: var(--muted);
    color: var(--foreground);
  }
`

const MenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid var(--border);
  border-radius: 0.8rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 10;
  min-width: 12rem;
`

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: 100%;
  padding: 1rem 1.2rem;
  background: transparent;
  border: none;
  color: var(--foreground);
  font-size: 1.4rem;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: var(--muted);
  }
  
  &:first-child {
    border-radius: 0.8rem 0.8rem 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 0.8rem 0.8rem;
  }
`

const EditForm = styled.div`
  flex: 1;
`

const EditInput = styled.textarea`
  width: 100%;
  min-height: 4rem;
  border: 1px solid var(--primary);
  border-radius: 0.8rem;
  padding: 1rem;
  resize: none;
  font-size: 1.4rem;
  outline: none;
  margin-bottom: 0.8rem;
`

const EditButtons = styled.div`
  display: flex;
  gap: 0.8rem;
  justify-content: flex-end;
`

const EditButton = styled.button`
  padding: 0.6rem 1.2rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 0.6rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #6B5A9E;
  }
`

const CancelButton = styled.button`
  padding: 0.6rem 1.2rem;
  background: transparent;
  color: #666666;
  border: 1px solid var(--border);
  border-radius: 0.6rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: var(--muted);
  }
`

const EmptyComments = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1.6rem;
  color: #999999;
`

const EmptyText = styled.p`
  margin: 1.2rem 0 0.4rem 0;
  font-size: 1.4rem;
  font-weight: var(--font-weight-medium);
`

const EmptySubtext = styled.p`
  margin: 0;
  font-size: 1.2rem;
`

