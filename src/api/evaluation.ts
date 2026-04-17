import { BASE_URL2 } from './util';
import { useAuthStore } from '../store';
import { StatSummary } from '../types';

// ─── API 응답 타입 ──────────────────────────────────────────────────────────────

interface ApiResponse<T> {
  success?: boolean;
  result?: boolean;
  message: string | null;
  data: T | null;
}

interface EvalStatsMonthly {
  month: string;          // "01"~"12"
  label: string;          // "1월"
  year: string;           // "2025" | "2026"
  eval_idx: number | null;
  my_score: number;       // 0~100 퍼센트
  team_avg: number;       // 0~100 퍼센트
  total_score?: number;
  grade?: string | null;
  comment?: string | null;
}

interface EvalStatsRadarItem {
  item_idx: number;
  name: string;
  max_score: number;
  my_score: number;
  team_avg: number;
}

interface EvalStatsRadar {
  evaluation_idx: number | null;
  title: string;
  period_start: string;
  period_end: string;
  total_score?: number;
  grade?: string | null;
  comment?: string | null;
  memo?: string | null;
  items: EvalStatsRadarItem[];
}

interface EvalStatsResponse {
  monthly: EvalStatsMonthly[];  // 항상 6개 (연도 경계 포함)
  radar: EvalStatsRadar | null;
}

// ─── 공통 ──────────────────────────────────────────────────────────────────────

const authHeaders = () => {
  const token = useAuthStore.getState().token ?? '';
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

// ─── API 함수 ──────────────────────────────────────────────────────────────────

/**
 * GET /api/app/evaluations/stats?year=YYYY&month=MM
 *
 * - monthly : 선택 월 기준 최근 6개월 (연도 경계 포함, 없는 달은 0)
 * - radar   : 선택 월 기준 최신 평가의 항목별 원점수
 */
export async function getStatSummary(
  year: number,
  month: number,
): Promise<StatSummary> {
  const yearMonth = `${year}-${String(month).padStart(2, '0')}`;
  const res = await fetch(
    `${BASE_URL2}/api/app/evaluations/stats?yearMonth=${yearMonth}`,
    { headers: authHeaders() },
  );

  if (!res.ok) {
    throw new Error(`서버 오류 (HTTP ${res.status})`);
  }

  const json: ApiResponse<EvalStatsResponse> = await res.json();
  const d = json.data;

  if (!d) {
    throw new Error(json.message ?? 'API 오류');
  }

  // 바차트용 — 백엔드가 이미 6개 순서대로 반환
  const monthlyStats = d.monthly.map(m => ({
    month: parseInt(m.month, 10),
    myScore: m.my_score,
    groupAverage: m.team_avg,
  }));

  // 선택 월 데이터 (등급·코멘트)
  const selectedMonthStr = String(month).padStart(2, '0');
  const selectedMonth = d.monthly.find(m => m.month === selectedMonthStr);

  // 레이더차트 데이터 — 폴리곤은 퍼센트(0~100), 라벨은 원점수
  const categoryStats = (d.radar?.items ?? []).map(item => ({
    categoryName: item.name,
    myScore:
      item.max_score > 0
        ? Math.round((item.my_score / item.max_score) * 100)
        : 0,
    groupAverage:
      item.max_score > 0
        ? Math.round((item.team_avg / item.max_score) * 100)
        : 0,
    maxScore: 100,
    rawMyScore: item.my_score,
  }));

  const hasEval = !!(selectedMonth?.eval_idx || d.radar?.evaluation_idx);
  const evaluation = hasEval
    ? {
        totalScore: selectedMonth?.total_score ?? d.radar?.total_score ?? 0,
        grade: selectedMonth?.grade ?? d.radar?.grade ?? null,
        comment:
          selectedMonth?.comment ??
          d.radar?.comment ??
          d.radar?.memo ??
          null,
      }
    : null;

  return { year, month, monthlyStats, categoryStats, evaluation };
}
