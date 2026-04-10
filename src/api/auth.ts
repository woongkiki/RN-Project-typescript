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
