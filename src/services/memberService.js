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

// Member API 서비스
export const memberService = {
  // 마이페이지 정보 조회
  getMyInfo: () => {
    return apiRequest('/api/v1/members/me')
  },

  // 마이페이지 정보 수정
  updateMyInfo: (data) => {
    return apiRequest('/api/v1/members/me', {
      method: 'PUT',
      data: data,
    })
  },

  // 회원가입
  signup: (data) => {
    return apiRequest('/api/v1/members/signup', {
      method: 'POST',
      data: data,
    })
  },

  // 로그인
  login: (data) => {
    return apiRequest('/api/v1/members/login', {
      method: 'POST',
      data: data,
    })
  },

  // 구글 로그인 (OAuth2 코드 교환)
  loginWithGoogle: (code) => {
    return apiRequest('/api/auth/login/google', {
      method: 'POST',
      data: { code },
    })
  },
}

// Auth API 서비스
export const authService = {
  // 토큰 갱신
  refresh: () => {
    return apiRequest('/auth/refresh')
  },

  // 로그아웃
  logout: () => {
    return apiRequest('/auth/logout')
  },

  // 구글 로그인 (OAuth2 콜백 처리용)
  googleLogin: () => {
    return apiRequest('/auth/login/google')
  },
}

export default memberService
