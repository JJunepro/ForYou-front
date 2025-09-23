import React from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/pages/admin/AdminMain.css';

const AdminMain: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const menuItems = [
    {
      id: 'common-code',
      title: '공통코드 관리',
      description: '코드 그룹과 상세 코드를 관리합니다',
      icon: '📋',
      path: '/admin/common-code'
    },
    {
      id: 'user-management',
      title: '사용자 관리',
      description: '시스템 사용자를 관리합니다',
      icon: '👥',
      path: '/admin/users'
    },
    {
      id: 'system-settings',
      title: '시스템 설정',
      description: '시스템 환경을 설정합니다',
      icon: '⚙️',
      path: '/admin/settings'
    }
  ];

  return (
    <div className="admin-main">
      <div className="main-header">
        <h1>관리자 대시보드</h1>
        <p>안녕하세요, {user.memNick || user.memEmail}님</p>
      </div>

      <div className="main-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>총 코드 그룹</h3>
              <p className="stat-number">12</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <h3>총 상세 코드</h3>
              <p className="stat-number">48</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <div className="stat-info">
              <h3>활성 사용자</h3>
              <p className="stat-number">156</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>시스템 상태</h3>
              <p className="stat-status">정상</p>
            </div>
          </div>
        </div>

        <div className="menu-section">
          <h2>관리 메뉴</h2>
          <div className="menu-grid">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="menu-card"
                onClick={() => navigate(item.path)}
              >
                <div className="menu-icon">{item.icon}</div>
                <div className="menu-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <div className="menu-arrow">→</div>
              </div>
            ))}
          </div>
        </div>

        <div className="recent-activity">
          <h2>최근 활동</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">➕</div>
              <div className="activity-content">
                <p>새로운 코드 그룹이 추가되었습니다</p>
                <span className="activity-time">2시간 전</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">✏️</div>
              <div className="activity-content">
                <p>USER_TYPE 코드가 수정되었습니다</p>
                <span className="activity-time">4시간 전</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">👤</div>
              <div className="activity-content">
                <p>새로운 사용자가 가입했습니다</p>
                <span className="activity-time">6시간 전</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMain;
