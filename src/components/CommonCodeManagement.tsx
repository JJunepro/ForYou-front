import React, { useState, useEffect, useCallback } from 'react';
import type {
  CommonCodeMaster,
  CommonCodeDetail,
  CommonCodeMasterRequest,
  CommonCodeDetailRequest
} from '@/types/api';
import CommonCodeForm from './CommonCodeForm';
import '@/styles/components/CommonCodeManagement.css';

interface CommonCodeManagementProps {
  type: 'master' | 'detail';
}

const CommonCodeManagement: React.FC<CommonCodeManagementProps> = ({ type }) => {
  const [items, setItems] = useState<(CommonCodeMaster | CommonCodeDetail)[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<CommonCodeMaster | CommonCodeDetail | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrpCd, setSelectedGrpCd] = useState('');

  // 임시 데이터 (실제로는 API에서 가져와야 함)
  const mockMasterData: CommonCodeMaster[] = [
    {
      grpCd: 'USER_TYPE',
      grpNm: '사용자 유형',
      grpCate: 'SYSTEM',
      grpParentCd: '',
      grpDesc: '시스템 사용자 유형 분류',
      dspSeq: 1,
      useYn: 'Y',
      firDt: '2024-01-01T00:00:00',
      firId: 1,
      lstDt: '2024-01-01T00:00:00',
      lstId: 1
    },
    {
      grpCd: 'STATUS',
      grpNm: '상태 코드',
      grpCate: 'SYSTEM',
      grpParentCd: '',
      grpDesc: '일반적인 상태 코드',
      dspSeq: 2,
      useYn: 'Y',
      firDt: '2024-01-01T00:00:00',
      firId: 1,
      lstDt: '2024-01-01T00:00:00',
      lstId: 1
    }
  ];

  const mockDetailData: CommonCodeDetail[] = [
    {
      grpCd: 'USER_TYPE',
      cd: 'ADMIN',
      parentCd: '',
      cdNm: '관리자',
      cdDesc: '시스템 관리자',
      dspSeq: 1,
      useYn: 'Y',
      firDt: '2024-01-01T00:00:00',
      firId: 1,
      lstDt: '2024-01-01T00:00:00',
      lstId: 1
    },
    {
      grpCd: 'USER_TYPE',
      cd: 'USER',
      parentCd: '',
      cdNm: '일반 사용자',
      cdDesc: '일반 사용자',
      dspSeq: 2,
      useYn: 'Y',
      firDt: '2024-01-01T00:00:00',
      firId: 1,
      lstDt: '2024-01-01T00:00:00',
      lstId: 1
    },
    {
      grpCd: 'STATUS',
      cd: 'ACTIVE',
      parentCd: '',
      cdNm: '활성',
      cdDesc: '활성 상태',
      dspSeq: 1,
      useYn: 'Y',
      firDt: '2024-01-01T00:00:00',
      firId: 1,
      lstDt: '2024-01-01T00:00:00',
      lstId: 1
    },
    {
      grpCd: 'STATUS',
      cd: 'INACTIVE',
      parentCd: '',
      cdNm: '비활성',
      cdDesc: '비활성 상태',
      dspSeq: 2,
      useYn: 'Y',
      firDt: '2024-01-01T00:00:00',
      firId: 1,
      lstDt: '2024-01-01T00:00:00',
      lstId: 1
    }
  ];

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: 실제 API 호출
      setTimeout(() => {
        if (type === 'master') {
          setItems(mockMasterData);
        } else {
          let filteredData = mockDetailData;
          if (selectedGrpCd) {
            filteredData = mockDetailData.filter(item => item.grpCd === selectedGrpCd);
          }
          setItems(filteredData);
        }
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      setLoading(false);
    }
  }, [type, selectedGrpCd]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: CommonCodeMaster | CommonCodeDetail) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (item: CommonCodeMaster | CommonCodeDetail) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        // TODO: 실제 API 호출
        console.log('삭제:', item);
        loadData();
      } catch (error) {
        console.error('삭제 실패:', error);
      }
    }
  };

  const handleFormSubmit = async (data: CommonCodeMasterRequest | CommonCodeDetailRequest) => {
    try {
      // TODO: 실제 API 호출
      console.log('저장:', data);
      setShowForm(false);
      setEditingItem(null);
      loadData();
    } catch (error) {
      console.error('저장 실패:', error);
    }
  };

  const filteredItems = items.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    if (type === 'master') {
      const master = item as CommonCodeMaster;
      return (
        (master.grpCd || '').toLowerCase().includes(searchLower) ||
        (master.grpNm || '').toLowerCase().includes(searchLower) ||
        (master.grpCate || '').toLowerCase().includes(searchLower)
      );
    } else {
      const detail = item as CommonCodeDetail;
      return (
        (detail.cd || '').toLowerCase().includes(searchLower) ||
        (detail.cdNm || '').toLowerCase().includes(searchLower) ||
        (detail.grpCd || '').toLowerCase().includes(searchLower)
      );
    }
  });

  const getTableHeaders = () => {
    if (type === 'master') {
      return ['그룹코드', '그룹명', '카테고리', '상위그룹', '표시순서', '사용여부', '등록일', '작업'];
    } else {
      return ['그룹코드', '코드', '코드명', '상위코드', '표시순서', '사용여부', '등록일', '작업'];
    }
  };

  const renderTableRow = (item: CommonCodeMaster | CommonCodeDetail) => {
    if (type === 'master') {
      const master = item as CommonCodeMaster;
      return (
        <tr key={master.grpCd}>
          <td>{master.grpCd}</td>
          <td>{master.grpNm}</td>
          <td>{master.grpCate}</td>
          <td>{master.grpParentCd || '-'}</td>
          <td>{master.dspSeq}</td>
          <td>
            <span className={`status-badge ${master.useYn === 'Y' ? 'active' : 'inactive'}`}>
              {master.useYn === 'Y' ? '사용' : '미사용'}
            </span>
          </td>
          <td>{new Date(master.firDt).toLocaleDateString()}</td>
          <td>
            <button onClick={() => handleEdit(item)} className="edit-button">수정</button>
            <button onClick={() => handleDelete(item)} className="delete-button">삭제</button>
          </td>
        </tr>
      );
    } else {
      const detail = item as CommonCodeDetail;
      return (
        <tr key={`${detail.grpCd}-${detail.cd}`}>
          <td>{detail.grpCd}</td>
          <td>{detail.cd}</td>
          <td>{detail.cdNm}</td>
          <td>{detail.parentCd || '-'}</td>
          <td>{detail.dspSeq}</td>
          <td>
            <span className={`status-badge ${detail.useYn === 'Y' ? 'active' : 'inactive'}`}>
              {detail.useYn === 'Y' ? '사용' : '미사용'}
            </span>
          </td>
          <td>{new Date(detail.firDt).toLocaleDateString()}</td>
          <td>
            <button onClick={() => handleEdit(item)} className="edit-button">수정</button>
            <button onClick={() => handleDelete(item)} className="delete-button">삭제</button>
          </td>
        </tr>
      );
    }
  };

  return (
    <div className="common-code-management">
      <div className="management-header">
        <h2>{type === 'master' ? '코드 그룹 관리' : '코드 상세 관리'}</h2>
        <div className="header-actions">
          {type === 'detail' && (
            <select 
              value={selectedGrpCd} 
              onChange={(e) => setSelectedGrpCd(e.target.value)}
              className="group-select"
            >
              <option value="">전체 그룹</option>
              {mockMasterData.map(group => (
                <option key={group.grpCd} value={group.grpCd}>
                  {group.grpCd} - {group.grpNm}
                </option>
              ))}
            </select>
          )}
          <button onClick={handleCreate} className="create-button">
            {type === 'master' ? '그룹 추가' : '코드 추가'}
          </button>
        </div>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder={type === 'master' ? '그룹코드, 그룹명으로 검색...' : '코드, 코드명으로 검색...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading">로딩 중...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                {getTableHeaders().map(header => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => renderTableRow(item))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <CommonCodeForm
          type={type}
          item={editingItem}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};

export default CommonCodeManagement;
