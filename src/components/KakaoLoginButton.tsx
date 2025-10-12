import React from 'react';
import { kakaoAuthService } from '@/services/kakaoAuthService';
import '@/styles/components/KakaoLoginButton.css';

/**
 * 카카오 로그인 버튼 컴포넌트
 */
const KakaoLoginButton: React.FC = () => {
  const handleKakaoLogin = () => {
    // 카카오 로그인 페이지로 리다이렉트
    kakaoAuthService.redirectToKakaoLogin();
  };

  return (
    <button 
      onClick={handleKakaoLogin} 
      className="kakao-login-button"
      type="button"
    >
      <svg className="kakao-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 0C4.477 0 0 3.634 0 8.111c0 2.87 1.896 5.395 4.738 6.817-.196.722-.65 2.434-.738 2.826-.107.478.175.472.37.343.157-.103 2.526-1.67 3.629-2.404.636.089 1.29.135 1.957.135 5.523 0 10-3.634 10-8.111C20 3.634 15.523 0 10 0z" fill="#000000"/>
      </svg>
      <span>카카오로 시작하기</span>
    </button>
  );
};

export default KakaoLoginButton;

