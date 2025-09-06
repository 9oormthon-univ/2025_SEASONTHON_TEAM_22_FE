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

// ===== 감정 관련 API =====

// 감정 기록 목록 조회
export const getEmotions = (pageable = { page: 0, size: 10, sort: ['createdAt,desc'] }) => {
  const params = new URLSearchParams();
  params.append('page', pageable.page || 0);
  params.append('size', pageable.size || 10);
  
  if (pageable.sort && pageable.sort.length > 0) {
    pageable.sort.forEach(sort => {
      params.append('sort', sort);
    });
  }

  return apiRequest(`/api/v1/emotions?${params.toString()}`);
};

// 감정 기록 생성
export const createEmotion = (emotionData, memberId = 1) => {
  const requestBody = {
    emotionState: emotionData.mood,
    emotionText: emotionData.note
  };

  return apiRequest(`/api/v1/emotions?member-id=${memberId}`, {
    method: 'POST',
    data: requestBody,
  });
};

// 감정 기록 수정
export const updateEmotion = (emotionId, emotionData) => {
  return apiRequest(`/api/v1/emotions/${emotionId}`, {
    method: 'PUT',
    data: emotionData,
  });
};

// 감정 기록 삭제
export const deleteEmotion = (emotionId) => {
  return apiRequest(`/api/v1/emotions/${emotionId}`, {
    method: 'DELETE',
  });
};

// 월간 감정 통계 조회
export const getMonthlyEmotionStats = (memberId, year, month) => {
  // 1. 기본 URL 경로만 정의합니다.
  const url = `/api/v1/emotions/${memberId}/monthly-stats`;

  // 2. 쿼리 파라미터들을 객체로 묶습니다.
  const params = {
    year,
    month,
  };

  return apiRequest(url, { params });
};

export default {
  getEmotions,
  createEmotion,
  updateEmotion,
  deleteEmotion,
  getMonthlyEmotionStats
}
