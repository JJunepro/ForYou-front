// API 관련 공통 타입 정의

// API 응답 기본 구조
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// 페이지네이션 응답
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// 에러 응답
export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
  path: string;
}

// HTTP 메서드 타입
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API 요청 옵션
export interface ApiRequestOptions {
  method: HttpMethod;
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

// 공통코드 마스터 타입 (tb_code_mst)
export interface CommonCodeMaster {
  grpCd: string;           // 그룹 코드
  grpNm: string;           // 그룹 이름
  grpCate: string;         // 그룹 카테고리
  grpParentCd?: string;    // 상위 그룹 코드
  grpDesc?: string;        // 설명
  dspSeq: number;          // 표시 순서
  useYn: 'Y' | 'N';        // 사용 여부
  attr1?: string;          // 추가 속성1
  attr2?: string;          // 추가 속성2
  attr3?: string;          // 추가 속성3
  firDt: string;           // 최초 등록일시
  firId: number;           // 최초 등록자 ID
  lstDt: string;           // 최종 수정일시
  lstId: number;           // 최종 수정자 ID
}

// 공통코드 상세 타입 (tb_code_dtl)
export interface CommonCodeDetail {
  grpCd: string;           // 그룹 코드
  cd: string;              // 상세 코드
  parentCd?: string;       // 상위 코드
  cdNm: string;            // 코드 이름
  cdDesc?: string;         // 코드 설명
  dspSeq: number;          // 표시 순서
  useYn: 'Y' | 'N';        // 사용 여부
  imgPath?: string;        // 이미지 경로
  attr1?: string;          // 추가 속성1
  attr2?: string;          // 추가 속성2
  attr3?: string;          // 추가 속성3
  firDt: string;           // 최초 등록일시
  firId: number;           // 최초 등록자 ID
  lstDt: string;           // 최종 수정일시
  lstId: number;           // 최종 수정자 ID
}

// 공통코드 생성/수정 요청 타입
export interface CommonCodeMasterRequest {
  grpCd: string;
  grpNm: string;
  grpCate: string;
  grpParentCd?: string;
  grpDesc?: string;
  dspSeq: number;
  useYn: 'Y' | 'N';
  attr1?: string;
  attr2?: string;
  attr3?: string;
}

export interface CommonCodeDetailRequest {
  grpCd: string;
  cd: string;
  parentCd?: string;
  cdNm: string;
  cdDesc?: string;
  dspSeq: number;
  useYn: 'Y' | 'N';
  imgPath?: string;
  attr1?: string;
  attr2?: string;
  attr3?: string;
}

// 사용자 관련 타입 (tb_mem_mst)
export interface User {
  memKey: number;          // 회원 키 (Primary Key)
  memEmail: string;        // 이메일 (계정)
  memNick: string;         // 닉네임
  memPwd: string;          // 비밀번호
  memStatus: 'Y' | 'N';    // 회원 상태
  regDt: string;           // 등록일시
  updDt: string;           // 수정일시
}

// 메뉴 관련 타입 (tb_menu_mst)
export interface Menu {
  menuId: string;          // 메뉴 ID (Primary Key)
  menuNm: string;          // 메뉴명
  menuIcon?: string;       // 메뉴 아이콘
  menuLink?: string;       // 메뉴 링크
  menuSeq: number;         // 메뉴 순서
  parentMenuId?: string;   // 상위 메뉴 ID
  useYn: 'Y' | 'N';        // 사용 여부
  firDt: string;           // 최초 등록일시
  firId: number;           // 최초 등록자 ID
  lstDt: string;           // 최종 수정일시
  lstId: number;           // 최종 수정자 ID
}

export interface MenuRequest {
  menuId: string;
  menuNm: string;
  menuIcon?: string;
  menuLink?: string;
  menuSeq: number;
  parentMenuId?: string;
  useYn: 'Y' | 'N';
}

// 로그인 관련 타입 정의
export interface LoginRequest {
  memEmail: string;        // 이메일 (계정) - 로그인 시 사용자 식별자
  memPwd: string;          // 비밀번호 - 사용자 인증용
}

// 로그인 성공 응답 타입 (향후 JWT 토큰 방식 구현 시 사용)
export interface LoginResponse {
  accessToken: string;     // 액세스 토큰 - API 호출 시 인증용
  refreshToken: string;    // 리프레시 토큰 - 액세스 토큰 갱신용
  user: {                  // 로그인한 사용자 정보
    memKey: number;        // 회원 고유 키
    memEmail: string;      // 회원 이메일
    memNick: string;       // 회원 닉네임
    memStatus: 'Y' | 'N';  // 회원 상태 (Y: 활성, N: 비활성)
  };
}

// 회원가입 요청 타입 정의
export interface SignupRequest {
  memEmail: string;        // 이메일 - 계정으로 사용될 이메일 주소
  memNick: string;         // 닉네임 - 사용자 표시명
  memPwd: string;          // 비밀번호 - 암호화되어 저장됨
}
