const API_BASE_URL = 'http://localhost:8080/api/v1';

// 감정 기록 목록 조회
export const getEmotions = async (pageable = { page: 0, size: 10, sort: ['createdAt,desc'] }) => {
  try {
    const params = new URLSearchParams();
    params.append('page', pageable.page || 0);
    params.append('size', pageable.size || 10);
    
    if (pageable.sort && pageable.sort.length > 0) {
      pageable.sort.forEach(sort => {
        params.append('sort', sort);
      });
    }

    const response = await fetch(`${API_BASE_URL}/emotions?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 인증 토큰이 필요한 경우 추가
        // 'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('감정 기록 목록 조회 실패:', error);
    throw error;
  }
};

// 감정 기록 생성
export const createEmotion = async (emotionData, memberId = 1) => {
  try {
    const requestBody = {
      emotionState: emotionData.mood,
      emotionText: emotionData.note
    };

    const response = await fetch(`${API_BASE_URL}/emotions?member-id=${memberId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('잘못된 요청입니다. 입력값을 확인해주세요.');
      } else if (response.status === 401) {
        throw new Error('인증이 필요합니다.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    // 201 Created 응답의 경우 body가 비어있을 수 있음
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return data;
    }
    
    return { success: true, status: response.status };
  } catch (error) {
    console.error('감정 기록 생성 실패:', error);
    throw error;
  }
};

// 감정 기록 수정 (PUT API가 있다면 추가)
export const updateEmotion = async (emotionId, emotionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/emotions/${emotionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(emotionData),
    });

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('잘못된 요청입니다. 입력값을 확인해주세요.');
      } else if (response.status === 401) {
        throw new Error('인증이 필요합니다.');
      } else if (response.status === 404) {
        throw new Error('존재하지 않는 감정 기록입니다.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('감정 기록 수정 실패:', error);
    throw error;
  }
};

// 감정 기록 삭제 (DELETE API가 있다면 추가)
export const deleteEmotion = async (emotionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/emotions/${emotionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('인증이 필요합니다.');
      } else if (response.status === 403) {
        throw new Error('본인의 감정 기록만 삭제할 수 있습니다.');
      } else if (response.status === 404) {
        throw new Error('존재하지 않는 감정 기록입니다.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    return true;
  } catch (error) {
    console.error('감정 기록 삭제 실패:', error);
    throw error;
  }
};

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

    const response = await fetch(`${API_BASE_URL}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('잘못된 요청입니다. 입력값을 확인해주세요.');
      } else if (response.status === 401) {
        throw new Error('인증이 필요합니다.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data = await response.json();
    return data;
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

    const response = await fetch(`${API_BASE_URL}/activities?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('활동 목록 조회 실패:', error);
    throw error;
  }
};

// 활동 상세 조회
export const getActivity = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('존재하지 않는 활동입니다.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data = await response.json();
    return data;
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

    const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('잘못된 요청입니다. 입력값을 확인해주세요.');
      } else if (response.status === 404) {
        throw new Error('존재하지 않는 활동입니다.');
      } else if (response.status === 401) {
        throw new Error('인증이 필요합니다.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('활동 수정 실패:', error);
    throw error;
  }
};

// 활동 삭제
export const deleteActivity = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('존재하지 않는 활동입니다.');
      } else if (response.status === 401) {
        throw new Error('인증이 필요합니다.');
      } else if (response.status === 403) {
        throw new Error('활동을 삭제할 권한이 없습니다.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('활동 삭제 실패:', error);
    throw error;
  }
};

// 활동 찜
export const likeActivity = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/activities/${id}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('존재하지 않는 활동입니다.');
      } else if (response.status === 401) {
        throw new Error('인증이 필요합니다.');
      } else if (response.status === 409) {
        throw new Error('이미 찜한 활동입니다.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('활동 찜 실패:', error);
    throw error;
  }
};

// 활동 찜 해제
export const unlikeActivity = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/activities/${id}/like`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('존재하지 않는 활동입니다.');
      } else if (response.status === 401) {
        throw new Error('인증이 필요합니다.');
      } else if (response.status === 409) {
        throw new Error('찜하지 않은 활동입니다.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('활동 찜 해제 실패:', error);
    throw error;
  }
};

// 활동 신청
export const applyActivity = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/activities/${id}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('존재하지 않는 활동입니다.');
      } else if (response.status === 401) {
        throw new Error('인증이 필요합니다.');
      } else if (response.status === 409) {
        throw new Error('이미 신청한 활동입니다.');
      } else if (response.status === 400) {
        throw new Error('신청 기간이 아닙니다.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('활동 신청 실패:', error);
    throw error;
  }
};

// 활동 신청 취소
export const cancelActivityApplication = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/activities/${id}/apply`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('존재하지 않는 활동입니다.');
      } else if (response.status === 401) {
        throw new Error('인증이 필요합니다.');
      } else if (response.status === 409) {
        throw new Error('신청하지 않은 활동입니다.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('활동 신청 취소 실패:', error);
    throw error;
  }
};

// ===== 게시글 관련 API =====

// 게시글 상세 조회
export const getPost = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('존재하지 않는 게시글입니다.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data = await response.json();
    return data;
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

    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('잘못된 요청입니다. 입력값을 확인해주세요.');
      } else if (response.status === 401) {
        throw new Error('인증이 필요합니다.');
      } else if (response.status === 403) {
        throw new Error('본인의 게시글만 수정할 수 있습니다.');
      } else if (response.status === 404) {
        throw new Error('존재하지 않는 게시글입니다.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('게시글 수정 실패:', error);
    throw error;
  }
};

// 게시글 삭제
export const deletePost = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('인증이 필요합니다.');
      } else if (response.status === 403) {
        throw new Error('본인의 게시글만 삭제할 수 있습니다.');
      } else if (response.status === 404) {
        throw new Error('존재하지 않는 게시글입니다.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data = await response.json();
    return data;
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
    const url = queryString ? `${API_BASE_URL}/posts?${queryString}` : `${API_BASE_URL}/posts`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('잘못된 요청입니다. 필터 조건을 확인해주세요.');
      } else if (response.status === 401) {
        throw new Error('인증이 필요합니다.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data = await response.json();
    return data;
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

    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('잘못된 요청입니다. 입력값을 확인해주세요.');
      } else if (response.status === 401) {
        throw new Error('인증이 필요합니다.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('게시글 생성 실패:', error);
    throw error;
  }
};

// 게시글 좋아요
export const likePost = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('인증이 필요합니다.');
      } else if (response.status === 404) {
        throw new Error('존재하지 않는 게시글입니다.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('게시글 좋아요 실패:', error);
    throw error;
  }
};

// 게시글 좋아요 취소
export const unlikePost = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}/like`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('인증이 필요합니다.');
      } else if (response.status === 404) {
        throw new Error('존재하지 않는 게시글입니다.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('게시글 좋아요 취소 실패:', error);
    throw error;
  }
};
