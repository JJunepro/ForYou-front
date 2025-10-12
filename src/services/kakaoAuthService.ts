import axios from 'axios';

/**
 * 카카오 OAuth2 설정
 */
const KAKAO_CONFIG = {
  // 카카오 개발자 콘솔에서 발급받은 REST API 키
  CLIENT_ID: import.meta.env.VITE_KAKAO_CLIENT_ID || 'YOUR_KAKAO_REST_API_KEY',
  
  // 인가 코드 받을 URI (백엔드 아님, 프론트엔드!)
  REDIRECT_URI: import.meta.env.VITE_KAKAO_REDIRECT_URI || 'http://localhost:5173/oauth2/callback/kakao',
  
  // 카카오 인증 서버 URL
  AUTH_URL: 'https://kauth.kakao.com/oauth/authorize',
  TOKEN_URL: 'https://kauth.kakao.com/oauth/token',
  USER_INFO_URL: 'https://kapi.kakao.com/v2/user/me',
  LOGOUT_URL: 'https://kapi.kakao.com/v1/user/logout',
};

/**
 * 카카오 로그인 서비스 (REST API 방식)
 */
export const kakaoAuthService = {
  /**
   * 1단계: 카카오 로그인 페이지로 이동
   * - CSRF 방지를 위한 state 값 생성
   */
  redirectToKakaoLogin: () => {
    // CSRF 방지용 랜덤 state 생성
    const state = Math.random().toString(36).substring(2, 15);
    
    // state 값을 localStorage에 저장 (나중에 검증용)
    localStorage.setItem('kakao_oauth_state', state);

    // 카카오 로그인 URL 생성
    const kakaoAuthUrl = `${KAKAO_CONFIG.AUTH_URL}?client_id=${KAKAO_CONFIG.CLIENT_ID}&redirect_uri=${KAKAO_CONFIG.REDIRECT_URI}&response_type=code&state=${state}`;

    // 카카오 로그인 페이지로 리다이렉트
    window.location.href = kakaoAuthUrl;
  },

  /**
   * 2단계: 인가 코드를 액세스 토큰으로 교환
   * - 카카오 인증 서버에 직접 요청
   * - Client Secret 없이 요청 (보안 메뉴가 없는 경우)
   */
  exchangeCodeForToken: async (code: string): Promise<string> => {
    try {
      const params: any = {
        grant_type: 'authorization_code',
        client_id: KAKAO_CONFIG.CLIENT_ID,
        redirect_uri: KAKAO_CONFIG.REDIRECT_URI,
        code: code,
      };

      // Client Secret이 있는 경우에만 추가 (선택사항)
      // const clientSecret = import.meta.env.VITE_KAKAO_CLIENT_SECRET;
      // if (clientSecret) {
      //   params.client_secret = clientSecret;
      // }

      const response = await axios.post(
        KAKAO_CONFIG.TOKEN_URL,
        new URLSearchParams(params),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      console.log('카카오 토큰 발급 성공:', response.data);
      return response.data.access_token;
    } catch (error: any) {
      console.error('카카오 토큰 교환 실패:', error.response?.data || error);
      throw new Error('카카오 토큰 발급에 실패했습니다.');
    }
  },

  /**
   * 3단계: 액세스 토큰으로 사용자 정보 가져오기
   */
  getUserInfo: async (accessToken: string): Promise<KakaoUserInfo> => {
    try {
      const response = await axios.get(KAKAO_CONFIG.USER_INFO_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const data = response.data;

      return {
        id: data.id.toString(),
        email: data.kakao_account?.email || null,
        nickname: data.kakao_account?.profile?.nickname || '카카오사용자',
        profileImage: data.kakao_account?.profile?.profile_image_url || null,
        thumbnailImage: data.kakao_account?.profile?.thumbnail_image_url || null,
      };
    } catch (error) {
      console.error('카카오 사용자 정보 조회 실패:', error);
      throw new Error('카카오 사용자 정보를 가져오는데 실패했습니다.');
    }
  },

  /**
   * 4단계: 백엔드에 카카오 로그인 정보 전송
   * - 백엔드에서 JWT 토큰 발급
   */
  loginWithKakao: async (kakaoUserInfo: KakaoUserInfo): Promise<LoginResponse> => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/kakao-login', {
        providerId: kakaoUserInfo.id,
        email: kakaoUserInfo.email,
        nickname: kakaoUserInfo.nickname,
        profileImage: kakaoUserInfo.profileImage,
      });

      return response.data.data;
    } catch (error) {
      console.error('백엔드 카카오 로그인 처리 실패:', error);
      throw error;
    }
  },

  /**
   * 로그아웃
   */
  logout: async (accessToken: string): Promise<void> => {
    try {
      await axios.post(
        KAKAO_CONFIG.LOGOUT_URL,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // 로컬 스토리지 정리
      localStorage.removeItem('kakao_access_token');
      localStorage.removeItem('kakao_oauth_state');
    } catch (error) {
      console.error('카카오 로그아웃 실패:', error);
      throw error;
    }
  },

  /**
   * State 값 검증 (CSRF 공격 방지)
   */
  validateState: (receivedState: string): boolean => {
    const savedState = localStorage.getItem('kakao_oauth_state');
    
    if (!savedState || savedState !== receivedState) {
      console.error('CSRF 공격 가능성: state 값이 일치하지 않습니다.');
      return false;
    }

    // 검증 후 state 삭제
    localStorage.removeItem('kakao_oauth_state');
    return true;
  },
};

/**
 * 카카오 사용자 정보 타입
 */
export interface KakaoUserInfo {
  id: string;
  email: string | null;
  nickname: string;
  profileImage: string | null;
  thumbnailImage: string | null;
}

/**
 * 로그인 응답 타입
 */
export interface LoginResponse {
  memKey: number;
  memEmail: string;
  memNick: string;
  accessToken?: string;
  refreshToken?: string;
}

export default kakaoAuthService;

