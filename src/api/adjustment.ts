// src/api/adjustment.ts
// import { BASE_URL } from './util';
import { AdjustmentItem, AdjustmentSummary } from '../types';

// ─── Mock 데이터 ───────────────────────────────────────────────────────────────

const MOCK_ITEMS: AdjustmentItem[] = [
  {
    idx: 1,
    settlementMonth: '2026-04',
    date: '04.03',
    customerName: '박지호',
    dbGradeName: 'B등급',
    type: '계약완료',
    unitPrice: 80000,
    asExcluded: false,
    amount: 80000,
  },
  {
    idx: 2,
    settlementMonth: '2026-04',
    date: '04.05',
    customerName: '이서연',
    dbGradeName: 'A등급',
    type: '계약완료',
    unitPrice: 120000,
    asExcluded: false,
    amount: 120000,
  },
  {
    idx: 3,
    settlementMonth: '2026-04',
    date: '04.05',
    customerName: '임태양',
    dbGradeName: 'A등급',
    type: '계약완료',
    unitPrice: 120000,
    asExcluded: false,
    amount: 120000,
  },
  {
    idx: 4,
    settlementMonth: '2026-04',
    date: '04.07',
    customerName: '강예진',
    dbGradeName: 'A등급',
    type: 'AS제외',
    unitPrice: 120000,
    asExcluded: true,
    amount: 0,
  },
  {
    idx: 5,
    settlementMonth: '2026-03',
    date: '03.20',
    customerName: '한지우',
    dbGradeName: 'B등급',
    type: '계약완료',
    unitPrice: 80000,
    asExcluded: false,
    amount: 80000,
  },
  {
    idx: 6,
    settlementMonth: '2026-03',
    date: '03.16',
    customerName: '오하은',
    dbGradeName: 'A등급',
    type: '계약완료',
    unitPrice: 120000,
    asExcluded: false,
    amount: 120000,
  },
];

// ─── API 함수 ──────────────────────────────────────────────────────────────────

// 날짜 범위 기준 정산 내역 조회 (settlementMonth 기준 필터)
export async function getAdjustments(
  startDate: Date,
  endDate: Date,
): Promise<AdjustmentSummary> {
  // TODO: 실제 API 연동 시 아래 주석 해제
  // const params = new URLSearchParams({
  //   start: formatYYYYMM(startDate),
  //   end: formatYYYYMM(endDate),
  // });
  // const res = await fetch(`${BASE_URL}/api/adjustments?${params}`, {
  //   headers: { Authorization: `Bearer ${token}` },
  // });
  // const json = await res.json();
  // return json.data;

  return new Promise(resolve =>
    setTimeout(() => {
      // 날짜 범위 내 settlementMonth 필터
      const start = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      const end = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);

      const items = MOCK_ITEMS.filter(item => {
        const [y, m] = item.settlementMonth.split('-').map(Number);
        const itemDate = new Date(y, m - 1, 1);
        return itemDate >= start && itemDate <= end;
      });

      const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

      resolve({
        totalAmount,
        status: '미확정',
        items,
      });
    }, 300),
  );
}

// 금액 포맷 (000,000원)
export const formatAmount = (amount: number): string =>
  amount.toLocaleString('ko-KR') + '원';
