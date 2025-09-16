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

// 인증 서비스 클래스
export class AuthService {
  // 로그인
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await ApiService.post<AuthResponse>(API_ENDPOINTS.LOGIN, credentials);
    
    // 토큰을 localStorage에 저장
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response;
  }

  // 회원가입
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await ApiService.post<AuthResponse>(API_ENDPOINTS.REGISTER, userData);
    
    // 토큰을 localStorage에 저장
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response;
  }

  // 로그아웃
  static async logout(): Promise<void> {
    try {
      await ApiService.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // 토큰 제거
      localStorage.removeItem('token');
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
}
