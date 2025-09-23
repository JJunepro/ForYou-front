import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginRequest } from '@/types/api';
import '@/styles/pages/auth/Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState<LoginRequest>({
    memEmail: '',
    memPwd: ''
  });
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginData.memEmail || !loginData.memPwd) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      // TODO: 실제 API 호출 구현
      console.log('로그인 시도:', loginData);
      
      // 임시 로그인 성공 처리
      if (loginData.memEmail === 'admin@example.com' && loginData.memPwd === 'admin') {
        localStorage.setItem('token', 'temp-token');
        localStorage.setItem('user', JSON.stringify({
          memKey: 1,
          memEmail: loginData.memEmail,
          memNick: '관리자',
          memStatus: 'Y'
        }));
        navigate('/admin');
      } else {
        setError('잘못된 이메일 또는 비밀번호입니다.');
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
    }
  };

  const handleAdminPage = () => {
    navigate('/admin');
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

        <div className="login-actions">
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
