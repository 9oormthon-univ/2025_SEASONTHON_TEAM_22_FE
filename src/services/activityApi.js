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
          // refresh 토큰을 사용하여 새로운 access 토큰 요청
          const refreshResponse = await axios.get(`${API_BASE_URL}/auth/refresh`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          })
          
          if (refreshResponse.data.success && refreshResponse.data.data) {
            // 새로운 토큰으로 재시도
            const newToken = refreshResponse.data.data
            localStorage.setItem('accessToken', newToken)
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            
            return apiClient(originalRequest)
          }
        } catch (refreshError) {
          console.error('토큰 갱신 실패:', refreshError)
          // 토큰 갱신 실패 시 로그아웃 처리
          localStorage.removeItem('accessToken')
          localStorage.removeItem('currentUser')
          // 로그인 페이지로 리다이렉트
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
          throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.')
        }
      } else {
        // 토큰이 없는 경우 로그인 페이지로 리다이렉트
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
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

// ===== 활동 관련 API =====

// 활동 생성
export const createActivity = async (activityData) => {
  try {
    const requestBody = {
      activityType: activityData.activityType,
      title: activityData.title,
      content: activityData.content,
      location: activityData.location,
      applyStartAt: activityData.applyStartAt,
      applyEndAt: activityData.applyEndAt,
      recruitStatus: activityData.recruitStatus
    };

    return apiRequest('/activities', {
      method: 'POST',
      data: requestBody,
    });
  } catch (error) {
    console.error('활동 생성 실패:', error);
    throw error;
  }
};

// 활동 목록 조회 (페이지네이션)
export const getActivities = async (pageable = { page: 0, size: 10, sort: ['createdAt,desc'] }) => {
  try {
    const params = new URLSearchParams();
    params.append('page', pageable.page || 0);
    params.append('size', pageable.size || 10);
    
    if (pageable.sort && pageable.sort.length > 0) {
      pageable.sort.forEach(sort => params.append('sort', sort));
    }

    return apiRequest(`/activities?${params.toString()}`);
  } catch (error) {
    console.error('활동 목록 조회 실패:', error);
    throw error;
  }
};

// 활동 상세 조회
export const getActivity = async (id) => {
  try {
    return apiRequest(`/activities/${id}`);
  } catch (error) {
    console.error('활동 상세 조회 실패:', error);
    throw error;
  }
};

// 활동 수정
export const updateActivity = async (id, activityData) => {
  try {
    const requestBody = {
      activityType: activityData.activityType,
      title: activityData.title,
      content: activityData.content,
      location: activityData.location,
      applyStartAt: activityData.applyStartAt,
      applyEndAt: activityData.applyEndAt,
      recruitStatus: activityData.recruitStatus
    };

    return apiRequest(`/activities/${id}`, {
      method: 'PUT',
      data: requestBody,
    });
  } catch (error) {
    console.error('활동 수정 실패:', error);
    throw error;
  }
};

// 활동 삭제
export const deleteActivity = async (id) => {
  try {
    return apiRequest(`/activities/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('활동 삭제 실패:', error);
    throw error;
  }
};

// 활동 찜
export const likeActivity = async (id) => {
  try {
    return apiRequest(`/activities/${id}/like`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('활동 찜 실패:', error);
    throw error;
  }
};

// 활동 찜 해제
export const unlikeActivity = async (id) => {
  try {
    return apiRequest(`/activities/${id}/like`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('활동 찜 해제 실패:', error);
    throw error;
  }
};

// 활동 신청
export const applyActivity = async (id) => {
  try {
    return apiRequest(`/activities/${id}/apply`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('활동 신청 실패:', error);
    throw error;
  }
};

// 활동 신청 취소
export const cancelActivity = async (id) => {
  try {
    return apiRequest(`/activities/${id}/apply`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('활동 신청 취소 실패:', error);
    throw error;
  }
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
