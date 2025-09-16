// CORS 관련 유틸리티 함수들

// 허용된 오리진 목록
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:8080',
  'https://yourdomain.com', // 프로덕션 도메인
];

// CORS 헤더 설정
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // 개발 환경에서는 모든 오리진 허용
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
};

// 오리진 검증 함수
export const isAllowedOrigin = (origin: string): boolean => {
  return ALLOWED_ORIGINS.includes(origin);
};

// CORS 에러 처리
export const handleCorsError = (error: any) => {
  if (error.code === 'ERR_NETWORK') {
    console.error('네트워크 오류: Spring Boot 서버가 실행 중인지 확인하세요.');
  } else if (error.response?.status === 0) {
    console.error('CORS 오류: Spring Boot 서버의 CORS 설정을 확인하세요.');
  }
  return error;
};
