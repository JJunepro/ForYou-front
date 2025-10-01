import React, { useState, useEffect, useCallback } from 'react';
import type {
  CommonCodeMaster,
  CommonCodeDetail,
  CommonCodeMasterRequest,
  CommonCodeDetailRequest
} from '@/types/api';
import CommonCodeForm from './CommonCodeForm';
import { commonCodeService } from '@/services/commonCodeService';
import '@/styles/components/CommonCodeManagement.css';

interface CommonCodeManagementProps {
  type: 'master' | 'detail';
}

const CommonCodeManagement: React.FC<CommonCodeManagementProps> = ({ type }) => {
  const [items, setItems] = useState<(CommonCodeMaster | CommonCodeDetail)[]>([]);
  const [masterGroups, setMasterGroups] = useState<CommonCodeMaster[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<CommonCodeMaster | CommonCodeDetail | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrpCd, setSelectedGrpCd] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (type === 'master') {
        const data = await commonCodeService.getAllCodeMst();
        setItems(data);
        setMasterGroups(data);
      } else {
        if (selectedGrpCd) {
          const data = await commonCodeService.getCodeDtlByGrpCd(selectedGrpCd);
          setItems(data);
        } else {
          // 전체 조회는 각 그룹별로 조회해서 합치기
          const groups = await commonCodeService.getAllCodeMst();
          setMasterGroups(groups);
          const allDetails: CommonCodeDetail[] = [];
          for (const group of groups) {
            const details = await commonCodeService.getCodeDtlByGrpCd(group.grpCd);
            allDetails.push(...details);
          }
          setItems(allDetails);
        }
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      alert('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [type, selectedGrpCd]);

  // 마스터 그룹 목록 로드
  useEffect(() => {
    const loadMasterGroups = async () => {
      try {
        const groups = await commonCodeService.getAllCodeMst();
        setMasterGroups(groups);
      } catch (error) {
        console.error('마스터 그룹 로드 실패:', error);
      }
    };
    
    if (type === 'detail') {
      loadMasterGroups();
    }
  }, [type]);

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
        if (type === 'master') {
          const master = item as CommonCodeMaster;
          await commonCodeService.deleteCodeMst(master.grpCd);
          alert('코드 그룹이 삭제되었습니다.');
        } else {
          const detail = item as CommonCodeDetail;
          await commonCodeService.deleteCodeDtl(detail.cd);
          alert('상세 코드가 삭제되었습니다.');
        }
        loadData();
      } catch (error: any) {
        console.error('삭제 실패:', error);
        alert(error.response?.data?.message || '삭제에 실패했습니다.');
      }
    }
  };

  const handleFormSubmit = async (data: CommonCodeMasterRequest | CommonCodeDetailRequest) => {
    try {
      if (type === 'master') {
        const masterData = data as CommonCodeMasterRequest;
        if (editingItem) {
          await commonCodeService.updateCodeMst((editingItem as CommonCodeMaster).grpCd, masterData);
          alert('코드 그룹이 수정되었습니다.');
        } else {
          await commonCodeService.createCodeMst(masterData);
          alert('코드 그룹이 생성되었습니다.');
        }
      } else {
        const detailData = data as CommonCodeDetailRequest;
        if (editingItem) {
          await commonCodeService.updateCodeDtl((editingItem as CommonCodeDetail).cd, detailData);
          alert('상세 코드가 수정되었습니다.');
        } else {
          await commonCodeService.createCodeDtl(detailData);
          alert('상세 코드가 생성되었습니다.');
        }
      }
      setShowForm(false);
      setEditingItem(null);
      loadData();
    } catch (error: any) {
      console.error('저장 실패:', error);
      alert(error.response?.data?.message || '저장에 실패했습니다.');
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
              {masterGroups.map(group => (
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
