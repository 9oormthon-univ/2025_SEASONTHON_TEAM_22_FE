import axios from 'axios'

const API_BASE_URL = 'https://slowmind.ngrok.app/api/v1'

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터 - 토큰 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터 - 토큰 갱신 처리
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    // 401 에러이고 재시도가 아닌 경우에만 토큰 갱신 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      const token = localStorage.getItem('accessToken')
      if (token) {
        try {
          const refreshResponse = await axios.get(`${API_BASE_URL}/auth/refresh`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          })
          
          if (refreshResponse.data.success && refreshResponse.data.data) {
            // 새로운 토큰으로 재시도
            localStorage.setItem('accessToken', refreshResponse.data.data)
            originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.data}`
            
            return apiClient(originalRequest)
          }
        } catch (refreshError) {
          console.error('토큰 갱신 실패:', refreshError)
          // 토큰 갱신 실패 시 로그아웃 처리
          localStorage.removeItem('accessToken')
          localStorage.removeItem('currentUser')
          window.location.href = '/login'
          throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.')
        }
      }
    }
    
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
      data: data,
    })
  },

  // 회원가입
  signup: async (data) => {
    return apiRequest('/members/signup', {
      method: 'POST',
      data: data,
    })
  },

  // 로그인
  login: async (data) => {
    return apiRequest('/members/login', {
      method: 'POST',
      data: data,
    })
  },
}

// Auth API 서비스
export const authService = {
  // 토큰 갱신
  refresh: async () => {
    return apiRequest('/auth/refresh')
  },

  // 로그아웃
  logout: async () => {
    return apiRequest('/auth/logout')
  },

  // 구글 로그인 (OAuth2 콜백 처리용)
  googleLogin: async () => {
    return apiRequest('/auth/login/google')
  },
}

// Answer API 서비스
export const answerService = {
  // 답변 등록
  createAnswer: async (memberId, questionCardId, content) => {
    return apiRequest(`/answers/${memberId}/${questionCardId}`, {
      method: 'POST',
      data: { content },
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
      data: { content },
    })
  },

  // 댓글 수정
  updateComment: async (commentId, content) => {
    return apiRequest(`/comments/${commentId}`, {
      method: 'PUT',
      data: { content },
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
