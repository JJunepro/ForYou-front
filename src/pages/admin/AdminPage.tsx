import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import AdminMain from './AdminMain';
import CommonCodePage from './commoncode/CommonCodePage';
import type { Menu } from '@/types/api';
import { menuService } from '@/services/menuService';
import '@/styles/pages/admin/AdminPage.css';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuItems, setMenuItems] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // 임시 메뉴 데이터 (실제로는 API에서 가져와야 함)
  const mockMenuData: Menu[] = [
    {
      menuId: 'ADMIN_001',
      menuNm: '대시보드',
      menuIcon: '🏠',
      menuLink: '/admin',
      menuSeq: 1,
      parentMenuId: '',
      useYn: 'Y',
      firDt: '2024-01-01T00:00:00',
      firId: 0,
      lstDt: '2024-01-01T00:00:00',
      lstId: 0
    },
    {
      menuId: 'ADMIN_002',
      menuNm: '공통코드',
      menuIcon: '📋',
      menuLink: '/admin/common-code',
      menuSeq: 2,
      parentMenuId: '',
      useYn: 'Y',
      firDt: '2024-01-01T00:00:00',
      firId: 0,
      lstDt: '2024-01-01T00:00:00',
      lstId: 0
    },
    {
      menuId: 'ADMIN_003',
      menuNm: '사용자 관리',
      menuIcon: '👥',
      menuLink: '/admin/users',
      menuSeq: 3,
      parentMenuId: '',
      useYn: 'Y',
      firDt: '2024-01-01T00:00:00',
      firId: 0,
      lstDt: '2024-01-01T00:00:00',
      lstId: 0
    },
    {
      menuId: 'ADMIN_004',
      menuNm: '시스템 설정',
      menuIcon: '⚙️',
      menuLink: '/admin/settings',
      menuSeq: 4,
      parentMenuId: '',
      useYn: 'Y',
      firDt: '2024-01-01T00:00:00',
      firId: 0,
      lstDt: '2024-01-01T00:00:00',
      lstId: 0
    },
    {
      menuId: 'ADMIN_005',
      menuNm: '메뉴 관리',
      menuIcon: '📁',
      menuLink: '/admin/menus',
      menuSeq: 5,
      parentMenuId: '',
      useYn: 'Y',
      firDt: '2024-01-01T00:00:00',
      firId: 0,
      lstDt: '2024-01-01T00:00:00',
      lstId: 0
    }
  ];

  // 메뉴 데이터 로드
  useEffect(() => {
    const loadMenus = async () => {
      setLoading(true);
      try {
        // 실제 API 호출 시도
        const menus = await menuService.getActiveMenus();
        if (menus && menus.length > 0) {
          setMenuItems(menus);
        } else {
          // API에서 데이터가 없거나 빈 배열인 경우 임시 데이터 사용
          setMenuItems(mockMenuData);
        }
      } catch (error) {
        console.error('메뉴 로드 실패:', error);
        // API 실패 시 임시 데이터 사용
        setMenuItems(mockMenuData);
      } finally {
        setLoading(false);
      }
    };

    loadMenus();
  }, []);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/admin':
        return '대시보드';
      case '/admin/common-code':
        return '공통코드 관리';
      case '/admin/users':
        return '사용자 관리';
      case '/admin/settings':
        return '시스템 설정';
      default:
        return '관리자 시스템';
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-content">
          <div className="header-left">
            <h1>관리자 페이지</h1>
            <span className="page-title">{getPageTitle()}</span>
          </div>
          <div className="header-actions">
            <span className="user-info">
              안녕하세요, {user.memNick || user.memEmail}님
            </span>
            <button onClick={handleLogout} className="logout-button">
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="admin-layout">
            <nav className="admin-sidebar">
              <div className="sidebar-content">
                {loading ? (
                  <div className="loading-spinner">메뉴 로딩 중...</div>
                ) : (
                  menuItems
                    .filter(item => item.useYn === 'Y' && !item.parentMenuId) // 상위 메뉴만 표시
                    .sort((a, b) => a.menuSeq - b.menuSeq) // 순서대로 정렬
                    .map((item) => (
                      <button
                        key={item.menuId}
                        className={`sidebar-button ${location.pathname === item.menuLink ? 'active' : ''}`}
                        onClick={() => navigate(item.menuLink || '/admin')}
                      >
                        <span className="sidebar-icon">{item.menuIcon}</span>
                        <span className="sidebar-label">{item.menuNm}</span>
                      </button>
                    ))
                )}
              </div>
            </nav>

        <main className="admin-main">
          <Routes>
            <Route path="/" element={<AdminMain />} />
            <Route path="/common-code" element={<CommonCodePage />} />
            <Route path="/users" element={<div className="coming-soon">사용자 관리 기능은 준비 중입니다</div>} />
            <Route path="/settings" element={<div className="coming-soon">시스템 설정 기능은 준비 중입니다</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
