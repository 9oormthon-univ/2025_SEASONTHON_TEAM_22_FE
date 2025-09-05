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

export default memberService
