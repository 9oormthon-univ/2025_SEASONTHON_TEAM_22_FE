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

// ===== Question Card 관련 API =====

// 이전 질문 카드 조회
export const getPrevious = (questionCardId) => {
  return apiRequest(`/api/v1/question-cards/${questionCardId}/previous`)
}

// 다음 질문 카드 조회
export const getNext = (questionCardId) => {
  return apiRequest(`/api/v1/question-cards/${questionCardId}/next`)
}

export default {
  getPrevious,
  getNext
}
