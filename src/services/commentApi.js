import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 에러 처리 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 에러 메시지 처리
    const errorMessage = error.response?.data?.message || `HTTP error! status: ${error.response?.status}`
    throw new Error(errorMessage)
  }
)

// API 요청 헬퍼 함수
const apiRequest = async (url, options = {}) => {
  try {
    const response = await apiClient({
      url,
      ...options,
    })
    return response.data
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// ===== Comment 관련 API =====

// 댓글 목록 조회
export const getComments = (postId, pageable = { page: 0, size: 20, sort: [] }) => {
  const params = new URLSearchParams()
  params.append('page', pageable.page)
  params.append('size', pageable.size)
  if (pageable.sort && pageable.sort.length > 0) {
    pageable.sort.forEach(sort => params.append('sort', sort))
  }
  
  return apiRequest(`/api/v1/comments/${postId}?${params.toString()}`);
}

// 댓글 작성
export const createComment = (memberId, postId, content) => {
  return apiRequest(`/api/v1/comments/${memberId}/${postId}`, {
    method: 'POST',
    data: { content },
  })
}

// 댓글 수정
export const updateComment = (memberId, commentId, content) => {
  return apiRequest(`/api/v1/comments/${memberId}/${commentId}`, {
    method: 'PUT',
    data: { content },
  })
}

// 댓글 삭제
export const deleteComment = (memberId, commentId) => {
  return apiRequest(`/api/v1/comments/${memberId}/${commentId}`, {
    method: 'DELETE',
  })
}

// 내 댓글 목록 조회
export const getMyComments = (memberId, pageable = { page: 0, size: 20, sort: [] }) => {
  const params = new URLSearchParams()
  params.append('page', pageable.page)
  params.append('size', pageable.size)
  if (pageable.sort && pageable.sort.length > 0) {
    pageable.sort.forEach(sort => params.append('sort', sort))
  }
  
  return apiRequest(`/api/v1/comments/${memberId}?${params.toString()}`, {
    method: 'GET',
  })
}

export const getComment = (postId, pageable = { page: 0, size: 20, sort: [] }) => {
  const params = new URLSearchParams()
  params.append('page', pageable.page)
  params.append('size', pageable.size)
  if (pageable.sort && pageable.sort.length > 0) {
    pageable.sort.forEach(sort => params.append('sort', sort))
  }
  return apiRequest(`/api/v1/comments/${postId}?${params.toString()}`, {
    method: 'GET',
  })
}

export default {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  getMyComments
}
