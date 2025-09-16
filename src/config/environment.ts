// 환경 설정
export const config = {
  // API 기본 URL
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  
  // 환경
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
  
  // 개발 모드 여부
  IS_DEVELOPMENT: import.meta.env.DEV,
  
  // 프로덕션 모드 여부
  IS_PRODUCTION: import.meta.env.PROD,
} as const;

// API 엔드포인트
export const API_ENDPOINTS = {
  // 사용자 관련
  USERS: '/users',
  USER_PROFILE: '/users/profile',
  
  // 인증 관련
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REGISTER: '/auth/register',
  
  // 기타 API 엔드포인트들을 여기에 추가
} as const;
