// API 테스트를 위한 스크립트
// 브라우저 콘솔에서 실행하거나 별도 파일로 저장해서 테스트

// 1. 감정 기록 생성 테스트
async function testCreateEmotion() {
  try {
    const response = await fetch('/api/v1/emotions?member-id=1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emotionState: 'happy',
        emotionText: '오늘은 정말 좋은 하루였어요!'
      }),
    });

    console.log('응답 상태:', response.status);
    console.log('응답 헤더:', response.headers);
    
    if (response.ok) {
      const data = await response.json();
      console.log('성공:', data);
    } else {
      const error = await response.text();
      console.log('에러:', error);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
}

// 2. 감정 기록 목록 조회 테스트
async function testGetEmotions() {
  try {
    const response = await fetch('/api/v1/emotions?page=0&size=10&sort=createdAt,desc', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('응답 상태:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('감정 기록 목록:', data);
    } else {
      const error = await response.text();
      console.log('에러:', error);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
}

// 3. 다양한 감정 상태로 테스트
async function testAllEmotions() {
  const emotions = [
    { state: 'happy', text: '행복한 하루' },
    { state: 'neutral', text: '보통인 하루' },
    { state: 'sad', text: '슬픈 하루' },
    { state: 'angry', text: '화나는 하루' },
    { state: 'worried', text: '걱정되는 하루' }
  ];

  for (const emotion of emotions) {
    console.log(`테스트 중: ${emotion.state}`);
    await testCreateEmotionWithData(emotion.state, emotion.text);
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
  }
}

// 3-1. 감정 기록 생성 테스트 (매개변수 포함)
async function testCreateEmotionWithData(emotionState, emotionText) {
  try {
    const response = await fetch('/api/v1/emotions?member-id=1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emotionState: emotionState,
        emotionText: emotionText
      }),
    });

    console.log('응답 상태:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('성공:', data);
    } else {
      const error = await response.text();
      console.log('에러:', error);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
}

// 4. 활동 생성 테스트
async function testCreateActivity() {
  try {
    const activityData = {
      activityType: 'GROUP',
      title: '새로운 그룹 활동',
      content: '함께하는 즐거운 활동입니다.',
      location: '서울시 강남구',
      applyStartAt: '2025-01-01T00:00:00Z',
      applyEndAt: '2025-12-31T23:59:59Z',
      recruitStatus: 'OPEN'
    };

    const response = await fetch('/api/v1/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activityData),
    });

    console.log('응답 상태:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('활동 생성 성공:', data);
    } else {
      const error = await response.text();
      console.log('에러:', error);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
}

// 5. 활동 목록 조회 테스트
async function testGetActivities() {
  try {
    const response = await fetch('/api/v1/activities?page=0&size=10&sort=createdAt,desc', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('응답 상태:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('활동 목록:', data);
    } else {
      const error = await response.text();
      console.log('에러:', error);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
}

// 6. 활동 상세 조회 테스트
async function testGetActivity() {
  try {
    const response = await fetch('/api/v1/activities/1', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('응답 상태:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('활동 상세 정보:', data);
    } else {
      const error = await response.text();
      console.log('에러:', error);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
}

// 7. 활동 수정 테스트
async function testUpdateActivity() {
  try {
    const updateData = {
      activityType: 'GROUP',
      title: '수정된 활동 제목',
      content: '수정된 활동 내용입니다.',
      location: '서울시 강남구',
      applyStartAt: '2025-01-01T00:00:00Z',
      applyEndAt: '2025-12-31T23:59:59Z',
      recruitStatus: 'OPEN'
    };

    const response = await fetch('/api/v1/activities/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    console.log('응답 상태:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('활동 수정 성공:', data);
    } else {
      const error = await response.text();
      console.log('에러:', error);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
}

// 8. 활동 삭제 테스트
async function testDeleteActivity() {
  try {
    const response = await fetch('/api/v1/activities/1', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('응답 상태:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('활동 삭제 성공:', data);
    } else {
      const error = await response.text();
      console.log('에러:', error);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
}

// 9. 활동 찜 테스트
async function testLikeActivity() {
  try {
    const response = await fetch('/api/v1/activities/1/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('응답 상태:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('활동 찜 성공:', data);
    } else {
      const error = await response.text();
      console.log('에러:', error);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
}

// 10. 활동 찜 해제 테스트
async function testUnlikeActivity() {
  try {
    const response = await fetch('/api/v1/activities/1/like', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('응답 상태:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('활동 찜 해제 성공:', data);
    } else {
      const error = await response.text();
      console.log('에러:', error);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
}

// 11. 활동 신청 테스트
async function testApplyActivity() {
  try {
    const response = await fetch('/api/v1/activities/1/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('응답 상태:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('활동 신청 성공:', data);
    } else {
      const error = await response.text();
      console.log('에러:', error);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
}

// 12. 활동 신청 취소 테스트
async function testCancelActivityApplication() {
  try {
    const response = await fetch('/api/v1/activities/1/apply', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('응답 상태:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('활동 신청 취소 성공:', data);
    } else {
      const error = await response.text();
      console.log('에러:', error);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
}

// 13. 게시글 상세 조회 테스트
async function testGetPost() {
  try {
    const response = await fetch('/api/v1/posts/1', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('응답 상태:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('게시글 상세 정보:', data);
    } else {
      const error = await response.text();
      console.log('에러:', error);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
}

// 14. 게시글 수정 테스트
async function testUpdatePost() {
  try {
    const updateData = {
      title: '수정된 게시글 제목',
      content: '수정된 게시글 내용입니다.',
      category: 'POST'
    };

    const response = await fetch('/api/v1/posts/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    console.log('응답 상태:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('게시글 수정 성공:', data);
    } else {
      const error = await response.text();
      console.log('에러:', error);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
}

// 15. 후기 수정 테스트 (REVIEW 카테고리)
async function testUpdateReview() {
  try {
    const updateData = {
      title: '수정된 후기 제목',
      content: '수정된 후기 내용입니다.',
      category: 'REVIEW',
      rating: 4.5
    };

    const response = await fetch('/api/v1/posts/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    console.log('응답 상태:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('후기 수정 성공:', data);
    } else {
      const error = await response.text();
      console.log('에러:', error);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
}

// 16. 게시글 삭제 테스트
async function testDeletePost() {
  try {
    const response = await fetch('/api/v1/posts/1', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('응답 상태:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('게시글 삭제 성공:', data);
    } else {
      const error = await response.text();
      console.log('에러:', error);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
}

// 17. 게시글 목록 조회 테스트
async function testGetPosts() {
  try {
    const response = await fetch('/api/v1/posts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('응답 상태:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('게시글 목록:', data);
    } else {
      const error = await response.text();
      console.log('에러:', error);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
}

// 18. 게시글 목록 조회 (카테고리 필터) 테스트
async function testGetPostsByCategory() {
  try {
    const response = await fetch('/api/v1/posts?category=POST', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('응답 상태:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('POST 카테고리 게시글 목록:', data);
    } else {
      const error = await response.text();
      console.log('에러:', error);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
}

// 19. 후기 목록 조회 테스트
async function testGetReviews() {
  try {
    const response = await fetch('/api/v1/posts?category=REVIEW', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('응답 상태:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('후기 목록:', data);
    } else {
      const error = await response.text();
      console.log('에러:', error);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
}

// 20. 특정 활동의 게시글 조회 테스트
async function testGetPostsByActivity() {
  try {
    const response = await fetch('/api/v1/posts?activityId=1', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('응답 상태:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('활동 ID 1의 게시글 목록:', data);
    } else {
      const error = await response.text();
      console.log('에러:', error);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
}

// 21. 특정 회원의 게시글 조회 테스트
async function testGetPostsByMember() {
  try {
    const response = await fetch('/api/v1/posts?memberId=1', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('응답 상태:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('회원 ID 1의 게시글 목록:', data);
    } else {
      const error = await response.text();
      console.log('에러:', error);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
}

// 22. 페이지네이션 테스트
async function testGetPostsWithPagination() {
  try {
    const response = await fetch('/api/v1/posts?page=0&size=5', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('응답 상태:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('페이지네이션된 게시글 목록:', data);
    } else {
      const error = await response.text();
      console.log('에러:', error);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
}

// 23. 게시글 생성 테스트
async function testCreatePost() {
  try {
    const postData = {
      postCategory: 'POST',
      title: '새로운 게시글 제목',
      content: '새로운 게시글 내용입니다.'
    };

    const response = await fetch('/api/v1/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    console.log('응답 상태:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('게시글 생성 성공:', data);
    } else {
      const error = await response.text();
      console.log('에러:', error);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
}

// 24. 후기 생성 테스트
async function testCreateReview() {
  try {
    const reviewData = {
      postCategory: 'REVIEW',
      title: '활동 후기',
      content: '정말 좋은 활동이었습니다.',
      activityId: 1,
      rating: 5
    };

    const response = await fetch('/api/v1/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });

    console.log('응답 상태:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('후기 생성 성공:', data);
    } else {
      const error = await response.text();
      console.log('에러:', error);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
}

// 25. 게시글 좋아요 테스트
async function testLikePost() {
  try {
    const response = await fetch('/api/v1/posts/1/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('응답 상태:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('게시글 좋아요 성공:', data);
    } else {
      const error = await response.text();
      console.log('에러:', error);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
}

// 26. 게시글 좋아요 취소 테스트
async function testUnlikePost() {
  try {
    const response = await fetch('/api/v1/posts/1/like', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('응답 상태:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('게시글 좋아요 취소 성공:', data);
    } else {
      const error = await response.text();
      console.log('에러:', error);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
}

// 27. 감정 기록 수정 테스트
async function testUpdateEmotion() {
  try {
    const updateData = {
      emotionState: 'happy',
      emotionText: '수정된 감정 기록입니다.'
    };

    const response = await fetch('/api/v1/emotions/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    console.log('응답 상태:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('감정 기록 수정 성공:', data);
    } else {
      const error = await response.text();
      console.log('에러:', error);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
}

// 28. 감정 기록 삭제 테스트
async function testDeleteEmotion() {
  try {
    const response = await fetch('/api/v1/emotions/1', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('응답 상태:', response.status);
    
    if (response.ok) {
      console.log('감정 기록 삭제 성공');
    } else {
      const error = await response.text();
      console.log('에러:', error);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
}

// 사용법:
// testCreateEmotion() - 단일 감정 기록 생성 테스트
// testGetEmotions() - 감정 기록 목록 조회 테스트
// testAllEmotions() - 모든 감정 상태로 테스트
// testCreateEmotionWithData() - 매개변수를 받는 감정 기록 생성 테스트
// testUpdateEmotion() - 감정 기록 수정 테스트
// testDeleteEmotion() - 감정 기록 삭제 테스트
// testCreateActivity() - 활동 생성 테스트
// testGetActivities() - 활동 목록 조회 테스트
// testGetActivity() - 활동 상세 조회 테스트
// testUpdateActivity() - 활동 수정 테스트
// testDeleteActivity() - 활동 삭제 테스트
// testLikeActivity() - 활동 찜 테스트
// testUnlikeActivity() - 활동 찜 해제 테스트
// testApplyActivity() - 활동 신청 테스트
// testCancelActivityApplication() - 활동 신청 취소 테스트
// testGetPost() - 게시글 상세 조회 테스트
// testUpdatePost() - 게시글 수정 테스트
// testUpdateReview() - 후기 수정 테스트
// testDeletePost() - 게시글 삭제 테스트
// testGetPosts() - 게시글 목록 조회 테스트
// testGetPostsByCategory() - 카테고리별 게시글 조회 테스트
// testGetReviews() - 후기 목록 조회 테스트
// testGetPostsByActivity() - 특정 활동의 게시글 조회 테스트
// testGetPostsByMember() - 특정 회원의 게시글 조회 테스트
// testGetPostsWithPagination() - 페이지네이션 테스트
// testCreatePost() - 게시글 생성 테스트
// testCreateReview() - 후기 생성 테스트
// testLikePost() - 게시글 좋아요 테스트
// testUnlikePost() - 게시글 좋아요 취소 테스트
