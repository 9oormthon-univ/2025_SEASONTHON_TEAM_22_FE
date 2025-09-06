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

// ===== 게시글 관련 API =====

// 게시글 상세 조회
export const getPost = async (id) => {
  try {
    return apiRequest(`/posts/${id}`);
  } catch (error) {
    console.error('게시글 상세 조회 실패:', error);
    throw error;
  }
};

// 게시글 수정
export const updatePost = async (id, postData) => {
  try {
    const requestBody = {
      title: postData.title,
      content: postData.content
    };

    // REVIEW 카테고리인 경우 rating 추가
    if (postData.category === 'REVIEW' && postData.rating !== undefined) {
      requestBody.rating = postData.rating;
    }

    return apiRequest(`/posts/${id}`, {
      method: 'PUT',
      data: requestBody,
    });
  } catch (error) {
    console.error('게시글 수정 실패:', error);
    throw error;
  }
};

// 게시글 삭제
export const deletePost = async (id) => {
  try {
    return apiRequest(`/posts/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('게시글 삭제 실패:', error);
    throw error;
  }
};

// 게시글 목록 조회
export const getPosts = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    // 필터 조건 추가
    if (filters.category) {
      params.append('category', filters.category);
    }
    if (filters.activityId) {
      params.append('activityId', filters.activityId);
    }
    if (filters.memberId) {
      params.append('memberId', filters.memberId);
    }
    
    // 페이지네이션
    if (filters.page !== undefined) {
      params.append('page', filters.page);
    }
    if (filters.size !== undefined) {
      params.append('size', filters.size);
    }
    
    // 정렬
    if (filters.sort) {
      if (Array.isArray(filters.sort)) {
        filters.sort.forEach(sortItem => {
          params.append('sort', sortItem);
        });
      } else {
        params.append('sort', filters.sort);
      }
    }

    const queryString = params.toString();
    const url = queryString ? `/posts?${queryString}` : '/posts';

    return apiRequest(url);
  } catch (error) {
    console.error('게시글 목록 조회 실패:', error);
    throw error;
  }
};

// 게시글 생성
export const createPost = async (postData) => {
  try {
    const requestBody = {
      postCategory: postData.postCategory,
      title: postData.title,
      content: postData.content
    };

    // REVIEW 카테고리인 경우 activityId와 rating 필수
    if (postData.postCategory === 'REVIEW') {
      if (!postData.activityId) {
        throw new Error('후기 작성 시 활동 ID가 필요합니다.');
      }
      if (!postData.rating) {
        throw new Error('후기 작성 시 별점이 필요합니다.');
      }
      requestBody.activityId = postData.activityId;
      requestBody.rating = postData.rating;
    }

    return apiRequest('/posts', {
      method: 'POST',
      data: requestBody,
    });
  } catch (error) {
    console.error('게시글 생성 실패:', error);
    throw error;
  }
};

// 게시글 좋아요
export const likePost = async (id) => {
  try {
    return apiRequest(`/posts/${id}/like`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('게시글 좋아요 실패:', error);
    throw error;
  }
};

// 게시글 좋아요 취소
export const unlikePost = async (id) => {
  try {
    return apiRequest(`/posts/${id}/like`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('게시글 좋아요 취소 실패:', error);
    throw error;
  }
};

export default {
  getPost,
  updatePost,
  deletePost,
  getPosts,
  createPost,
  likePost,
  unlikePost
}
