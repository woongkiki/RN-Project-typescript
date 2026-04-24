import {
  Customer,
  CustomerType,
  ConsultLog,
  ConsultStatus,
  DbStats,
  ProgressCounts,
  StatusHistoryItem,
  AudioTtsItem,
} from '../types';
import { BASE_URL2 } from './util';
import { useAuthStore } from '../store';

// ─── 공통 ─────────────────────────────────────────────────────────────────────

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
    console.error('[API] Non-JSON response:', text.slice(0, 200));
    throw new Error(`서버 오류 (HTTP ${res.status})`);
  }
}

async function customerFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) {
    throw new Error(`서버 오류 (HTTP ${res.status}): ${url}`);
  }
  const json = await parseJsonSafely<T>(res);
  const ok = json.success ?? json.result ?? false;
  if (!ok || json.data == null) {
    throw new Error(json.message ?? '요청에 실패했습니다.');
  }
  return json.data;
}

async function customerPatch<T>(url: string, body: object): Promise<T> {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (res.status === 204) {
    return undefined as T;
  }
  const json = await parseJsonSafely<T>(res);
  const ok = json.success ?? json.result ?? false;
  if (!ok) {
    throw new Error(json.message ?? '요청에 실패했습니다.');
  }
  return json.data as T;
}

async function customerPost<T>(url: string, body: object): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  const json = await parseJsonSafely<T>(res);
  const ok = json.success ?? json.result ?? false;
  if (!ok) {
    throw new Error(json.message ?? '요청에 실패했습니다.');
  }
  return json.data as T;
}

// ─── 매퍼 ─────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCustomer(raw: any): Customer {
  console.log('[mapCustomer] raw keys:', Object.keys(raw), '| created_at:', raw.created_at, '| createdAt:', raw.createdAt, '| distribute_at:', raw.distribute_at);
  return {
    idx: raw.idx,
    customerType: raw.customer_type ?? raw.customerType,
    name: raw.name,
    phone: raw.phone ?? null,
    email: raw.email ?? null,
    address: raw.address ?? raw.address_enc ?? null,
    memo: raw.memo ?? null,
    gender: raw.gender ?? null,
    birthDate: raw.birth_date ?? raw.birthDate ?? null,
    age: raw.age != null ? Number(raw.age) : null,
    job: raw.job ?? null,
    familyConsult: raw.family_consult === 1 || raw.familyConsult === true,
    productCategoryIdx:
      raw.product_category_idx ?? raw.productCategoryIdx ?? null,
    productCategoryName:
      raw.product_category_name ?? raw.productCategoryName ?? null,
    dbGradeIdx: raw.db_grade_idx ?? null,
    dbGradeName: raw.db_grade_name ?? raw.dbGradeName ?? null,
    consultStatus: raw.consult_status ?? raw.consultStatus,
    isOpen: raw.is_open === 1 || raw.isOpen === true,
    recordingUrl: raw.recordingUrl ?? null,
    recordingName: raw.recordingName ?? null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tts: Array.isArray(raw.tts) ? raw.tts.map((r: any) => ({
      id: r.id,
      audioFile: r.audioFile,
      sequenceNo: r.sequenceNo,
      transcript: r.transcript,
      startTime: r.startTime,
      endTime: r.endTime,
      confidence: r.confidence ?? null,
      createdAt: r.createdAt ?? '',
    })) : [],
    assignedAccountIdx:
      raw.assigned_account_idx ?? raw.assignedAccountIdx ?? null,
    assignedAccountName:
      raw.assigned_account_name ?? raw.assignedAccountName ?? null,
    distributeAt: raw.distribute_at ?? raw.distributeAt ?? null,
    createdAt: raw.created_at ?? raw.createdAt ?? '',
    updatedAt: raw.updated_at ?? raw.updatedAt ?? '',
    latestSchedule: raw.latestSchedule
      ? {
          idx: raw.latestSchedule.idx,
          title: raw.latestSchedule.title,
          content: raw.latestSchedule.content ?? null,
          scheduleDate: raw.latestSchedule.scheduleDate,
          scheduleTime: raw.latestSchedule.scheduleTime ?? null,
          addr1: raw.latestSchedule.addr1 ?? null,
          addr2: raw.latestSchedule.addr2 ?? null,
          isImportant: raw.latestSchedule.isImportant ?? null,
          createdAt: raw.latestSchedule.createdAt,
        }
      : null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapConsultLog(raw: any): ConsultLog {
  return {
    idx: raw.idx,
    officeIdx: raw.office_idx,
    customerType: raw.customer_type,
    customerIdx: raw.customer_idx,
    accountIdx: raw.account_idx,
    accountName: raw.account_name,
    content: raw.content,
    nextConsultDate: raw.next_consult_date ?? null,
    memo: raw.memo ?? null,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapConsultStatus(raw: any): ConsultStatus {
  return {
    idx: raw.idx,
    officeIdx: raw.office_idx,
    name: raw.name,
    color: raw.color,
    isSystem: raw.is_system ?? false,
    sortOrder: raw.sort_order ?? 0,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbStats(raw: any, year: number, month: number): DbStats {
  return {
    year,
    month,
    totalCount: raw.total_count ?? raw.totalCount ?? 0,
    usedCount: raw.used_count ?? raw.usedCount ?? 0,
    meetingCount: raw.meeting_count ?? raw.meetingCount ?? 0,
    contractCount: raw.contract_count ?? raw.contractCount ?? 0,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProgressCounts(raw: any): ProgressCounts {
  return {
    total: raw.total ?? 0,
    meeting: raw.meeting ?? 0,
    call: raw.call ?? 0,
    absent: raw.absent ?? 0,
  };
}

// ─── API 함수 ─────────────────────────────────────────────────────────────────

/** 월별 DB 통계 (HomeScreen 도넛 차트) */
export async function getDbStats(
  year: number,
  month: number,
  assignedAccountIdx?: number,
): Promise<DbStats> {
  const query = new URLSearchParams();
  query.set('year', String(year));
  query.set('month', String(month));
  if (assignedAccountIdx) query.set('assignedAccountIdx', String(assignedAccountIdx));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await customerFetch<any>(
    `${BASE_URL2}/api/app/customers/stats?${query}`,
  );
  console.log('[getDbStats] data:', JSON.stringify(data));
  return mapDbStats(data, year, month);
}

/** 상담 상태 목록 조회 */
export async function getConsultStatuses(): Promise<ConsultStatus[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await customerFetch<any>(
    `${BASE_URL2}/api/app/customers/statuses`,
  );
  const list = Array.isArray(data) ? data : data?.statuses ?? [];
  return list.map(mapConsultStatus);
}

/** 오늘 진행 현황 */
export async function getProgressCounts(assignedAccountIdx?: number): Promise<ProgressCounts> {
  const query = new URLSearchParams();
  if (assignedAccountIdx) query.set('assignedAccountIdx', String(assignedAccountIdx));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await customerFetch<any>(
    `${BASE_URL2}/api/app/customers/progress?${query}`,
  );

  return mapProgressCounts(data);
}

/** 고객 목록 조회 (전체, 하위 호환용 — limit 미지정 시 10000으로 요청) */
export async function getCustomers(params?: {
  keyword?: string;
  consultStatus?: string;
  customerType?: CustomerType;
  assignedAccountIdx?: number;
}): Promise<Customer[]> {
  const query = new URLSearchParams();
  if (params?.customerType) query.set('customerType', params.customerType);
  if (params?.keyword) query.set('keyword', params.keyword);
  if (params?.consultStatus) query.set('consultStatus', params.consultStatus);
  if (params?.assignedAccountIdx)
    query.set('assignedAccountIdx', String(params.assignedAccountIdx));
  query.set('page', '1');
  query.set('limit', '10000');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await customerFetch<any>(
    `${BASE_URL2}/api/app/customers?${query}`,
  );
  const list = Array.isArray(data) ? data : data?.customers ?? [];

  return list.map(mapCustomer);
}

export interface GetCustomersPagedParams {
  keyword?: string;
  consultStatus?: string;
  customerType?: CustomerType;
  assignedAccountIdx?: number;
  page?: number;
  limit?: number;
}

export interface GetCustomersPagedResult {
  customers: Customer[];
  total: number;
}

/** 고객 목록 조회 (페이징) */
export async function getCustomersPaged(
  params?: GetCustomersPagedParams,
): Promise<GetCustomersPagedResult> {
  const query = new URLSearchParams();
  if (params?.customerType) query.set('customerType', params.customerType);
  if (params?.keyword) query.set('keyword', params.keyword);
  if (params?.consultStatus) query.set('consultStatus', params.consultStatus);
  if (params?.assignedAccountIdx)
    query.set('assignedAccountIdx', String(params.assignedAccountIdx));
  query.set('page', String(params?.page ?? 1));
  query.set('limit', String(params?.limit ?? 20));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await customerFetch<any>(
    `${BASE_URL2}/api/app/customers?${query}`,
  );
  const list = Array.isArray(data) ? data : data?.customers ?? [];
  return {
    customers: list.map(mapCustomer),
    total: data?.total ?? list.length,
  };
}

/** 고객 상세 조회 */
export async function getCustomer(
  customerType: CustomerType,
  idx: number,
): Promise<Customer | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await customerFetch<any>(
      `${BASE_URL2}/api/app/customers/${customerType}/${idx}`,
    );
    const raw = data?.customer ?? data;
    return mapCustomer(raw);
  } catch (e) {
    return null;
  }
}

/** 상담 상태 변경 */
export async function updateConsultStatus(
  customerType: CustomerType,
  idx: number,
  consultStatus: string,
): Promise<void> {
  await customerPatch<unknown>(
    `${BASE_URL2}/api/app/customers/${customerType}/${idx}/status`,
    { consultStatus },
  );
}

/** 고객 열람 처리 (is_open = 1) */
export async function openCustomer(
  customerType: CustomerType,
  idx: number,
): Promise<void> {
  await customerPatch<unknown>(
    `${BASE_URL2}/api/app/customers/${customerType}/${idx}/open`,
    {},
  );
}

/** 설계사 메모 수정 */
export async function updateCustomerMemo(
  customerType: CustomerType,
  idx: number,
  memo: string,
): Promise<void> {
  await customerPatch<unknown>(
    `${BASE_URL2}/api/app/customers/${customerType}/${idx}/memo`,
    { memo },
  );
}

/** 상담 이력 조회 */
export async function getConsultLogs(
  customerType: CustomerType,
  idx: number,
): Promise<ConsultLog[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await customerFetch<any>(
    `${BASE_URL2}/api/app/customers/${customerType}/${idx}/logs`,
  );
  const list = Array.isArray(data) ? data : data?.logs ?? [];
  return list.map(mapConsultLog);
}

/** 상담 이력 추가 */
export async function addConsultLog(params: {
  customerType: CustomerType;
  customerIdx: number;
  content: string;
  nextConsultDate?: string;
  memo?: string;
  accountIdx: number;
  accountName: string;
}): Promise<ConsultLog> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await customerPost<any>(
    `${BASE_URL2}/api/app/customers/${params.customerType}/${params.customerIdx}/logs`,
    {
      content: params.content,
      next_consult_date: params.nextConsultDate ?? null,
      memo: params.memo ?? null,
    },
  );
  const raw = data?.log ?? data;
  return mapConsultLog(raw);
}

/** 오디오 자막 조회 */
export async function getAudioTts(
  customerType: CustomerType,
  idx: number,
): Promise<AudioTtsItem[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await customerFetch<any>(
    `${BASE_URL2}/api/app/customers/${customerType}/${idx}/audio-tts`,
  );
  const list = Array.isArray(data) ? data : data?.tts ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return list.map((r: any) => ({
    id: r.id,
    audioFile: r.audioFile,
    sequenceNo: r.sequenceNo,
    transcript: r.transcript,
    startTime: r.startTime,
    endTime: r.endTime,
    confidence: r.confidence ?? null,
    createdAt: r.createdAt,
  }));
}

/** 전체 상태 변경 이력 (DBScreen 변경이력) — order desc|asc */
export async function getStatusHistory(
  _limit = 20,
  orderDesc = true,
): Promise<StatusHistoryItem[]> {
  const order = orderDesc ? 'desc' : 'asc';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await customerFetch<any>(
    `${BASE_URL2}/api/app/customers/status-history?order=${order}`,
  );
  const list = Array.isArray(data) ? data : data?.history ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return list.map((r: any) => ({
    idx: r.idx,
    customerName: r.customerName ?? r.customer_name,
    customerType: r.customerType ?? r.customer_type,
    customerIdx: r.customerIdx ?? r.customer_idx,
    prevStatus: r.prevStatus ?? r.prev_status,
    nextStatus: r.nextStatus ?? r.next_status,
    changedAt: r.changedAt ?? r.changed_at,
  }));
}

/** 특정 고객의 상태 변경 이력 (CustomerInfo) — limit 10 고정, order desc|asc */
export async function getCustomerStatusHistory(
  customerType: CustomerType,
  idx: number,
  order: 'desc' | 'asc' = 'desc',
): Promise<StatusHistoryItem[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await customerFetch<any>(
    `${BASE_URL2}/api/app/customers/${customerType}/${idx}/status-history?order=${order}`,
  );
  const list = Array.isArray(data) ? data : data?.history ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return list.map((r: any) => ({
    idx: r.idx,
    customerName: r.customerName ?? r.customer_name,
    customerType: customerType,
    customerIdx: idx,
    prevStatus: r.prevStatus ?? r.prev_status,
    nextStatus: r.nextStatus ?? r.next_status,
    changedAt: r.changedAt ?? r.changed_at,
  }));
}
