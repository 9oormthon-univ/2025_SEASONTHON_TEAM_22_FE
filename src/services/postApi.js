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

// ===== 게시글 관련 API =====

// 게시글 상세 조회
export const getPost = (id) => {
  return apiRequest(`/api/v1/posts/${id}`);
};

// 게시글 수정
export const updatePost = (id, postData) => {
  const requestBody = {
    title: postData.title,
    content: postData.content
  };

  // REVIEW 카테고리인 경우 rating 추가
  if (postData.category === 'REVIEW' && postData.rating !== undefined) {
    requestBody.rating = postData.rating;
  }

  return apiRequest(`/api/v1/posts/${id}`, {
    method: 'PUT',
    data: requestBody,
  });
};

// 게시글 삭제
export const deletePost = (id) => {
  return apiRequest(`/api/v1/posts/${id}`, {
    method: 'DELETE',
  });
};

// 게시글 목록 조회
export const getPosts = (filters = {}) => {
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
  const url = queryString ? `/api/v1/posts?${queryString}` : '/api/v1/posts';

  return apiRequest(url);
};

// 게시글 생성
export const createPost = (postData) => {
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

  return apiRequest('/api/v1/posts', {
    method: 'POST',
    data: requestBody,
  });
};

// 게시글 좋아요
export const likePost = (id) => {
  return apiRequest(`/api/v1/posts/${id}/like`, {
    method: 'POST',
  });
};

// 게시글 좋아요 취소
export const unlikePost = (id) => {
  return apiRequest(`/api/v1/posts/${id}/like`, {
    method: 'DELETE',
  });
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
