const API_BASE_URL = 'http://localhost:8080/api/v1'

// API 요청 헬퍼 함수
const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('accessToken')
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// Member API 서비스
export const memberService = {
  // 마이페이지 정보 조회
  getMyInfo: async () => {
    return apiRequest('/members/me')
  },

  // 마이페이지 정보 수정
  updateMyInfo: async (data) => {
    return apiRequest('/members/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // 회원가입
  signup: async (data) => {
    return apiRequest('/members/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // 로그인
  login: async (data) => {
    return apiRequest('/members/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

// Answer API 서비스
export const answerService = {
  // 답변 등록
  createAnswer: async (memberId, questionCardId, content) => {
    return apiRequest(`/answers/${memberId}/${questionCardId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    })
  },

  // 마음 훈련 기록 현황 조회
  getProgressStatus: async (memberId) => {
    return apiRequest(`/answers/${memberId}/progress-status`)
  },

  // 마음 훈련 날짜별 기록 현황 조회
  getHistory: async (memberId, pageable = { page: 0, size: 10, sort: [] }) => {
    const params = new URLSearchParams()
    params.append('page', pageable.page)
    params.append('size', pageable.size)
    if (pageable.sort && pageable.sort.length > 0) {
      pageable.sort.forEach(sort => params.append('sort', sort))
    }
    
    return apiRequest(`/answers/${memberId}/history?${params.toString()}`)
  },

  // 일일 답변 진행률 조회
  getDailyProgress: async (memberId) => {
    return apiRequest(`/answers/${memberId}/daily-progress`)
  },
}

// Question Card API 서비스
export const questionCardService = {
  // 이전 질문 카드 조회
  getPrevious: async (questionCardId) => {
    return apiRequest(`/question-cards/${questionCardId}/previous`)
  },

  // 다음 질문 카드 조회
  getNext: async (questionCardId) => {
    return apiRequest(`/question-cards/${questionCardId}/next`)
  },
}

// Comment API 서비스
export const commentService = {
  // 댓글 목록 조회
  getComments: async (postId, pageable = { page: 0, size: 20, sort: [] }) => {
    const params = new URLSearchParams()
    params.append('page', pageable.page)
    params.append('size', pageable.size)
    if (pageable.sort && pageable.sort.length > 0) {
      pageable.sort.forEach(sort => params.append('sort', sort))
    }
    
    return apiRequest(`/posts/${postId}/comments?${params.toString()}`)
  },

  // 댓글 작성
  createComment: async (postId, content) => {
    return apiRequest(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    })
  },

  // 댓글 수정
  updateComment: async (commentId, content) => {
    return apiRequest(`/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    })
  },

  // 댓글 삭제
  deleteComment: async (commentId) => {
    return apiRequest(`/comments/${commentId}`, {
      method: 'DELETE',
    })
  },

  // 내 댓글 목록 조회
  getMyComments: async (pageable = { page: 0, size: 20, sort: [] }) => {
    const params = new URLSearchParams()
    params.append('page', pageable.page)
    params.append('size', pageable.size)
    if (pageable.sort && pageable.sort.length > 0) {
      pageable.sort.forEach(sort => params.append('sort', sort))
    }
    
    return apiRequest(`/me?${params.toString()}`)
  },
}

export default memberService
