// React 및 필요한 라이브러리 import
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 hook
import type { SignupRequest } from '@/types/api'; // 회원가입 요청 타입 정의
import '@/styles/pages/auth/Signup.css'; // 회원가입 페이지 스타일

// 회원가입 컴포넌트 정의
const Signup: React.FC = () => {
  // 페이지 이동을 위한 hook
  const navigate = useNavigate();

  // 회원가입 폼 데이터 상태 관리 (이메일, 닉네임, 비밀번호)
  const [signupData, setSignupData] = useState<SignupRequest>({
    memEmail: '', // 사용자 이메일
    memNick: '',  // 사용자 닉네임
    memPwd: ''    // 사용자 비밀번호
  });

  // 비밀번호 확인 입력 상태
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  // 에러 메시지 상태
  const [error, setError] = useState<string>('');
  // 성공 메시지 상태
  const [success, setSuccess] = useState<string>('');

  // 회원가입 입력 필드 값 변경 처리 함수
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // 입력 필드의 name과 value 추출
    setSignupData(prev => ({
      ...prev,        // 기존 데이터 유지
      [name]: value   // 변경된 필드만 업데이트
    }));
  };

  // 비밀번호 확인 입력 처리 함수
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value); // 비밀번호 확인 값 업데이트
  };

  // 회원가입 폼 제출 처리 함수
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); // 폼 기본 제출 동작 방지
    setError('');   // 이전 에러 메시지 초기화
    setSuccess(''); // 이전 성공 메시지 초기화

    // 필수 입력 필드 검증
    if (!signupData.memEmail || !signupData.memNick || !signupData.memPwd) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    // 비밀번호 일치 검증
    if (signupData.memPwd !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 비밀번호 최소 길이 검증
    if (signupData.memPwd.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    try {
      // 백엔드 회원가입 API 호출
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // JSON 형식으로 데이터 전송
        },
        body: JSON.stringify(signupData), // 회원가입 데이터를 JSON으로 변환
      });

      if (response.ok) {
        // 회원가입 성공 처리
        const result = await response.text();
        setSuccess(result);
        // 2초 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        // 회원가입 실패 처리
        const errorData = await response.text();
        setError(errorData || '회원가입 중 오류가 발생했습니다.');
      }
    } catch (err) {
      // 네트워크 에러 처리
      setError('서버 연결 오류가 발생했습니다.');
    }
  };

  // 로그인 페이지로 돌아가는 함수
  const handleBackToLogin = () => {
    navigate('/'); // 로그인 페이지(메인 페이지)로 이동
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>회원가입</h1>
          <p>계정을 생성하여 서비스를 이용하세요</p>
        </div>

        <form onSubmit={handleSignup} className="signup-form">
          <div className="form-group">
            <label htmlFor="memEmail">이메일</label>
            <input
              type="email"
              id="memEmail"
              name="memEmail"
              value={signupData.memEmail}
              onChange={handleInputChange}
              placeholder="이메일을 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="memNick">닉네임</label>
            <input
              type="text"
              id="memNick"
              name="memNick"
              value={signupData.memNick}
              onChange={handleInputChange}
              placeholder="닉네임을 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="memPwd">비밀번호</label>
            <input
              type="password"
              id="memPwd"
              name="memPwd"
              value={signupData.memPwd}
              onChange={handleInputChange}
              placeholder="비밀번호를 입력하세요 (6자 이상)"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          <button type="submit" className="signup-button">
            회원가입
          </button>
        </form>

        <div className="signup-actions">
          <button
            type="button"
            className="back-to-login-button"
            onClick={handleBackToLogin}
          >
            로그인으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;