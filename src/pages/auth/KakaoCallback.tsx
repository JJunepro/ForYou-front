import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { kakaoAuthService } from '@/services/kakaoAuthService';
import '@/styles/pages/auth/KakaoCallback.css';

/**
 * 카카오 OAuth2 콜백 페이지
 * - 카카오 로그인 후 리다이렉트되는 페이지
 * - 인가 코드를 받아서 토큰으로 교환하고 사용자 정보를 가져옴
 */
const KakaoCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('카카오 로그인 처리 중...');

  useEffect(() => {
    const handleKakaoCallback = async () => {
      try {
        // 1. URL에서 인가 코드와 state 추출
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        console.log('🟡 카카오 콜백 시작:', { code: code?.substring(0, 20) + '...', state, error });

        // 에러 처리
        if (error) {
          throw new Error(`카카오 로그인 취소: ${error}`);
        }

        // 코드 없음
        if (!code) {
          throw new Error('인가 코드가 없습니다.');
        }

        // State 검증 (선택사항)
        if (state) {
          const savedState = localStorage.getItem('kakao_oauth_state');
          if (savedState && savedState === state) {
            console.log('✅ State 검증 성공');
            localStorage.removeItem('kakao_oauth_state');
          } else {
            console.warn('⚠️ State 불일치 (계속 진행):', { saved: savedState, received: state });
            // State 불일치해도 계속 진행 (개발 단계)
            localStorage.removeItem('kakao_oauth_state');
          }
        }

        setMessage('카카오 토큰 발급 중...');
        console.log('🟡 Step 1: 토큰 교환 시작...');

        // 2. 인가 코드를 액세스 토큰으로 교환
        const accessToken = await kakaoAuthService.exchangeCodeForToken(code);
        console.log('✅ Step 1 완료: 액세스 토큰 발급 성공');
        
        // 카카오 액세스 토큰 저장 (로그아웃용)
        localStorage.setItem('kakao_access_token', accessToken);

        setMessage('카카오 사용자 정보 가져오는 중...');
        console.log('🟡 Step 2: 사용자 정보 조회 시작...');

        // 3. 액세스 토큰으로 사용자 정보 조회
        const userInfo = await kakaoAuthService.getUserInfo(accessToken);
        console.log('✅ Step 2 완료: 사용자 정보:', userInfo);

        // 3-1. 이메일이 없으면 추가 정보 입력 페이지로 이동
        if (!userInfo.email) {
          console.log('⚠️ 이메일 없음 - 추가 정보 입력 페이지로 이동');
          setStatus('success');
          setMessage('카카오 로그인 성공! 추가 정보 입력 페이지로 이동합니다...');
          
          // 카카오 액세스 토큰과 사용자 정보를 세션에 임시 저장
          sessionStorage.setItem('temp_kakao_user', JSON.stringify(userInfo));
          sessionStorage.setItem('temp_kakao_token', accessToken);
          
          setTimeout(() => {
            navigate('/auth/additional-info', {
              state: { kakaoUserInfo: userInfo }
            });
          }, 1500);
          return;
        }

        setMessage('로그인 처리 중...');
        console.log('🟡 Step 3: 백엔드 로그인 요청...');

        // 4. 백엔드에 카카오 로그인 정보 전송
        const loginResponse = await kakaoAuthService.loginWithKakao(userInfo);
        console.log('✅ Step 3 완료: 백엔드 로그인 응답:', loginResponse);

        // 5. 백엔드에서 받은 JWT 토큰 저장
        if (loginResponse.accessToken) {
          localStorage.setItem('token', loginResponse.accessToken);
        }
        
        // 6. 사용자 정보 저장
        localStorage.setItem('user', JSON.stringify({
          memKey: loginResponse.memKey,
          memEmail: loginResponse.memEmail,
          memNick: loginResponse.memNick,
          provider: 'kakao',
        }));

        setStatus('success');
        setMessage('카카오 로그인 성공! 관리자 페이지로 이동합니다...');
        console.log('✅ 카카오 로그인 완료! 관리자 페이지로 이동...');

        // 7. 관리자 페이지로 이동
        setTimeout(() => {
          navigate('/admin');
        }, 1500);

      } catch (error: any) {
        console.error('❌ 카카오 로그인 처리 실패:', error);
        console.error('❌ 에러 상세:', error.response?.data || error.message);
        setStatus('error');
        setMessage(error.response?.data?.message || error.message || '카카오 로그인에 실패했습니다.');

        // 5초 후 로그인 페이지로 이동 (에러 확인 시간)
        setTimeout(() => {
          navigate('/login');
        }, 5000);
      }
    };

    handleKakaoCallback();
  }, [searchParams, navigate]);

  return (
    <div className="kakao-callback-container">
      <div className="kakao-callback-content">
        {status === 'loading' && (
          <>
            <div className="loading-spinner"></div>
            <h2>{message}</h2>
            <p>잠시만 기다려주세요...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="success-icon">✓</div>
            <h2>{message}</h2>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="error-icon">✕</div>
            <h2>로그인 실패</h2>
            <p style={{ color: '#d32f2f', fontWeight: 'bold', marginBottom: '1rem' }}>{message}</p>
            <p className="redirect-message">5초 후 로그인 페이지로 이동합니다...</p>
            <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '1rem' }}>
              브라우저 콘솔(F12)에서 상세 에러를 확인하세요.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default KakaoCallback;

