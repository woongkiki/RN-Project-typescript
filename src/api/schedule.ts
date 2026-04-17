import { BASE_URL2 } from './util';
import { useAuthStore } from '../store';
import { CustomerType } from '../types';

// ─── 타입 ──────────────────────────────────────────────────────────────────────

export interface Schedule {
  idx: number;
  officeIdx: number;
  accountIdx: number;
  customerIdx: number | null;
  customerType: CustomerType | null;
  customerName: string | null;
  title: string;
  content: string | null;
  scheduleDate: string;     // YYYY-MM-DD
  scheduleTime: string | null; // HH:MM
  addr1: string | null;
  addr2: string | null;
  isImportant: string | null;
  noti: boolean;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleParams {
  title: string;
  content?: string;
  scheduleDate: string;
  scheduleTime?: string;
  addr1?: string;
  addr2?: string;
  isImportant?: string;
  customerType?: CustomerType | null;
  customerIdx?: number | null;
}

export interface UpdateScheduleParams extends CreateScheduleParams {}

// ─── 공통 ──────────────────────────────────────────────────────────────────────

interface ApiResponse<T> {
  result?: boolean;
  success?: boolean;
  message: string | null;
  data: T | null;
}

const authHeaders = (): Record<string, string> => {
  const token = useAuthStore.getState().token ?? '';
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    'X-App-Token': token,
  };
};

async function parseJsonSafely<T>(res: Response): Promise<ApiResponse<T>> {
  const text = await res.text();
  try {
    return JSON.parse(text) as ApiResponse<T>;
  } catch {
    throw new Error(`서버 오류 (HTTP ${res.status})`);
  }
}

async function scheduleFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) throw new Error(`서버 오류 (HTTP ${res.status})`);
  const json = await parseJsonSafely<T>(res);
  const ok = json.success ?? json.result ?? false;
  if (!ok || json.data == null) throw new Error(json.message ?? '요청에 실패했습니다.');
  return json.data;
}

async function scheduleMutate<T>(
  url: string,
  method: 'POST' | 'PUT' | 'DELETE',
  body?: object,
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return undefined as T;
  const json = await parseJsonSafely<T>(res);
  const ok = json.success ?? json.result ?? false;
  if (!ok) throw new Error(json.message ?? '요청에 실패했습니다.');
  return json.data as T;
}

// ─── 매퍼 ──────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSchedule(raw: any): Schedule {
  return {
    idx: raw.idx,
    officeIdx: raw.office_idx ?? raw.officeIdx,
    accountIdx: raw.account_idx ?? raw.accountIdx,
    customerIdx: raw.customer_idx ?? raw.customerIdx ?? null,
    customerType: raw.customer_type ?? raw.customerType ?? null,
    customerName: raw.customer_name ?? raw.customerName ?? null,
    title: raw.title ?? '',
    content: raw.content ?? null,
    scheduleDate: raw.schedule_date ?? raw.scheduleDate ?? '',
    scheduleTime: raw.schedule_time ?? raw.scheduleTime ?? null,
    addr1: raw.addr1 ?? null,
    addr2: raw.addr2 ?? null,
    isImportant: raw.isImportant ?? raw.is_important ?? null,
    noti: raw.noti === 1 || raw.noti === true,
    status: raw.status ?? 1,
    createdAt: raw.created_at ?? raw.createdAt ?? '',
    updatedAt: raw.updated_at ?? raw.updatedAt ?? '',
  };
}

// ─── API 함수 ─────────────────────────────────────────────────────────────────

/** 스케줄 목록 (날짜 or 월별) */
export async function getSchedules(params: {
  date?: string;       // YYYY-MM-DD
  yearMonth?: string;  // YYYY-MM
  accountIdx?: number;
}): Promise<Schedule[]> {
  const query = new URLSearchParams();
  if (params.date) query.set('date', params.date);
  else if (params.yearMonth) query.set('yearMonth', params.yearMonth);
  if (params.accountIdx) query.set('accountIdx', String(params.accountIdx));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await scheduleFetch<any>(
    `${BASE_URL2}/api/app/schedules?${query}`,
  );
  const list = Array.isArray(data) ? data : data?.schedules ?? [];
  return list.map(mapSchedule);
}

/** 스케줄 상세 */
export async function getSchedule(idx: number): Promise<Schedule> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await scheduleFetch<any>(`${BASE_URL2}/api/app/schedules/${idx}`);
  const raw = data?.schedule ?? data;
  return mapSchedule(raw);
}

/** 스케줄 등록 */
export async function createSchedule(
  params: CreateScheduleParams,
): Promise<number> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await scheduleMutate<any>(
    `${BASE_URL2}/api/app/schedules`,
    'POST',
    {
      title: params.title,
      content: params.content ?? null,
      scheduleDate: params.scheduleDate,
      scheduleTime: params.scheduleTime ?? null,
      addr1: params.addr1 ?? '',
      addr2: params.addr2 ?? '',
      isImportant: params.isImportant ?? '',
      customerType: params.customerType ?? null,
      customerIdx: params.customerIdx ?? null,
    },
  );
  return data?.idx ?? 0;
}

/** 스케줄 수정 */
export async function updateSchedule(
  idx: number,
  params: UpdateScheduleParams,
): Promise<void> {
  await scheduleMutate<unknown>(
    `${BASE_URL2}/api/app/schedules/${idx}`,
    'PUT',
    {
      title: params.title,
      content: params.content ?? null,
      scheduleDate: params.scheduleDate,
      scheduleTime: params.scheduleTime ?? null,
      addr1: params.addr1 ?? '',
      addr2: params.addr2 ?? '',
      isImportant: params.isImportant ?? '',
      customerType: params.customerType ?? null,
      customerIdx: params.customerIdx ?? null,
    },
  );
}

/** 스케줄 삭제 */
export async function deleteSchedule(idx: number): Promise<void> {
  await scheduleMutate<unknown>(
    `${BASE_URL2}/api/app/schedules/${idx}`,
    'DELETE',
  );
}
