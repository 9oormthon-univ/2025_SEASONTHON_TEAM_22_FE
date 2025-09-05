# API 사용법 가이드

## 개요
이 문서는 SlowMind 애플리케이션에서 사용하는 모든 API의 사용법을 설명합니다.

## API 서비스 파일
- `src/services/emotionService.js`: 모든 API 호출 함수들이 정의된 파일

## 감정 기록 API

### 1. 감정 기록 생성
```javascript
import { createEmotion } from '../services/emotionService'

const emotionData = {
  mood: 'happy', // 'happy', 'neutral', 'sad', 'angry', 'worried'
  note: '오늘은 정말 좋은 하루였어요!'
}

try {
  const result = await createEmotion(emotionData, 1) // memberId: 1
  console.log('감정 기록 생성 성공:', result)
} catch (error) {
  console.error('생성 실패:', error.message)
}
```

### 2. 감정 기록 목록 조회
```javascript
import { getEmotions } from '../services/emotionService'

const pageable = {
  page: 0,
  size: 10,
  sort: ['createdAt,desc']
}

try {
  const data = await getEmotions(pageable)
  console.log('감정 기록 목록:', data)
} catch (error) {
  console.error('조회 실패:', error.message)
}
```

### 3. 감정 기록 수정
```javascript
import { updateEmotion } from '../services/emotionService'

const emotionData = {
  emotionState: 'happy',
  emotionText: '수정된 감정 기록입니다.'
}

try {
  const result = await updateEmotion(1, emotionData) // emotionId: 1
  console.log('감정 기록 수정 성공:', result)
} catch (error) {
  console.error('수정 실패:', error.message)
}
```

### 4. 감정 기록 삭제
```javascript
import { deleteEmotion } from '../services/emotionService'

try {
  await deleteEmotion(1) // emotionId: 1
  console.log('감정 기록 삭제 성공')
} catch (error) {
  console.error('삭제 실패:', error.message)
}
```

## 활동 API

### 1. 활동 생성
```javascript
import { createActivity } from '../services/emotionService'

const activityData = {
  activityType: 'GROUP',
  title: '새로운 그룹 활동',
  content: '함께하는 즐거운 활동입니다.',
  location: '서울시 강남구',
  applyStartAt: '2025-01-01T00:00:00Z',
  applyEndAt: '2025-12-31T23:59:59Z',
  recruitStatus: 'OPEN'
}

try {
  const result = await createActivity(activityData)
  console.log('활동 생성 성공:', result)
} catch (error) {
  console.error('생성 실패:', error.message)
}
```

### 2. 활동 목록 조회
```javascript
import { getActivities } from '../services/emotionService'

const pageable = {
  page: 0,
  size: 10,
  sort: ['createdAt,desc']
}

try {
  const data = await getActivities(pageable)
  console.log('활동 목록:', data)
} catch (error) {
  console.error('조회 실패:', error.message)
}
```

### 3. 활동 상세 조회
```javascript
import { getActivity } from '../services/emotionService'

try {
  const data = await getActivity(1) // activityId: 1
  console.log('활동 상세 정보:', data)
} catch (error) {
  console.error('조회 실패:', error.message)
}
```

### 4. 활동 수정
```javascript
import { updateActivity } from '../services/emotionService'

const activityData = {
  activityType: 'GROUP',
  title: '수정된 활동 제목',
  content: '수정된 활동 내용입니다.',
  location: '서울시 강남구',
  applyStartAt: '2025-01-01T00:00:00Z',
  applyEndAt: '2025-12-31T23:59:59Z',
  recruitStatus: 'OPEN'
}

try {
  const result = await updateActivity(1, activityData) // activityId: 1
  console.log('활동 수정 성공:', result)
} catch (error) {
  console.error('수정 실패:', error.message)
}
```

### 5. 활동 삭제
```javascript
import { deleteActivity } from '../services/emotionService'

try {
  await deleteActivity(1) // activityId: 1
  console.log('활동 삭제 성공')
} catch (error) {
  console.error('삭제 실패:', error.message)
}
```

### 6. 활동 찜하기
```javascript
import { likeActivity } from '../services/emotionService'

try {
  const result = await likeActivity(1) // activityId: 1
  console.log('활동 찜 성공:', result)
} catch (error) {
  console.error('찜 실패:', error.message)
}
```

### 7. 활동 찜 해제
```javascript
import { unlikeActivity } from '../services/emotionService'

try {
  const result = await unlikeActivity(1) // activityId: 1
  console.log('활동 찜 해제 성공:', result)
} catch (error) {
  console.error('찜 해제 실패:', error.message)
}
```

### 8. 활동 신청
```javascript
import { applyActivity } from '../services/emotionService'

try {
  const result = await applyActivity(1) // activityId: 1
  console.log('활동 신청 성공:', result)
} catch (error) {
  console.error('신청 실패:', error.message)
}
```

### 9. 활동 신청 취소
```javascript
import { cancelActivityApplication } from '../services/emotionService'

try {
  const result = await cancelActivityApplication(1) // activityId: 1
  console.log('활동 신청 취소 성공:', result)
} catch (error) {
  console.error('신청 취소 실패:', error.message)
}
```

## 게시글 API

### 1. 게시글 생성
```javascript
import { createPost } from '../services/emotionService'

// 일반 게시글
const postData = {
  postCategory: 'POST',
  title: '새로운 게시글',
  content: '게시글 내용입니다.'
}

// 후기 (별점 필수)
const reviewData = {
  postCategory: 'REVIEW',
  title: '활동 후기',
  content: '정말 좋은 활동이었습니다.',
  activityId: 1,
  rating: 5
}

try {
  const result = await createPost(postData)
  console.log('게시글 생성 성공:', result)
} catch (error) {
  console.error('생성 실패:', error.message)
}
```

### 2. 게시글 목록 조회
```javascript
import { getPosts } from '../services/emotionService'

// 전체 게시글
const allPosts = await getPosts()

// 카테고리별 조회
const posts = await getPosts({ category: 'POST' })
const reviews = await getPosts({ category: 'REVIEW' })

// 특정 활동의 게시글
const activityPosts = await getPosts({ activityId: 1 })

// 특정 회원의 게시글
const memberPosts = await getPosts({ memberId: 1 })

// 페이지네이션
const paginatedPosts = await getPosts({ 
  page: 0, 
  size: 10 
})

// 정렬
const sortedPosts = await getPosts({ 
  sort: ['createdAt,desc'] 
})

// 복합 필터
const filteredPosts = await getPosts({
  category: 'REVIEW',
  activityId: 1,
  page: 0,
  size: 5,
  sort: ['rating,desc']
})
```

### 3. 게시글 상세 조회
```javascript
import { getPost } from '../services/emotionService'

try {
  const data = await getPost(1) // postId: 1
  console.log('게시글 상세 정보:', data)
} catch (error) {
  console.error('조회 실패:', error.message)
}
```

### 4. 게시글 수정
```javascript
import { updatePost } from '../services/emotionService'

// 일반 게시글 수정
const postData = {
  title: '수정된 제목',
  content: '수정된 내용',
  category: 'POST'
}

// 후기 수정 (별점 포함)
const reviewData = {
  title: '수정된 후기 제목',
  content: '수정된 후기 내용',
  category: 'REVIEW',
  rating: 4.5
}

try {
  const result = await updatePost(1, postData) // postId: 1
  console.log('게시글 수정 성공:', result)
} catch (error) {
  console.error('수정 실패:', error.message)
}
```

### 5. 게시글 삭제
```javascript
import { deletePost } from '../services/emotionService'

try {
  await deletePost(1) // postId: 1
  console.log('게시글 삭제 성공')
} catch (error) {
  console.error('삭제 실패:', error.message)
}
```

### 6. 게시글 좋아요
```javascript
import { likePost } from '../services/emotionService'

try {
  const result = await likePost(1) // postId: 1
  console.log('게시글 좋아요 성공:', result)
} catch (error) {
  console.error('좋아요 실패:', error.message)
}
```

### 7. 게시글 좋아요 취소
```javascript
import { unlikePost } from '../services/emotionService'

try {
  const result = await unlikePost(1) // postId: 1
  console.log('게시글 좋아요 취소 성공:', result)
} catch (error) {
  console.error('좋아요 취소 실패:', error.message)
}
```

## 에러 처리

모든 API 함수는 다음과 같은 에러를 처리합니다:

### HTTP 상태 코드별 에러
- **400**: 잘못된 요청 (입력값 확인 필요)
- **401**: 인증 실패 (로그인 필요)
- **403**: 권한 없음 (본인 데이터만 접근 가능)
- **404**: 리소스 없음 (존재하지 않는 데이터)
- **409**: 충돌 (이미 처리된 상태)
- **500**: 서버 오류

### 에러 처리 예시
```javascript
try {
  const result = await createEmotion(emotionData, 1)
  // 성공 처리
} catch (error) {
  if (error.message.includes('인증이 필요')) {
    // 로그인 페이지로 이동
    navigate('/login')
  } else if (error.message.includes('잘못된 요청')) {
    // 입력값 검증 메시지 표시
    toast.error('입력값을 확인해주세요.')
  } else {
    // 일반적인 에러 메시지 표시
    toast.error(`오류가 발생했습니다: ${error.message}`)
  }
}
```

## 테스트

브라우저 콘솔에서 다음 함수들을 사용하여 API를 테스트할 수 있습니다:

```javascript
// 감정 기록 테스트
testCreateEmotion()
testGetEmotions()
testAllEmotions()
testUpdateEmotion()
testDeleteEmotion()

// 활동 테스트
testCreateActivity()
testGetActivities()
testGetActivity()
testUpdateActivity()
testDeleteActivity()
testLikeActivity()
testUnlikeActivity()
testApplyActivity()
testCancelActivityApplication()

// 게시글 테스트
testCreatePost()
testCreateReview()
testGetPosts()
testGetPostsByCategory()
testGetReviews()
testGetPostsByActivity()
testGetPostsByMember()
testGetPostsWithPagination()
testGetPost()
testUpdatePost()
testUpdateReview()
testDeletePost()
testLikePost()
testUnlikePost()
```

## 주의사항

1. **인증**: 현재는 인증 토큰이 주석 처리되어 있습니다. 실제 배포 시에는 인증 로직을 활성화해야 합니다.

2. **에러 처리**: 모든 API 호출은 try-catch 블록으로 감싸서 에러를 처리해야 합니다.

3. **로딩 상태**: API 호출 중에는 로딩 상태를 표시하여 사용자 경험을 개선해야 합니다.

4. **오프라인 처리**: API 실패 시 로컬 스토리지에 백업 저장하는 로직이 일부 구현되어 있습니다.

5. **멱등성**: 좋아요/찜하기 API는 멱등성을 보장하므로 중복 호출해도 안전합니다.
