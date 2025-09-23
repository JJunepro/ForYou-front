import React, { useState, useEffect } from 'react';
import type {
  CommonCodeMaster,
  CommonCodeDetail,
  CommonCodeMasterRequest,
  CommonCodeDetailRequest
} from '@/types/api';
import '@/styles/components/CommonCodeForm.css';

interface CommonCodeFormProps {
  type: 'master' | 'detail';
  item?: CommonCodeMaster | CommonCodeDetail | null;
  onSubmit: (data: CommonCodeMasterRequest | CommonCodeDetailRequest) => void;
  onCancel: () => void;
}

const CommonCodeForm: React.FC<CommonCodeFormProps> = ({ type, item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (item) {
      // 편집 모드
      if (type === 'master') {
        const master = item as CommonCodeMaster;
        setFormData({
          grpCd: master.grpCd,
          grpNm: master.grpNm,
          grpCate: master.grpCate,
          grpParentCd: master.grpParentCd || '',
          grpDesc: master.grpDesc || '',
          dspSeq: master.dspSeq,
          useYn: master.useYn,
          attr1: master.attr1 || '',
          attr2: master.attr2 || '',
          attr3: master.attr3 || ''
        });
      } else {
        const detail = item as CommonCodeDetail;
        setFormData({
          grpCd: detail.grpCd,
          cd: detail.cd,
          parentCd: detail.parentCd || '',
          cdNm: detail.cdNm,
          cdDesc: detail.cdDesc || '',
          dspSeq: detail.dspSeq,
          useYn: detail.useYn,
          imgPath: detail.imgPath || '',
          attr1: detail.attr1 || '',
          attr2: detail.attr2 || '',
          attr3: detail.attr3 || ''
        });
      }
    } else {
      // 신규 등록 모드
      if (type === 'master') {
        setFormData({
          grpCd: '',
          grpNm: '',
          grpCate: '',
          grpParentCd: '',
          grpDesc: '',
          dspSeq: 0,
          useYn: 'Y',
          attr1: '',
          attr2: '',
          attr3: ''
        });
      } else {
        setFormData({
          grpCd: '',
          cd: '',
          parentCd: '',
          cdNm: '',
          cdDesc: '',
          dspSeq: 0,
          useYn: 'Y',
          imgPath: '',
          attr1: '',
          attr2: '',
          attr3: ''
        });
      }
    }
  }, [type, item]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
    
    // 에러 초기화
    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (type === 'master') {
      if (!formData.grpCd.trim()) newErrors.grpCd = '그룹코드는 필수입니다.';
      if (!formData.grpNm.trim()) newErrors.grpNm = '그룹명은 필수입니다.';
      if (!formData.grpCate.trim()) newErrors.grpCate = '카테고리는 필수입니다.';
      if (isNaN(formData.dspSeq) || formData.dspSeq < 0) newErrors.dspSeq = '표시순서는 0 이상의 숫자여야 합니다.';
    } else {
      if (!formData.grpCd.trim()) newErrors.grpCd = '그룹코드는 필수입니다.';
      if (!formData.cd.trim()) newErrors.cd = '코드는 필수입니다.';
      if (!formData.cdNm.trim()) newErrors.cdNm = '코드명은 필수입니다.';
      if (isNaN(formData.dspSeq) || formData.dspSeq < 0) newErrors.dspSeq = '표시순서는 0 이상의 숫자여야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const renderMasterFields = () => (
    <>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="grpCd">그룹코드 *</label>
          <input
            type="text"
            id="grpCd"
            name="grpCd"
            value={formData.grpCd || ''}
            onChange={handleInputChange}
            disabled={!!item} // 편집 시 그룹코드 수정 불가
            className={errors.grpCd ? 'error' : ''}
          />
          {errors.grpCd && <span className="error-message">{errors.grpCd}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="grpNm">그룹명 *</label>
          <input
            type="text"
            id="grpNm"
            name="grpNm"
            value={formData.grpNm || ''}
            onChange={handleInputChange}
            className={errors.grpNm ? 'error' : ''}
          />
          {errors.grpNm && <span className="error-message">{errors.grpNm}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="grpCate">카테고리 *</label>
          <input
            type="text"
            id="grpCate"
            name="grpCate"
            value={formData.grpCate || ''}
            onChange={handleInputChange}
            className={errors.grpCate ? 'error' : ''}
          />
          {errors.grpCate && <span className="error-message">{errors.grpCate}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="grpParentCd">상위그룹코드</label>
          <input
            type="text"
            id="grpParentCd"
            name="grpParentCd"
            value={formData.grpParentCd || ''}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="grpDesc">설명</label>
        <textarea
          id="grpDesc"
          name="grpDesc"
          value={formData.grpDesc || ''}
          onChange={handleInputChange}
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="dspSeq">표시순서 *</label>
          <input
            type="number"
            id="dspSeq"
            name="dspSeq"
            value={formData.dspSeq || 0}
            onChange={handleInputChange}
            min="0"
            className={errors.dspSeq ? 'error' : ''}
          />
          {errors.dspSeq && <span className="error-message">{errors.dspSeq}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="useYn">사용여부</label>
          <select
            id="useYn"
            name="useYn"
            value={formData.useYn || 'Y'}
            onChange={handleInputChange}
          >
            <option value="Y">사용</option>
            <option value="N">미사용</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="attr1">추가속성1</label>
          <input
            type="text"
            id="attr1"
            name="attr1"
            value={formData.attr1 || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="attr2">추가속성2</label>
          <input
            type="text"
            id="attr2"
            name="attr2"
            value={formData.attr2 || ''}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="attr3">추가속성3</label>
        <input
          type="text"
          id="attr3"
          name="attr3"
          value={formData.attr3 || ''}
          onChange={handleInputChange}
        />
      </div>
    </>
  );

  const renderDetailFields = () => (
    <>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="grpCd">그룹코드 *</label>
          <select
            id="grpCd"
            name="grpCd"
            value={formData.grpCd || ''}
            onChange={handleInputChange}
            className={errors.grpCd ? 'error' : ''}
          >
            <option value="">그룹코드를 선택하세요</option>
            <option value="USER_TYPE">USER_TYPE - 사용자 유형</option>
            <option value="STATUS">STATUS - 상태 코드</option>
          </select>
          {errors.grpCd && <span className="error-message">{errors.grpCd}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="cd">코드 *</label>
          <input
            type="text"
            id="cd"
            name="cd"
            value={formData.cd || ''}
            onChange={handleInputChange}
            disabled={!!item} // 편집 시 코드 수정 불가
            className={errors.cd ? 'error' : ''}
          />
          {errors.cd && <span className="error-message">{errors.cd}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="cdNm">코드명 *</label>
          <input
            type="text"
            id="cdNm"
            name="cdNm"
            value={formData.cdNm || ''}
            onChange={handleInputChange}
            className={errors.cdNm ? 'error' : ''}
          />
          {errors.cdNm && <span className="error-message">{errors.cdNm}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="parentCd">상위코드</label>
          <input
            type="text"
            id="parentCd"
            name="parentCd"
            value={formData.parentCd || ''}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="cdDesc">코드 설명</label>
        <textarea
          id="cdDesc"
          name="cdDesc"
          value={formData.cdDesc || ''}
          onChange={handleInputChange}
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="dspSeq">표시순서 *</label>
          <input
            type="number"
            id="dspSeq"
            name="dspSeq"
            value={formData.dspSeq || 0}
            onChange={handleInputChange}
            min="0"
            className={errors.dspSeq ? 'error' : ''}
          />
          {errors.dspSeq && <span className="error-message">{errors.dspSeq}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="useYn">사용여부</label>
          <select
            id="useYn"
            name="useYn"
            value={formData.useYn || 'Y'}
            onChange={handleInputChange}
          >
            <option value="Y">사용</option>
            <option value="N">미사용</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="imgPath">이미지 경로</label>
        <input
          type="text"
          id="imgPath"
          name="imgPath"
          value={formData.imgPath || ''}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="attr1">추가속성1</label>
          <input
            type="text"
            id="attr1"
            name="attr1"
            value={formData.attr1 || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="attr2">추가속성2</label>
          <input
            type="text"
            id="attr2"
            name="attr2"
            value={formData.attr2 || ''}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="attr3">추가속성3</label>
        <input
          type="text"
          id="attr3"
          name="attr3"
          value={formData.attr3 || ''}
          onChange={handleInputChange}
        />
      </div>
    </>
  );

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h3>{type === 'master' ? '코드 그룹' : '코드 상세'} {item ? '수정' : '등록'}</h3>
          <button onClick={onCancel} className="close-button">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="form-content">
          {type === 'master' ? renderMasterFields() : renderDetailFields()}

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-button">
              취소
            </button>
            <button type="submit" className="submit-button">
              {item ? '수정' : '등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommonCodeForm;
