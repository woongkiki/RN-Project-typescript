// src/api/evaluation.ts
// import { BASE_URL } from './util';
import { StatSummary } from '../types';

// ─── Mock 데이터 ───────────────────────────────────────────────────────────────
// tbl_evaluation_categories 기준 카테고리 6개
// (실제 영업점 생성 시 office_idx 단위로 INSERT 됨)

const CATEGORIES = ['미팅률', '계약률', 'DB응답', '가망고객케어', '재계약률', '고객만족도'];

// 연도·월별 내 점수 / 그룹 평균 (tbl_evaluations + tbl_evaluation_scores 집계)
const MONTHLY_BASE: Record<number, { my: number; avg: number }> = {
  1:  { my: 71, avg: 60 },
  2:  { my: 30, avg: 58 },
  3:  { my: 31, avg: 58 },
  4:  { my: 71, avg: 60 },
  5:  { my: 71, avg: 85 },
  6:  { my: 71, avg: 85 },
  7:  { my: 80, avg: 72 },
  8:  { my: 65, avg: 70 },
  9:  { my: 78, avg: 68 },
  10: { my: 85, avg: 75 },
  11: { my: 90, avg: 80 },
  12: { my: 88, avg: 82 },
};

// 카테고리별 점수 (tbl_evaluation_scores 기준, 월별로 약간씩 변동)
const CATEGORY_BASE: Record<number, { my: number; avg: number }[]> = {
  1:  [{ my: 70, avg: 60 }, { my: 30, avg: 55 }, { my: 50, avg: 65 }, { my: 70, avg: 60 }, { my: 70, avg: 80 }, { my: 95, avg: 85 }],
  2:  [{ my: 55, avg: 58 }, { my: 28, avg: 50 }, { my: 60, avg: 62 }, { my: 40, avg: 55 }, { my: 30, avg: 70 }, { my: 80, avg: 80 }],
  3:  [{ my: 60, avg: 58 }, { my: 32, avg: 52 }, { my: 55, avg: 63 }, { my: 45, avg: 57 }, { my: 35, avg: 72 }, { my: 82, avg: 78 }],
  4:  [{ my: 70, avg: 60 }, { my: 30, avg: 55 }, { my: 50, avg: 65 }, { my: 70, avg: 60 }, { my: 70, avg: 80 }, { my: 95, avg: 85 }],
  5:  [{ my: 75, avg: 72 }, { my: 40, avg: 62 }, { my: 70, avg: 70 }, { my: 75, avg: 68 }, { my: 80, avg: 85 }, { my: 90, avg: 88 }],
  6:  [{ my: 72, avg: 70 }, { my: 38, avg: 60 }, { my: 68, avg: 68 }, { my: 73, avg: 66 }, { my: 78, avg: 83 }, { my: 88, avg: 86 }],
  7:  [{ my: 78, avg: 68 }, { my: 45, avg: 65 }, { my: 72, avg: 72 }, { my: 78, avg: 70 }, { my: 82, avg: 82 }, { my: 92, avg: 88 }],
  8:  [{ my: 65, avg: 66 }, { my: 35, avg: 58 }, { my: 62, avg: 65 }, { my: 68, avg: 65 }, { my: 72, avg: 80 }, { my: 86, avg: 85 }],
  9:  [{ my: 75, avg: 65 }, { my: 42, avg: 62 }, { my: 68, avg: 68 }, { my: 75, avg: 68 }, { my: 78, avg: 82 }, { my: 90, avg: 86 }],
  10: [{ my: 80, avg: 72 }, { my: 50, avg: 65 }, { my: 75, avg: 72 }, { my: 82, avg: 72 }, { my: 85, avg: 84 }, { my: 92, avg: 90 }],
  11: [{ my: 85, avg: 76 }, { my: 55, avg: 68 }, { my: 80, avg: 75 }, { my: 86, avg: 75 }, { my: 88, avg: 86 }, { my: 95, avg: 92 }],
  12: [{ my: 82, avg: 78 }, { my: 52, avg: 70 }, { my: 78, avg: 78 }, { my: 84, avg: 78 }, { my: 86, avg: 88 }, { my: 94, avg: 92 }],
};

const COMMENTS: Record<number, string> = {
  1:  '미팅률 65%는 평균 이상이며,\n계약 30%는 평균 수준입니다.\n\nDB 응답은 훌륭하지만, 가망 고객 케어에서 더 신경을\n쓴다면 좋은 결과가 있을 것으로 예상됩니다.',
  4:  '미팅률 70%로 전월 대비 상승했습니다.\n계약률을 높이기 위한 후속 관리가 필요합니다.',
  7:  '전 항목에서 고른 성장세가 보입니다.\n특히 DB 응답 속도가 눈에 띄게 개선되었습니다.',
  10: '분기 최고 성적입니다. 계약률이 크게 향상되었으며,\n재계약률 유지에 계속 집중하시기 바랍니다.',
};

const GRADES: Record<number, string> = {
  1: 'B', 2: 'C', 3: 'C', 4: 'B', 5: 'B',
  6: 'B', 7: 'A', 8: 'B', 9: 'A', 10: 'A', 11: 'S', 12: 'A',
};

// ─── API 함수 ──────────────────────────────────────────────────────────────────

// 연도·월 기준 통계 요약 조회
// GET /api/stats/evaluations?year=YYYY&month=MM
export async function getStatSummary(
  year: number,
  month: number,
): Promise<StatSummary> {
  // TODO: 실제 API 연동 시 아래 주석 해제
  // const res = await fetch(
  //   `${BASE_URL}/api/stats/evaluations?year=${year}&month=${month}`,
  //   { headers: { Authorization: `Bearer ${token}` } },
  // );
  // const json = await res.json();
  // return json.data;

  return new Promise(resolve =>
    setTimeout(() => {
      const monthlyStats = Object.entries(MONTHLY_BASE).map(([m, v]) => ({
        month: Number(m),
        myScore: v.my,
        groupAverage: v.avg,
      }));

      const catData = CATEGORY_BASE[month] ?? CATEGORY_BASE[1];
      const categoryStats = CATEGORIES.map((name, i) => ({
        categoryName: name,
        myScore: catData[i].my,
        groupAverage: catData[i].avg,
        maxScore: 100,
      }));

      const monthData = MONTHLY_BASE[month];
      resolve({
        year,
        month,
        monthlyStats,
        categoryStats,
        evaluation: monthData
          ? {
              totalScore: monthData.my,
              grade: GRADES[month] ?? null,
              comment: COMMENTS[month] ?? '해당 월의 평가 코멘트가 없습니다.',
            }
          : null,
      });
    }, 300),
  );
}
