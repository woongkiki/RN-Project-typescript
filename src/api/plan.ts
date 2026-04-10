// src/api/plan.ts
// import { BASE_URL } from './util';

// tbl_plan_menus.menu_code 값 목록
export type MenuCode =
  | 'db'
  | 'schedule'
  | 'education'
  | 'community'
  | 'payment'
  | 'stats'
  | 'seminar';

// ─── Mock 데이터 (tbl_plan_menus 초기 데이터 기준) ───────────────────────────
// plan_idx는 tbl_plans INSERT 순서: 1=A플랜, 2=B플랜, 3=C플랜
const PLAN_MENUS: Record<number, MenuCode[]> = {
  1: ['db', 'education', 'community', 'payment', 'seminar'],
  2: ['db', 'education', 'community', 'payment', 'seminar'],
  3: ['db', 'schedule', 'education', 'community', 'payment', 'stats', 'seminar'],
};

// ─── API 함수 ──────────────────────────────────────────────────────────────────

export async function getPlanMenus(planIdx: number): Promise<MenuCode[]> {
  // TODO: 실제 API 연동 시 아래 주석 해제
  // const res = await fetch(`${BASE_URL}/api/plans/${planIdx}/menus`, {
  //   headers: { Authorization: `Bearer ${token}` },
  // });
  // const json = await res.json();
  // return json.data; // MenuCode[]

  return new Promise(resolve =>
    setTimeout(() => resolve(PLAN_MENUS[planIdx] ?? PLAN_MENUS[1]), 100),
  );
}
