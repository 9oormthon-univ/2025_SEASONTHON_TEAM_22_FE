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

// ===== Member 관련 API =====

// 마이페이지 정보 조회
export const getMyInfo = (memberId) => {
  return apiRequest(`/api/v1/members/me/${memberId}`, {
    method: 'GET',
  })
}

// 마이페이지 정보 수정
export const updateMyInfo = (memberId, data) => {
  const requestBody = {
    nickname: data.nickname,
    profileImageUrl: data.profileImageUrl,
  }

  return apiRequest(`/api/v1/members/me/${memberId}`, {
    method: 'PUT',
    data: requestBody,
  })
}

// 회원가입
export const signup = (data) => {
  return apiRequest('/api/v1/members/signup', {
    method: 'POST',
    data: data,
  })
}

// 로그인
export const login = (data) => {
  return apiRequest('/api/v1/members/login', {
    method: 'POST',
    data: data,
  })
}

// 구글 로그인 (OAuth2 코드 교환)
export const loginWithGoogle = (code) => {
  return apiRequest('/api/auth/login/google', {
    method: 'POST',
    data: { code: code },
  })
}

// ===== Auth 관련 API =====

// 토큰 갱신
export const refreshToken = () => {
  return apiRequest('/auth/refresh')
}

// 로그아웃
export const logout = () => {
  return apiRequest('/auth/logout')
}

// 구글 로그인 (OAuth2 콜백 처리용)
export const googleLogin = () => {
  return apiRequest('/auth/login/google')
}

export default {
  getMyInfo,
  updateMyInfo,
  signup,
  login,
  loginWithGoogle,
  refreshToken,
  logout,
  googleLogin
}
