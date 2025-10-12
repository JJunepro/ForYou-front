import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '@/styles/pages/auth/AdditionalInfo.css';

/**
 * 추가 정보 입력 페이지
 * - 카카오 로그인 시 이메일이 없는 경우
 * - 사용자에게 이메일을 직접 입력받음
 */
const AdditionalInfo: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 전달받은 카카오 사용자 정보
  const kakaoUserInfo = location.state?.kakaoUserInfo;

  useEffect(() => {
    // 카카오 사용자 정보가 없으면 로그인 페이지로
    if (!kakaoUserInfo) {
      alert('잘못된 접근입니다.');
      navigate('/login');
    }
  }, [kakaoUserInfo, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    setLoading(true);

    try {
      console.log('🟡 이메일 추가 후 카카오 로그인 처리...');

      // 백엔드에 이메일을 포함한 카카오 로그인 정보 전송
      const response = await axios.post('http://localhost:8080/api/auth/kakao-login', {
        providerId: kakaoUserInfo.id,
        email: email,  // 사용자가 입력한 이메일
        nickname: kakaoUserInfo.nickname,
        profileImage: kakaoUserInfo.profileImage,
      });

      console.log('✅ 카카오 로그인 성공:', response.data);

      const loginResponse = response.data.data;

      // JWT 토큰 저장
      if (loginResponse.accessToken) {
        localStorage.setItem('token', loginResponse.accessToken);
      }

      // 사용자 정보 저장
      localStorage.setItem('user', JSON.stringify({
        memKey: loginResponse.memKey,
        memEmail: loginResponse.memEmail,
        memNick: loginResponse.memNick,
        provider: 'kakao',
      }));

      alert('회원가입이 완료되었습니다!');
      navigate('/admin');

    } catch (error: any) {
      console.error('❌ 회원가입 실패:', error);
      setError(error.response?.data?.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!kakaoUserInfo) {
    return null;
  }

  return (
    <div className="additional-info-container">
      <div className="additional-info-card">
        <div className="info-header">
          <div className="kakao-badge">🟡 카카오 계정</div>
          <h2>추가 정보 입력</h2>
          <p>서비스 이용을 위해 이메일을 입력해주세요</p>
        </div>

        <div className="user-info">
          <div className="user-profile">
            {kakaoUserInfo.profileImage && (
              <img src={kakaoUserInfo.profileImage} alt="프로필" className="profile-image" />
            )}
            <div className="user-details">
              <p className="user-nickname">{kakaoUserInfo.nickname}님</p>
              <p className="kakao-id">카카오 계정으로 가입</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="info-form">
          <div className="form-group">
            <label htmlFor="email">이메일 주소 *</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              disabled={loading}
            />
            <p className="help-text">
              카카오에서 이메일 정보를 제공하지 않습니다.<br/>
              서비스 이용을 위해 이메일을 입력해주세요.
            </p>
          </div>

          {error && (
            <div className="error-message">{error}</div>
          )}

          <div className="button-group">
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading || !email}
            >
              {loading ? '처리 중...' : '회원가입 완료'}
            </button>
          </div>
        </form>

        <div className="info-notice">
          <p>⚠️ 이메일은 필수 정보입니다. 서비스 이용을 위해 반드시 입력해주세요.</p>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfo;

