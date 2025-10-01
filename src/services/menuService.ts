import api from './api';
import type { Menu, MenuRequest, ApiResponse } from '@/types/api';

// 메뉴 관련 API 서비스
export const menuService = {
  // 메뉴 목록 조회
  getMenus: async (): Promise<Menu[]> => {
    try {
      const response = await api.get<ApiResponse<Menu[]>>('/menus');
      return response.data.data || [];
    } catch (error) {
      console.error('메뉴 목록 조회 실패:', error);
      throw error;
    }
  },

  // 활성 메뉴만 조회 (사용 여부가 'Y'인 메뉴)
  getActiveMenus: async (): Promise<Menu[]> => {
    try {
      const response = await api.get<ApiResponse<Menu[]>>('/menus/active');
      return response.data.data || [];
    } catch (error) {
      console.error('활성 메뉴 조회 실패:', error);
      throw error;
    }
  },

  // 트리 구조로 메뉴 조회
  getMenuTree: async (): Promise<Menu[]> => {
    try {
      const response = await api.get<ApiResponse<Menu[]>>('/menus/tree');
      return response.data.data || [];
    } catch (error) {
      console.error('메뉴 트리 조회 실패:', error);
      throw error;
    }
  },

  // 메뉴 상세 조회
  getMenu: async (menuId: string): Promise<Menu> => {
    try {
      const response = await api.get<ApiResponse<Menu>>(`/menus/${menuId}`);
      return response.data.data;
    } catch (error) {
      console.error('메뉴 상세 조회 실패:', error);
      throw error;
    }
  },

  // 메뉴 생성
  createMenu: async (menuData: MenuRequest): Promise<Menu> => {
    try {
      const response = await api.post<ApiResponse<Menu>>('/menus', menuData);
      return response.data.data;
    } catch (error) {
      console.error('메뉴 생성 실패:', error);
      throw error;
    }
  },

  // 메뉴 수정
  updateMenu: async (menuId: string, menuData: Partial<MenuRequest>): Promise<Menu> => {
    try {
      const response = await api.put<ApiResponse<Menu>>(`/menus/${menuId}`, menuData);
      return response.data.data;
    } catch (error) {
      console.error('메뉴 수정 실패:', error);
      throw error;
    }
  },

  // 메뉴 삭제 (논리적 삭제)
  deleteMenu: async (menuId: string): Promise<void> => {
    try {
      await api.delete(`/menus/${menuId}`);
    } catch (error) {
      console.error('메뉴 삭제 실패:', error);
      throw error;
    }
  },

  // 메뉴 영구 삭제
  permanentDeleteMenu: async (menuId: string): Promise<void> => {
    try {
      await api.delete(`/menus/${menuId}/permanent`);
    } catch (error) {
      console.error('메뉴 영구 삭제 실패:', error);
      throw error;
    }
  }
};

export default menuService;
