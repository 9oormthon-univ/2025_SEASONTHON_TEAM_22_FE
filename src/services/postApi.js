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
export const getPost = async (postId) => {
    try {
    const url = `/api/v1/posts/${postId}`;

    const response = await apiRequest(url, {
      method: 'GET',
    });

    return response.data;
    
  } catch (error) {
    console.error('게시글 상세 조회 실패:', error.message);
    throw error;
  }
};

// 게시글 수정
export const updatePost = async (memberId, postId, postData) => {
  const requestBody = {
    title: postData.title,
    content: postData.content
  };

  return apiRequest(`/api/v1/posts/${postId}/${memberId}`, {
    method: 'PUT',
    data: requestBody,
  });
};

// 게시글 삭제
export const deletePost = (memberId, postId) => {
  return apiRequest(`/api/v1/posts/${postId}/${memberId}`, {
    method: 'DELETE',
  });
};

// 게시글 목록 조회
export const getPosts = async (activityId, memberId = {}) => {
  try {
    // 1. Path Parameter를 사용하여 기본 URL을 구성합니다.
    const baseUrl = `/api/v1/posts/${activityId}/${memberId}`;

    // 2. Query Parameter를 처리합니다.
    const params = new URLSearchParams();

    if (filters.category) {
      params.append('category', filters.category);
    }
    if (filters.page !== undefined) {
      params.append('page', filters.page);
    }
    if (filters.size !== undefined) {
      params.append('size', filters.size);
    }
    if (filters.sort) {
      // sort는 배열로 여러 개 올 수 있으므로 별도 처리
      if (Array.isArray(filters.sort)) {
        filters.sort.forEach(sortItem => params.append('sort', sortItem));
      } else {
        params.append('sort', filters.sort);
      }
    }

    // 3. 최종 URL을 조합합니다.
    const queryString = params.toString();
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    const response = await apiRequest(url, {
      method: 'GET',
    });

    return response.data;

  } catch (error) {
    console.error('게시글 목록 조회 실패:', error.message);
    throw error;
  }
};

// 게시글 생성
export const createPost = (memberId, postData) => {
  const requestBody = {
    postCategory: postData.postCategory,
    title: postData.title,
    content: postData.content,
    activityId: postData.activityId,
    rating: postData.rating
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

  return apiRequest(`/api/v1/posts/${memberId}`, {
    method: 'POST',
    data: requestBody,
  });
};

// 게시글 좋아요
export const likePost = (memberId, postId) => {
  return apiRequest(`/api/v1/posts/${postId}/like/${memberId}`, {
    method: 'POST',
  });
};

// 게시글 좋아요 취소
export const unlikePost = (memberId, postId) => {
  return apiRequest(`/api/v1/posts/${postId}/like/${memberId}`, {
    method: 'DELETE',
  });
};

export const getDetailPosts = (postId) => {
  return apiRequest(`/api/v1/posts/${postId}`, {
    method: 'GET',
  });
}

export const getMyReviews = (memberId, pageable = { page: 0, size: 20, sort: ['createdAt,desc'] }) => {
  const params = new URLSearchParams();
  params.append('page', pageable.page);
  params.append('size', pageable.size);
  if (pageable.sort && pageable.sort.length > 0) {
    pageable.sort.forEach(sort => params.append('sort', sort));
  }
  return apiRequest(`/api/v1/posts/${memberId}/reviews?${params.toString()}`, {
    method: 'GET',
  });
}

export const getMyPosts = (
  memberId,
  category,
  pageable = { page: 0, size: 20, sort: ["createdAt,desc"] }
) => {
  const params = new URLSearchParams();

  // 1. category 파라미터가 존재할 경우, URL 파라미터에 추가합니다.
  if (category) {
    params.append("category", category);
  }

  // --- 기존 pageable 로직 ---
  params.append("page", pageable.page);
  params.append("size", pageable.size);
  if (pageable.sort && pageable.sort.length > 0) {
    pageable.sort.forEach((sort) => params.append("sort", sort));
  }

  // 2. apiRequest는 그대로 사용합니다.
  return apiRequest(`/api/v1/posts/${memberId}?${params.toString()}`, {
    method: "GET",
  });
};

export const myLikes = (memberId, pageable = { page: 0, size: 20, sort: ["createdAt,desc"] }) => {
  const params = new URLSearchParams();
  params.append("page", pageable.page);
  params.append("size", pageable.size);
  if (pageable.sort && pageable.sort.length > 0) {
    pageable.sort.forEach((sort) => params.append("sort", sort));
  }
  return apiRequest(`/api/v1/posts/${memberId}/likes?${params.toString()}`, {
    method: "GET",
  });
}

export default {
  getPost,
  updatePost,
  deletePost,
  getPosts,
  createPost,
  likePost,
  unlikePost,
  getDetailPosts,
  getMyReviews,
  getMyPosts,
  myLikes,
}
