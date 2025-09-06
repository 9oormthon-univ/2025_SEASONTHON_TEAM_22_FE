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

// ===== Answer 관련 API =====

// 답변 등록
export const createAnswer = (memberId, questionCardId, content) => {
  return apiRequest(`/api/v1/answers/${memberId}/${questionCardId}`, {
    method: 'POST',
    data: { content },  
  })
}

export const getAnswerByDate = (memberId, date) => {
  return apiRequest(`/api/v1/answers/${memberId}/${date}`)
}

// 마음 훈련 기록 현황 조회
export const getProgressStatus = (memberId) => {
  return apiRequest(`/api/v1/answers/${memberId}/progress-status`)
}

// 마음 훈련 날짜별 기록 현황 조회
export const getHistory = (memberId, pageable = { page: 0, size: 10, sort: [] }) => {
  const params = new URLSearchParams()
  params.append('page', pageable.page)
  params.append('size', pageable.size)
  if (pageable.sort && pageable.sort.length > 0) {
    pageable.sort.forEach(sort => params.append('sort', sort))
  }
  
  return apiRequest(`/api/v1/answers/${memberId}/history?${params.toString()}`)
}

// 일일 답변 진행률 조회
export const getDailyProgress = (memberId) => {
  return apiRequest(`/api/v1/answers/${memberId}/daily-progress`)
}

export default {
  createAnswer,
  getProgressStatus,
  getHistory,
  getDailyProgress,
  getAnswerByDate
}
