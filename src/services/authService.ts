import { ApiService } from './api';
import { API_ENDPOINTS } from '../config/environment';

// 인증 관련 타입 정의
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export interface User {
  id: number;
  email: string;
  name: string;
}

// OAuth2 리다이렉트 파라미터 타입
export interface OAuth2RedirectParams {
  token: string;
  email: string;
  memKey?: string;
  name?: string;
}

// 인증 서비스 클래스
export class AuthService {
  // OAuth2 백엔드 URL (환경변수에서 가져오거나 기본값 사용)
  private static readonly OAUTH2_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8080';

  // 로그인
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await ApiService.post<AuthResponse>(API_ENDPOINTS.LOGIN, credentials);

    // 토큰을 localStorage에 저장
    if (response.token) {
      localStorage.setItem('token', response.token);
      // 사용자 정보도 저장 (선택사항)
      if (response.user) {
        localStorage.setItem('userEmail', response.user.email);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
    }

    return response;
  }

  // 회원가입
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await ApiService.post<AuthResponse>(API_ENDPOINTS.REGISTER, userData);

    // 토큰을 localStorage에 저장
    if (response.token) {
      localStorage.setItem('token', response.token);
      // 사용자 정보도 저장 (선택사항)
      if (response.user) {
        localStorage.setItem('userEmail', response.user.email);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
    }

    return response;
  }

  // Google 로그인 시작 (백엔드 OAuth2 엔드포인트로 리다이렉트)
  static initiateGoogleLogin(): void {
    window.location.href = `${this.OAUTH2_BASE_URL}/oauth2/authorization/google`;
  }

  // OAuth2 리다이렉트 처리 (OAuth2RedirectHandler에서 호출)
  static handleOAuth2Redirect(params: OAuth2RedirectParams): AuthResponse {
    const { token, email, memKey, name } = params;

    // 토큰 저장
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', email);

    // 사용자 객체 생성
    const user: User = {
      id: memKey ? parseInt(memKey) : 0,
      email: email,
      name: name || email.split('@')[0] // name이 없으면 이메일 앞부분 사용
    };

    // AdminPage와 호환되도록 user 객체도 저장
    const adminUser = {
      memEmail: email,
      memNick: user.name,
      memStatus: 'Y',
      provider: 'google'
    };
    localStorage.setItem('user', JSON.stringify(adminUser));

    return {
      token,
      user
    };
  }

  // 로그아웃
  static async logout(): Promise<void> {
    try {
      await ApiService.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // 모든 인증 관련 데이터 제거
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('user');
    }
  }

  // 현재 사용자 정보 가져오기
  static async getCurrentUser(): Promise<User> {
    return await ApiService.get<User>(API_ENDPOINTS.USER_PROFILE);
  }

  // 토큰 확인
  static isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // 토큰 가져오기
  static getToken(): string | null {
    return localStorage.getItem('token');
  }

  // 저장된 사용자 정보 가져오기 (localStorage에서)
  static getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      const userData = JSON.parse(userStr);
      // AdminUser 형식을 User 형식으로 변환
      return {
        id: userData.memKey || 0,
        email: userData.memEmail || '',
        name: userData.memNick || ''
      };
    } catch {
      return null;
    }
  }
}
