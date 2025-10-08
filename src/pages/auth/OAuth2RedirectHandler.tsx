// OAuth2 리다이렉트 처리 페이지
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (token) {
      // 로컬 스토리지에 JWT 토큰 저장
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', email || '');

      // AdminPage와 호환되도록 user 객체도 저장
      const user = {
        memEmail: email || '',
        memNick: email?.split('@')[0] || '사용자', // 이메일 앞부분을 닉네임으로 사용
        memStatus: 'Y',
        provider: 'google'
      };
      localStorage.setItem('user', JSON.stringify(user));

      console.log('Google 로그인 성공!');
      console.log('Token:', token);
      console.log('Email:', email);

      // 관리자 페이지로 이동
      navigate('/admin', { replace: true });
    } else {
      // 로그인 실패 처리
      console.error('로그인 실패: 토큰을 받지 못했습니다.');
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
      navigate('/', { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          fontSize: '24px',
          marginBottom: '20px'
        }}>
          🔐
        </div>
        <div style={{
          fontSize: '18px',
          color: '#333',
          marginBottom: '10px'
        }}>
          로그인 처리 중...
        </div>
        <div style={{
          fontSize: '14px',
          color: '#666'
        }}>
          잠시만 기다려주세요
        </div>
      </div>
    </div>
  );
};

export default OAuth2RedirectHandler;