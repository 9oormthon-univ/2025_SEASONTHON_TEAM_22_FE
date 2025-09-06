import axios from 'axios'
import { getMyInfo } from './memberApi'

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
export const createEmotion = async (emotionData, memberId) => {
  // memberId가 없으면 현재 사용자 정보를 가져와서 사용
  if (!memberId) {
    const currentUser = await getMyInfo()
    memberId = currentUser.id
  }

  const requestBody = {
    emotionState: emotionData.mood,
    emotionText: emotionData.note
  };

  return apiRequest(`/api/v1/emotions?member-id=${memberId}`, {
    method: 'POST',
    data: requestBody,
  });
};

// 주간 감정 통계 조회
export const getWeeklyEmotionStats = async (memberId) => {
  const url = `/api/v1/emotions/${memberId}/most-week`;

  const response = await apiRequest(url, {
    method: 'GET'
  });

  // apiRequest 헬퍼 함수가 이미 response.data를 반환하므로,
  // 여기서 바로 데이터에 접근할 수 있습니다.
  return response.data;
}

// 월간 감정 통계 조회
export const getMonthlyEmotionStats = async (memberId, year, month) => {
  try {
    const url = `/api/v1/emotions/${memberId}/monthly-stats`;

    const params = {
      year,
      month,
    };

    const response = await apiRequest(url, {
      method: 'GET',
      params,
    });

    return response.data;
  } catch (error) {
    console.error('월간 감정 통계 조회 실패:', error.message);
    throw error;
  }
};

export default {
  getEmotions,
  createEmotion,
  getWeeklyEmotionStats,
  getMonthlyEmotionStats
}
