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

// ===== 활동 관련 API =====

// 활동 생성
export const createActivity = (activityData) => {
  const requestBody = {
    activityType: activityData.activityType,
    title: activityData.title,
    content: activityData.content,
    location: activityData.location,
    applyStartAt: activityData.applyStartAt,
    applyEndAt: activityData.applyEndAt,
    recruitStatus: activityData.recruitStatus
  };

  return apiRequest('/api/v1/activities', {
    method: 'POST',
    data: requestBody,
  });
};

// 활동 목록 조회 (페이지네이션)
export const getActivities = (pageable = { page: 0, size: 10, sort: ['createdAt,desc'] }) => {
  const params = new URLSearchParams();
  params.append('page', pageable.page || 0);
  params.append('size', pageable.size || 10);
  
  if (pageable.sort && pageable.sort.length > 0) {
    pageable.sort.forEach(sort => params.append('sort', sort));
  }

  return apiRequest(`/api/v1/activities?${params.toString()}`);
};

// 활동 상세 조회
export const getActivity = (id) => {
  return apiRequest(`/api/v1/activities/${id}`);
};

// 활동 수정
export const updateActivity = (id, activityData) => {
  const requestBody = {
    activityType: activityData.activityType,
    title: activityData.title,
    content: activityData.content,
    location: activityData.location,
    applyStartAt: activityData.applyStartAt,
    applyEndAt: activityData.applyEndAt,
    recruitStatus: activityData.recruitStatus
  };

  return apiRequest(`/api/v1/activities/${id}`, {
    method: 'PUT',
    data: requestBody,
  });
};

// 활동 삭제
export const deleteActivity = (id) => {
  return apiRequest(`/api/v1/activities/${id}`, {
    method: 'DELETE',
  });
};

// 활동 찜
export const likeActivity = (id) => {
  return apiRequest(`/api/v1/activities/${id}/like`, {
    method: 'POST',
  });
};

// 활동 찜 해제
export const unlikeActivity = (id) => {
  return apiRequest(`/api/v1/activities/${id}/like`, {
    method: 'DELETE',
  });
};

// 활동 신청
export const applyActivity = (id) => {
  return apiRequest(`/api/v1/activities/${id}/apply`, {
    method: 'POST',
  });
};

// 활동 신청 취소
export const cancelActivity = (id) => {
  return apiRequest(`/api/v1/activities/${id}/apply`, {
    method: 'DELETE',
  });
};

export default {
  createActivity,
  getActivities,
  getActivity,
  updateActivity,
  deleteActivity,
  likeActivity,
  unlikeActivity,
  applyActivity,
  cancelActivity
}
