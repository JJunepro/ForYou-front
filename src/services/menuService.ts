import api from './api';
import type { Menu, MenuRequest } from '@/types/api';

// 메뉴 관련 API 서비스
export const menuService = {
  // 메뉴 목록 조회
  getMenus: async (): Promise<Menu[]> => {
    try {
      const response = await api.get('/api/menus');
      return response.data;
    } catch (error) {
      console.error('메뉴 목록 조회 실패:', error);
      throw error;
    }
  },

  // 활성 메뉴만 조회 (사용 여부가 'Y'인 메뉴)
  getActiveMenus: async (): Promise<Menu[]> => {
    try {
      const response = await api.get('/api/menus/active');
      return response.data;
    } catch (error) {
      console.error('활성 메뉴 조회 실패:', error);
      throw error;
    }
  },

  // 상위 메뉴 조회 (parent_menu_id가 null인 메뉴)
  getParentMenus: async (): Promise<Menu[]> => {
    try {
      const response = await api.get('/api/menus/parent');
      return response.data;
    } catch (error) {
      console.error('상위 메뉴 조회 실패:', error);
      throw error;
    }
  },

  // 특정 메뉴의 하위 메뉴 조회
  getChildMenus: async (parentMenuId: string): Promise<Menu[]> => {
    try {
      const response = await api.get(`/api/menus/children/${parentMenuId}`);
      return response.data;
    } catch (error) {
      console.error('하위 메뉴 조회 실패:', error);
      throw error;
    }
  },

  // 메뉴 상세 조회
  getMenu: async (menuId: string): Promise<Menu> => {
    try {
      const response = await api.get(`/api/menus/${menuId}`);
      return response.data;
    } catch (error) {
      console.error('메뉴 상세 조회 실패:', error);
      throw error;
    }
  },

  // 메뉴 생성
  createMenu: async (menuData: MenuRequest): Promise<Menu> => {
    try {
      const response = await api.post('/api/menus', menuData);
      return response.data;
    } catch (error) {
      console.error('메뉴 생성 실패:', error);
      throw error;
    }
  },

  // 메뉴 수정
  updateMenu: async (menuId: string, menuData: MenuRequest): Promise<Menu> => {
    try {
      const response = await api.put(`/api/menus/${menuId}`, menuData);
      return response.data;
    } catch (error) {
      console.error('메뉴 수정 실패:', error);
      throw error;
    }
  },

  // 메뉴 삭제
  deleteMenu: async (menuId: string): Promise<void> => {
    try {
      await api.delete(`/api/menus/${menuId}`);
    } catch (error) {
      console.error('메뉴 삭제 실패:', error);
      throw error;
    }
  },

  // 메뉴 순서 변경
  updateMenuOrder: async (menuOrders: { menuId: string; menuSeq: number }[]): Promise<void> => {
    try {
      await api.put('/api/menus/order', { menuOrders });
    } catch (error) {
      console.error('메뉴 순서 변경 실패:', error);
      throw error;
    }
  },

  // 메뉴 사용 여부 변경
  toggleMenuStatus: async (menuId: string, useYn: 'Y' | 'N'): Promise<Menu> => {
    try {
      const response = await api.patch(`/api/menus/${menuId}/status`, { useYn });
      return response.data;
    } catch (error) {
      console.error('메뉴 상태 변경 실패:', error);
      throw error;
    }
  }
};

export default menuService;
