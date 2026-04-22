import { User, Office } from '../types';
import { BASE_URL2 } from './util';

export interface LoginResponse {
  user: User;
  token: string;
  firstlogin: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T | null;
}

// ─── 테스트용 더미 데이터 ────────────────────────────────────────────
const MOCK_OFFICE: Office = {
  idx: 1,
  name: '인사이트 지점A',
  ceoName: '김대표',
  businessNumber: '123-45-67890',
  phone: '02-1234-5678',
  email: 'office@test.com',
  address: '서울시 강남구 테헤란로 123',
  planIdx: 3, // 3 = C플랜 (tbl_plans insert 순서 기준)
  planCode: 'C',
  status: 1,
  rdsHost: 'localhost',
  rdsPort: 3306,
  createdAt: '2026-01-01 00:00:00',
  updatedAt: '2026-04-01 00:00:00',
};

const MOCK_ACCOUNTS: Record<
  string,
  { password: string; user: User; firstlogin: boolean }
> = {
  test: {
    password: 'test',
    firstlogin: false,
    user: {
      idx: 1,
      loginId: 'test',
      name: '홍길동',
      phone: '010-1111-1111',
      email: 'test@test.com',
      role: 'FP',
      deptIdx: null,
      orgIdx: null,
      lastLoginAt: '2026-04-08 10:00:00',
      createdAt: '2026-01-01 00:00:00',
      updatedAt: '2026-04-08 00:00:00',
      office: MOCK_OFFICE,
    },
  },
  test2: {
    password: 'test2',
    firstlogin: true, // 최초 로그인 화면 테스트용
    user: {
      idx: 2,
      loginId: 'test2',
      name: '이설계',
      phone: '010-2222-2222',
      email: 'test2@test.com',
      role: 'BM',
      deptIdx: 1,
      orgIdx: 1,
      lastLoginAt: null,
      createdAt: '2026-01-01 00:00:00',
      updatedAt: '2026-04-08 00:00:00',
      office: MOCK_OFFICE,
    },
  },
};

const mockLogin = (id: string, password: string): LoginResponse => {
  const account = MOCK_ACCOUNTS[id];
  if (!account || account.password !== password) {
    throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
  }
  return {
    user: account.user,
    token: `mock-token-${id}`,
    firstlogin: account.firstlogin,
  };
};
// ────────────────────────────────────────────────────────────────────

export interface OfficeItem {
  idx: number;
  name: string;
  phone?: string;
}

interface OfficesApiResponse {
  success: boolean;
  message: string | null;
  data: { offices: OfficeItem[] } | null;
}

export interface RegisterParams {
  name: string;
  login_id: string;
  password: string;
  office_idx: number;
  role: string;
  phone?: string;
  email?: string;
  agreed_term_idxs?: number[];
}

export const registerApi = async (params: RegisterParams): Promise<void> => {
  const url = `${BASE_URL2}/api/app/auth/register`;
  console.log('[registerApi] request URL:', url, JSON.stringify(params));

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  console.log('[registerApi] HTTP status:', response.status);

  const json: ApiResponse<unknown> = await response.json();
  console.log('[registerApi] response body:', JSON.stringify(json));

  if (!json.success) {
    throw new Error(json.message ?? '회원가입에 실패했습니다.');
  }
};

export const getJoinStatusApi = async (): Promise<boolean> => {
  const url = `${BASE_URL2}/api/app/join-status`;
  console.log('[getJoinStatusApi] request URL:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  console.log('[getJoinStatusApi] HTTP status:', response.status);

  const json: ApiResponse<{ join_enabled: boolean }> = await response.json();
  console.log('[getJoinStatusApi] response body:', JSON.stringify(json));

  if (!json.success || !json.data) {
    throw new Error(json.message ?? '회원가입 상태를 확인하지 못했습니다.');
  }

  return json.data.join_enabled;
};

export interface TermsItem {
  idx: number;
  type: string;
  title: string;
  version: string;
  content: string;
  created_at: string;
}

interface TermsApiResponse {
  success: boolean;
  message: string | null;
  data: { terms: TermsItem[] } | null;
}

export const getTermsApi = async (): Promise<TermsItem[]> => {
  const url = `${BASE_URL2}/api/app/terms`;
  console.log('[getTermsApi] request URL:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  console.log('[getTermsApi] HTTP status:', response.status);

  const json: TermsApiResponse = await response.json();
  console.log('[getTermsApi] response body:', JSON.stringify(json));

  if (!json.success || !json.data) {
    throw new Error(json.message ?? '약관 정보를 불러오지 못했습니다.');
  }

  return json.data.terms;
};

export const getOfficesApi = async (): Promise<OfficeItem[]> => {
  const url = `${BASE_URL2}/api/app/offices`;
  console.log('[getOfficesApi] request URL:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  console.log('[getOfficesApi] HTTP status:', response.status);

  const json: OfficesApiResponse = await response.json();
  console.log('[getOfficesApi] response body:', JSON.stringify(json));

  if (!json.success || !json.data) {
    throw new Error(json.message ?? '영업점 정보를 불러오지 못했습니다.');
  }

  return json.data.offices;
};

export interface UpdateMyInfoParams {
  password?: string;
  phone?: string;
  email?: string;
}

export const updateMyInfoApi = async (
  params: UpdateMyInfoParams,
  token: string,
): Promise<void> => {
  const response = await fetch(`${BASE_URL2}/api/app/auth/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      password: params.password || undefined,
      phone: params.phone || undefined,
      email: params.email || undefined,
    }),
  });

  const json: ApiResponse<unknown> = await response.json();

  if (!json.success) {
    throw new Error(json.message ?? '내 정보 수정에 실패했습니다.');
  }
};

export interface MeResponse {
  user: User; // office는 user.office 안에 중첩
}

export const getMeApi = async (token: string): Promise<MeResponse> => {
  const response = await fetch(`${BASE_URL2}/api/app/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'X-App-Token': token,
    },
  });

  const json: ApiResponse<MeResponse> = await response.json();

  if (!json.success || !json.data) {
    throw new Error(json.message ?? '계정 정보를 불러오지 못했습니다.');
  }

  return json.data;
};

export const loginApi = async (
  id: string,
  password: string,
): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL2}/api/app/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login_id: id, password }),
  });

  const json: ApiResponse<LoginResponse> = await response.json();

  console.log('loginApi result', json);

  if (!json.success || !json.data) {
    throw new Error(json.message ?? '로그인에 실패했습니다.');
  }

  return json.data;
};
