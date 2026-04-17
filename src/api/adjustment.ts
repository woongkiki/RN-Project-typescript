import { DbSettlement, DbSettlementDetail, SettlementStatus } from '../types';
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

async function adjustmentFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) throw new Error(`서버 오류 (HTTP ${res.status})`);
  const text = await res.text();
  let json: ApiResponse<T>;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error('서버 응답을 파싱할 수 없습니다.');
  }
  const ok = json.success ?? json.result ?? false;
  if (!ok || json.data == null) throw new Error(json.message ?? '요청에 실패했습니다.');
  return json.data;
}

// YYYY-MM-DD 포맷
const formatYYYYMMDD = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// ─── DB 판매 정산 ──────────────────────────────────────────────────────────────

export interface DbSettlementListResult {
  totalAmount: number;
  status: SettlementStatus;
  list: DbSettlement[];
}

export async function getDbSettlements(
  officeIdx: number,
  startDate: Date,
  endDate: Date,
): Promise<DbSettlementListResult> {
  const params = new URLSearchParams({
    office_idx: String(officeIdx),
    start_date: formatYYYYMMDD(startDate),
    end_date: formatYYYYMMDD(endDate),
  });

  const data = await adjustmentFetch<{ list: DbSettlement[] }>(
    `${BASE_URL2}/api/app/settlements/db?${params}`,
  );

  const list = data.list ?? [];
  const totalAmount = list.reduce((sum, s) => sum + s.total_amount, 0);
  const status: SettlementStatus = list.some(s => s.status === '미확정') ? '미확정' : '확정';

  return { totalAmount, status, list };
}

export async function getDbSettlementDetail(
  officeIdx: number,
  idx: number,
): Promise<{ settlement: DbSettlement; details: DbSettlementDetail[] }> {
  const params = new URLSearchParams({ office_idx: String(officeIdx) });
  return adjustmentFetch(`${BASE_URL2}/api/app/settlements/db/${idx}?${params}`);
}

// ─── 유틸 ─────────────────────────────────────────────────────────────────────

export const formatAmount = (amount: number): string =>
  amount.toLocaleString('ko-KR') + '원';
