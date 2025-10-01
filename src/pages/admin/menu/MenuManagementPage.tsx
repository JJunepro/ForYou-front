import React, { useState, useEffect } from 'react';
import { menuService } from '@/services/menuService';
import type { Menu, MenuRequest } from '@/types/api';
import '@/styles/pages/admin/menu/MenuManagementPage.css';

const MenuManagementPage: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [formData, setFormData] = useState<MenuRequest>({
    menuId: '',
    menuNm: '',
    menuIcon: '',
    menuLink: '',
    menuSeq: 0,
    parentMenuId: '',
    useYn: 'Y'
  });

  // 메뉴 목록 로드
  const loadMenus = async () => {
    setLoading(true);
    try {
      const data = await menuService.getMenus();
      setMenus(data);
    } catch (error) {
      console.error('메뉴 로드 실패:', error);
      alert('메뉴 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenus();
  }, []);

  // 폼 입력 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'menuSeq' ? parseInt(value) || 0 : value
    }));
  };

  // 메뉴 생성/수정 모달 열기
  const openModal = (menu?: Menu) => {
    if (menu) {
      setEditingMenu(menu);
      setFormData({
        menuId: menu.menuId,
        menuNm: menu.menuNm,
        menuIcon: menu.menuIcon || '',
        menuLink: menu.menuLink || '',
        menuSeq: menu.menuSeq,
        parentMenuId: menu.parentMenuId || '',
        useYn: menu.useYn
      });
    } else {
      setEditingMenu(null);
      setFormData({
        menuId: '',
        menuNm: '',
        menuIcon: '',
        menuLink: '',
        menuSeq: menus.length + 1,
        parentMenuId: '',
        useYn: 'Y'
      });
    }
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMenu(null);
  };

  // 메뉴 저장 (생성/수정)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingMenu) {
        // 수정
        await menuService.updateMenu(editingMenu.menuId, formData);
        alert('메뉴가 수정되었습니다.');
      } else {
        // 생성
        await menuService.createMenu(formData);
        alert('메뉴가 생성되었습니다.');
      }
      closeModal();
      loadMenus();
    } catch (error: any) {
      console.error('메뉴 저장 실패:', error);
      alert(error.response?.data?.message || '메뉴 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 메뉴 삭제
  const handleDelete = async (menuId: string) => {
    if (!confirm('정말로 이 메뉴를 삭제하시겠습니까?')) return;

    setLoading(true);
    try {
      await menuService.deleteMenu(menuId);
      alert('메뉴가 삭제되었습니다.');
      loadMenus();
    } catch (error: any) {
      console.error('메뉴 삭제 실패:', error);
      alert(error.response?.data?.message || '메뉴 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 상위 메뉴 필터링 (자신과 하위 메뉴 제외)
  const getParentMenuOptions = () => {
    if (!editingMenu) return menus;
    return menus.filter(menu => menu.menuId !== editingMenu.menuId);
  };

  return (
    <div className="menu-management-page">
      <div className="page-header">
        <h2>메뉴 관리</h2>
        <button onClick={() => openModal()} className="btn-primary">
          + 새 메뉴 추가
        </button>
      </div>

      {loading && <div className="loading-spinner">로딩 중...</div>}

      <div className="menu-table-container">
        <table className="menu-table">
          <thead>
            <tr>
              <th>메뉴 ID</th>
              <th>메뉴명</th>
              <th>아이콘</th>
              <th>링크</th>
              <th>순서</th>
              <th>상위 메뉴</th>
              <th>사용 여부</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {menus.length === 0 ? (
              <tr>
                <td colSpan={8} className="no-data">메뉴가 없습니다.</td>
              </tr>
            ) : (
              menus
                .sort((a, b) => a.menuSeq - b.menuSeq)
                .map(menu => (
                  <tr key={menu.menuId}>
                    <td>{menu.menuId}</td>
                    <td>{menu.menuNm}</td>
                    <td className="menu-icon">{menu.menuIcon}</td>
                    <td>{menu.menuLink}</td>
                    <td>{menu.menuSeq}</td>
                    <td>{menu.parentMenuId || '-'}</td>
                    <td>
                      <span className={`status-badge ${menu.useYn === 'Y' ? 'active' : 'inactive'}`}>
                        {menu.useYn === 'Y' ? '사용' : '미사용'}
                      </span>
                    </td>
                    <td className="action-buttons">
                      <button onClick={() => openModal(menu)} className="btn-edit">
                        수정
                      </button>
                      <button onClick={() => handleDelete(menu.menuId)} className="btn-delete">
                        삭제
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* 메뉴 생성/수정 모달 */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingMenu ? '메뉴 수정' : '새 메뉴 추가'}</h3>
              <button onClick={closeModal} className="modal-close">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label htmlFor="menuId">메뉴 ID *</label>
                <input
                  type="text"
                  id="menuId"
                  name="menuId"
                  value={formData.menuId}
                  onChange={handleInputChange}
                  disabled={!!editingMenu}
                  required
                  placeholder="예: ADMIN_001"
                />
              </div>

              <div className="form-group">
                <label htmlFor="menuNm">메뉴명 *</label>
                <input
                  type="text"
                  id="menuNm"
                  name="menuNm"
                  value={formData.menuNm}
                  onChange={handleInputChange}
                  required
                  placeholder="예: 대시보드"
                />
              </div>

              <div className="form-group">
                <label htmlFor="menuIcon">아이콘</label>
                <input
                  type="text"
                  id="menuIcon"
                  name="menuIcon"
                  value={formData.menuIcon}
                  onChange={handleInputChange}
                  placeholder="예: 🏠"
                />
              </div>

              <div className="form-group">
                <label htmlFor="menuLink">링크</label>
                <input
                  type="text"
                  id="menuLink"
                  name="menuLink"
                  value={formData.menuLink}
                  onChange={handleInputChange}
                  placeholder="예: /admin"
                />
              </div>

              <div className="form-group">
                <label htmlFor="menuSeq">순서 *</label>
                <input
                  type="number"
                  id="menuSeq"
                  name="menuSeq"
                  value={formData.menuSeq}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="parentMenuId">상위 메뉴</label>
                <select
                  id="parentMenuId"
                  name="parentMenuId"
                  value={formData.parentMenuId}
                  onChange={handleInputChange}
                >
                  <option value="">없음 (최상위 메뉴)</option>
                  {getParentMenuOptions().map(menu => (
                    <option key={menu.menuId} value={menu.menuId}>
                      {menu.menuNm} ({menu.menuId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="useYn">사용 여부 *</label>
                <select
                  id="useYn"
                  name="useYn"
                  value={formData.useYn}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Y">사용</option>
                  <option value="N">미사용</option>
                </select>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={closeModal} className="btn-cancel">
                  취소
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? '저장 중...' : editingMenu ? '수정' : '생성'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagementPage;

