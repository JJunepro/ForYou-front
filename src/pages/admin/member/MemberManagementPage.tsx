import React, { useState, useEffect } from 'react';
import { memberService } from '@/services/memberService';
import type { MemberResponse } from '@/types/api';
import '@/styles/pages/admin/member/MemberManagementPage.css';

const MemberManagementPage: React.FC = () => {
  const [members, setMembers] = useState<MemberResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 회원 목록 로드
  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await memberService.getMembers();
      setMembers(data);
    } catch (error) {
      console.error('회원 로드 실패:', error);
      alert('회원 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  // 검색 필터링
  const filteredMembers = members.filter(member =>
    member.memEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.memNick.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="member-management-page">
      <div className="page-header">
        <h2>회원 관리</h2>
        <div className="header-info">
          <span className="total-count">전체 회원: {members.length}명</span>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="이메일 또는 닉네임으로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button onClick={loadMembers} className="btn-refresh">
          새로고침
        </button>
      </div>

      {loading && <div className="loading-spinner">로딩 중...</div>}

      <div className="member-table-container">
        <table className="member-table">
          <thead>
            <tr>
              <th>회원 번호</th>
              <th>이메일</th>
              <th>닉네임</th>
              <th>상태</th>
              <th>가입일</th>
              <th>최종 수정일</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={6} className="no-data">
                  {searchTerm ? '검색 결과가 없습니다.' : '회원이 없습니다.'}
                </td>
              </tr>
            ) : (
              filteredMembers.map(member => (
                <tr key={member.memKey}>
                  <td>{member.memKey}</td>
                  <td className="email-cell">{member.memEmail}</td>
                  <td>{member.memNick}</td>
                  <td>
                    <span className={`status-badge ${member.memStatus === 'Y' ? 'active' : 'inactive'}`}>
                      {member.memStatus === 'Y' ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td>{formatDate(member.regDt)}</td>
                  <td>{formatDate(member.updDt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="page-footer">
        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">활성 회원:</span>
            <span className="stat-value">
              {members.filter(m => m.memStatus === 'Y').length}명
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">검색 결과:</span>
            <span className="stat-value">{filteredMembers.length}명</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberManagementPage;