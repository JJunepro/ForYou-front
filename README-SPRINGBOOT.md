# Spring Boot 연결 설정 가이드

이 문서는 React + Vite 프론트엔드 프로젝트를 Spring Boot 백엔드와 연결하기 위한 설정 가이드입니다.

## 📋 설정 완료 사항

### 1. HTTP 클라이언트 설정
- ✅ `axios` 라이브러리 설치
- ✅ API 서비스 모듈 생성 (`src/services/api.ts`)
- ✅ 인증 서비스 모듈 생성 (`src/services/authService.ts`)

### 2. 프록시 설정
- ✅ Vite 프록시 설정 (`vite.config.ts`)
  - 프론트엔드: `http://localhost:3000`
  - 백엔드: `http://localhost:8080`
  - API 경로: `/api/*`

### 3. 환경 설정
- ✅ 환경 설정 파일 (`src/config/environment.ts`)
- ✅ API 엔드포인트 정의

### 4. CORS 설정
- ✅ CORS 유틸리티 (`src/utils/cors.ts`)
- ✅ 에러 처리 로직

### 5. 타입 정의
- ✅ API 관련 타입 정의 (`src/types/api.ts`)

## 🚀 사용 방법

### 1. API 호출 예시
```typescript
import { ApiService } from './services/api';
import { AuthService } from './services/authService';

// GET 요청
const users = await ApiService.get('/users');

// POST 요청
const newUser = await ApiService.post('/users', { name: 'John', email: 'john@example.com' });

// 인증
const authResponse = await AuthService.login({ email: 'user@example.com', password: 'password' });
```

### 2. 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_NODE_ENV=development
```

## 🔧 Spring Boot 백엔드 설정 필요 사항

### 1. CORS 설정
Spring Boot 애플리케이션에 다음 설정을 추가하세요:

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### 2. API 컨트롤러 예시
```java
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    
    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {
        // 사용자 목록 반환
    }
    
    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        // 로그인 처리
    }
}
```

## 🐛 문제 해결

### 1. CORS 오류
- Spring Boot 서버의 CORS 설정 확인
- 프론트엔드와 백엔드 포트 확인 (3000, 8080)

### 2. 네트워크 오류
- Spring Boot 서버가 실행 중인지 확인
- API 엔드포인트 URL 확인

### 3. 인증 오류
- JWT 토큰 설정 확인
- Authorization 헤더 설정 확인

## 📁 프로젝트 구조
```
src/
├── config/
│   └── environment.ts      # 환경 설정
├── services/
│   ├── api.ts             # API 서비스
│   └── authService.ts     # 인증 서비스
├── types/
│   └── api.ts             # API 타입 정의
├── utils/
│   └── cors.ts            # CORS 유틸리티
└── ...
```

## 🔄 다음 단계
1. Spring Boot 백엔드 API 구현
2. React Router 설정
3. 상태 관리 (Redux/Zustand) 설정
4. UI 컴포넌트 개발
5. 테스트 코드 작성
