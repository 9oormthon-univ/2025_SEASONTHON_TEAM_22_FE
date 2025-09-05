# 백엔드 서버 설정 가이드

## 에러 해결 방법

### 1. 백엔드 서버 실행
```bash
# 백엔드 프로젝트 디렉토리로 이동
cd your-backend-project

# 서버 실행 (Spring Boot 예시)
./mvnw spring-boot:run
# 또는
java -jar target/your-app.jar

# 서버가 localhost:8080에서 실행되는지 확인
curl http://localhost:8080/api/v1/emotions
```

### 2. 포트 확인
- 백엔드 서버가 다른 포트에서 실행 중인 경우
- `emotionService.js`의 `API_BASE_URL`을 수정하세요

### 3. CORS 설정 (백엔드)
백엔드에서 CORS를 허용하도록 설정:
```java
@CrossOrigin(origins = "http://localhost:5173") // Vite 기본 포트
@RestController
public class EmotionController {
    // ...
}
```

### 4. 임시 해결책
백엔드가 준비되지 않은 경우:
- 앱은 로컬 스토리지에만 저장됩니다
- API 호출 실패 시 경고 메시지만 표시됩니다
- 기능은 정상적으로 작동합니다

## 테스트 방법

### 1. 백엔드 서버 실행 후
```bash
# 감정 기록 생성 테스트
curl -X POST http://localhost:8080/api/v1/emotions?member-id=1 \
  -H "Content-Type: application/json" \
  -d '{"emotionState": "happy", "emotionText": "테스트"}'
```

### 2. 프론트엔드에서 테스트
- 홈 페이지에서 감정 선택
- 일기 내용 입력
- "감정 기록하기" 버튼 클릭
- 개발자 도구 → Network 탭에서 API 호출 확인
