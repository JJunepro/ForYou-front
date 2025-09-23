import React, { useState } from 'react';
import CommonCodeManagement from '@/components/CommonCodeManagement';
import '@/styles/pages/admin/commoncode/CommonCodePage.css';

const CommonCodePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'master' | 'detail'>('master');

  return (
    <div className="common-code-page">
      <div className="page-header">
        <h1>공통코드 관리</h1>
        <p>코드 그룹과 상세 코드를 관리합니다</p>
      </div>

      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'master' ? 'active' : ''}`}
          onClick={() => setActiveTab('master')}
        >
          <span className="tab-icon">📋</span>
          <span className="tab-text">코드 그룹 관리</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'detail' ? 'active' : ''}`}
          onClick={() => setActiveTab('detail')}
        >
          <span className="tab-icon">📝</span>
          <span className="tab-text">코드 상세 관리</span>
        </button>
      </div>

      <div className="tab-content">
        <CommonCodeManagement type={activeTab} />
      </div>
    </div>
  );
};

export default CommonCodePage;
