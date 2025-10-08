// React 및 필요한 라이브러리 import
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 hook
import type { LoginRequest } from '@/types/api'; // 로그인 요청 타입 정의
import GoogleLoginButton from '@/components/GoogleLoginButton'; // Google 로그인 버튼
import '@/styles/pages/auth/Login.css'; // 로그인 페이지 스타일

// 로그인 컴포넌트 정의
const Login: React.FC = () => {
  // 페이지 이동을 위한 hook
  const navigate = useNavigate();

  // 로그인 폼 데이터 상태 관리 (이메일, 비밀번호)
  const [loginData, setLoginData] = useState<LoginRequest>({
    memEmail: '', // 사용자 이메일
    memPwd: ''    // 사용자 비밀번호
  });

  // 에러 메시지 상태 관리
  const [error, setError] = useState<string>('');

  // 입력 필드 값 변경 처리 함수
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // 입력 필드의 name과 value 추출
    setLoginData(prev => ({
      ...prev,        // 기존 데이터 유지
      [name]: value   // 변경된 필드만 업데이트
    }));
  };

  // 로그인 폼 제출 처리 함수
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // 폼 기본 제출 동작 방지
    setError(''); // 이전 에러 메시지 초기화

    // 필수 입력 필드 검증
    if (!loginData.memEmail || !loginData.memPwd) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      // TODO: 실제 백엔드 API 호출로 변경 예정
      console.log('로그인 시도:', loginData);

      // 임시 로그인 성공 처리 (개발용)
      if (loginData.memEmail === 'admin@example.com' && loginData.memPwd === 'admin') {
        // 로그인 성공 시 토큰과 사용자 정보를 localStorage에 저장
        localStorage.setItem('token', 'temp-token');
        localStorage.setItem('user', JSON.stringify({
          memKey: 1,
          memEmail: loginData.memEmail,
          memNick: '관리자',
          memStatus: 'Y'
        }));
        navigate('/admin'); // 관리자 페이지로 이동
      } else {
        setError('잘못된 이메일 또는 비밀번호입니다.');
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
    }
  };

  // 관리자 페이지 바로가기 함수
  const handleAdminPage = () => {
    navigate('/admin'); // 관리자 페이지로 직접 이동
  };

  // 회원가입 페이지로 이동하는 함수
  const handleSignup = () => {
    navigate('/signup'); // 회원가입 페이지로 이동
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Project</h1>
          <p>로그인하여 시스템에 접속하세요</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="memEmail">ID</label>
            <input
              type="email"
              id="memEmail"
              name="memEmail"
              value={loginData.memEmail}
              onChange={handleInputChange}
              placeholder="이메일을 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="memPwd">Password</label>
            <input
              type="password"
              id="memPwd"
              name="memPwd"
              value={loginData.memPwd}
              onChange={handleInputChange}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button type="submit" className="login-button">
            로그인
          </button>
        </form>

        <div style={{ margin: '20px 0' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            margin: '20px 0'
          }}>
            <div style={{ flex: 1, borderBottom: '1px solid #ddd' }}></div>
            <span style={{ padding: '0 10px', color: '#666', fontSize: '14px' }}>또는</span>
            <div style={{ flex: 1, borderBottom: '1px solid #ddd' }}></div>
          </div>

          <GoogleLoginButton />
        </div>

        <div className="login-actions">
          <button
            type="button"
            className="signup-button"
            onClick={handleSignup}
          >
            회원가입
          </button>
          <button
            type="button"
            className="admin-button"
            onClick={handleAdminPage}
          >
            관리자 페이지 바로가기
          </button>
        </div>

        <div className="login-info">
          <p>테스트 계정: admin@example.com / admin</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
