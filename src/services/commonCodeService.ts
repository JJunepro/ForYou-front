import api from './api';
import type { 
  CommonCodeMaster, 
  CommonCodeDetail, 
  CommonCodeMasterRequest, 
  CommonCodeDetailRequest,
  ApiResponse 
} from '@/types/api';

// 공통코드 관련 API 서비스
export const commonCodeService = {
  // ========== 코드 그룹 (Master) ==========
  
  // 모든 코드 그룹 조회
  getAllCodeMst: async (): Promise<CommonCodeMaster[]> => {
    try {
      const response = await api.get<CommonCodeMaster[]>('/code-mst');
      return response.data;
    } catch (error) {
      console.error('코드 그룹 목록 조회 실패:', error);
      throw error;
    }
  },

  // 코드 그룹 상세 조회
  getCodeMst: async (grpCd: string): Promise<CommonCodeMaster> => {
    try {
      const response = await api.get<CommonCodeMaster>(`/code-mst/${grpCd}`);
      return response.data;
    } catch (error) {
      console.error('코드 그룹 조회 실패:', error);
      throw error;
    }
  },

  // 코드 그룹 생성
  createCodeMst: async (data: CommonCodeMasterRequest): Promise<CommonCodeMaster> => {
    try {
      const response = await api.post<CommonCodeMaster>('/code-mst', data);
      return response.data;
    } catch (error) {
      console.error('코드 그룹 생성 실패:', error);
      throw error;
    }
  },

  // 코드 그룹 수정
  updateCodeMst: async (grpCd: string, data: CommonCodeMasterRequest): Promise<CommonCodeMaster> => {
    try {
      const response = await api.put<CommonCodeMaster>(`/code-mst/${grpCd}`, data);
      return response.data;
    } catch (error) {
      console.error('코드 그룹 수정 실패:', error);
      throw error;
    }
  },

  // 코드 그룹 삭제
  deleteCodeMst: async (grpCd: string): Promise<void> => {
    try {
      await api.delete(`/code-mst/${grpCd}`);
    } catch (error) {
      console.error('코드 그룹 삭제 실패:', error);
      throw error;
    }
  },

  // 카테고리별 코드 그룹 조회
  getCodeMstByCategory: async (grpCate: string): Promise<CommonCodeMaster[]> => {
    try {
      const response = await api.get<CommonCodeMaster[]>(`/code-mst/category/${grpCate}`);
      return response.data;
    } catch (error) {
      console.error('카테고리별 코드 그룹 조회 실패:', error);
      throw error;
    }
  },

  // 코드 그룹명으로 검색
  searchCodeMstByName: async (grpNm: string): Promise<CommonCodeMaster[]> => {
    try {
      const response = await api.get<CommonCodeMaster[]>('/code-mst/search', {
        params: { grpNm }
      });
      return response.data;
    } catch (error) {
      console.error('코드 그룹 검색 실패:', error);
      throw error;
    }
  },

  // ========== 코드 상세 (Detail) ==========
  
  // 그룹 코드로 상세 코드 목록 조회
  getCodeDtlByGrpCd: async (grpCd: string): Promise<CommonCodeDetail[]> => {
    try {
      const response = await api.get<CommonCodeDetail[]>(`/code-dtl/group/${grpCd}`);
      return response.data;
    } catch (error) {
      console.error('상세 코드 목록 조회 실패:', error);
      throw error;
    }
  },

  // 상세 코드 조회
  getCodeDtl: async (cd: string): Promise<CommonCodeDetail> => {
    try {
      const response = await api.get<CommonCodeDetail>(`/code-dtl/${cd}`);
      return response.data;
    } catch (error) {
      console.error('상세 코드 조회 실패:', error);
      throw error;
    }
  },

  // 상세 코드 생성
  createCodeDtl: async (data: CommonCodeDetailRequest): Promise<CommonCodeDetail> => {
    try {
      const response = await api.post<CommonCodeDetail>('/code-dtl', data);
      return response.data;
    } catch (error) {
      console.error('상세 코드 생성 실패:', error);
      throw error;
    }
  },

  // 상세 코드 수정
  updateCodeDtl: async (cd: string, data: CommonCodeDetailRequest): Promise<CommonCodeDetail> => {
    try {
      const response = await api.put<CommonCodeDetail>(`/code-dtl/${cd}`, data);
      return response.data;
    } catch (error) {
      console.error('상세 코드 수정 실패:', error);
      throw error;
    }
  },

  // 상세 코드 삭제
  deleteCodeDtl: async (cd: string): Promise<void> => {
    try {
      await api.delete(`/code-dtl/${cd}`);
    } catch (error) {
      console.error('상세 코드 삭제 실패:', error);
      throw error;
    }
  },

  // 상위 코드로 하위 코드 목록 조회
  getCodeDtlByParentCd: async (grpCd: string, parentCd: string): Promise<CommonCodeDetail[]> => {
    try {
      const response = await api.get<CommonCodeDetail[]>(`/code-dtl/group/${grpCd}/parent/${parentCd}`);
      return response.data;
    } catch (error) {
      console.error('하위 코드 목록 조회 실패:', error);
      throw error;
    }
  },

  // 코드명으로 검색
  searchCodeDtlByName: async (cdNm: string): Promise<CommonCodeDetail[]> => {
    try {
      const response = await api.get<CommonCodeDetail[]>('/code-dtl/search', {
        params: { cdNm }
      });
      return response.data;
    } catch (error) {
      console.error('상세 코드 검색 실패:', error);
      throw error;
    }
  },

  // 그룹 코드와 코드명으로 검색
  searchCodeDtlByGrpCdAndName: async (grpCd: string, cdNm: string): Promise<CommonCodeDetail[]> => {
    try {
      const response = await api.get<CommonCodeDetail[]>(`/code-dtl/search/group/${grpCd}`, {
        params: { cdNm }
      });
      return response.data;
    } catch (error) {
      console.error('상세 코드 검색 실패:', error);
      throw error;
    }
  }
};

export default commonCodeService;

