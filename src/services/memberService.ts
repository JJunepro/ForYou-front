import api from './api';
import type { MemberResponse, ApiResponse } from '@/types/api';

// 회원 관련 API 서비스
export const memberService = {
  // 전체 회원 목록 조회 (활성 회원만)
  getMembers: async (): Promise<MemberResponse[]> => {
    try {
      const response = await api.get<MemberResponse[]>('/auth/members');
      return response.data || [];
    } catch (error) {
      console.error('회원 목록 조회 실패:', error);
      throw error;
    }
  }
};

export default memberService;