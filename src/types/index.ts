// ─── 정산 (tbl_settlements / tbl_settlement_db_details) ───────────────────────

// tbl_settlements
export type SettlementType = 'db_sales' | 'system_fee' | 'total';
export type SettlementStatus = '미확정' | '확정';

// tbl_settlement_db_details — 행 단위 정산 내역 (API가 고객 이름 join)
export interface AdjustmentItem {
  idx: number;
  settlementMonth: string;   // YYYY-MM
  date: string;              // MM.DD 표시용
  customerName: string;      // tbl_office_customers join
  dbGradeName: string;       // tbl_settlement_db_details.db_grade_name
  type: string;              // 계약완료 등 종류
  unitPrice: number;         // unit_price
  asExcluded: boolean;       // AS 제외 여부
  amount: number;            // 실 정산액
}

// 정산 요약 (화면 상단 표시)
export interface AdjustmentSummary {
  totalAmount: number;
  status: SettlementStatus;
  items: AdjustmentItem[];
}

// ─── DB관리 (tbl_office_customers / tbl_self_customers / tbl_consult_logs) ───

export type CustomerType = 'office' | 'self';

// tbl_office_customers + tbl_self_customers — 통합 고객 모델 (API가 병합 반환)
export interface Customer {
  idx: number;
  customerType: CustomerType;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  memo: string | null;
  dbGradeIdx?: number | null;
  dbGradeName?: string | null;       // office 고객만 존재
  consultStatus: string;             // tbl_consult_statuses.name 값
  assignedAccountIdx: number | null;
  assignedAccountName?: string | null;
  distributeAt?: string | null;      // office 고객만 존재
  createdAt: string;
  updatedAt: string;
}

// tbl_consult_statuses
export interface ConsultStatus {
  idx: number;
  officeIdx: number;
  name: string;
  color: string;
  isSystem: boolean;
  sortOrder: number;
}

// tbl_consult_logs
export interface ConsultLog {
  idx: number;
  officeIdx: number;
  customerType: CustomerType;
  customerIdx: number;
  accountIdx: number;
  accountName: string;
  content: string;
  nextConsultDate: string | null;
  memo: string | null;
  createdAt: string;
  updatedAt: string;
}

// 상태 변경 이력 (변경 이력 테이블용)
export interface StatusHistoryItem {
  idx: number;
  customerName: string;
  customerType: CustomerType;
  customerIdx: number;
  prevStatus: string;
  nextStatus: string;
  changedAt: string;
}

// DB 통계 (HomeScreen 도넛 차트용)
export interface DbStats {
  year: number;
  month: number;
  totalCount: number;    // 전체 고객 수
  usedCount: number;     // 사용DB: consultStatus != '상담대기'
  meetingCount: number;  // 미팅완료
  contractCount: number; // 계약완료
}

// 진행 중 업무 건수 (DBScreen BusinessCountButton용)
export interface ProgressCounts {
  total: number;    // 전체 고객 수
  meeting: number;  // 미팅
  call: number;     // 통화
  absent: number;   // 부재
}

// ─── 알림 (tbl_notifications) ────────────────────────────────────────────────

export type NotificationType = 'schedule' | 'db' | 'community' | 'system';

// tbl_notifications
export interface Notification {
  idx: number;
  targetType: 'admin' | 'office_account';
  targetIdx: number;
  officeIdx: number | null;
  type: NotificationType;
  title: string;
  message: string | null;
  linkUrl: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

// ─── 게시판 (tbl_board_categories / tbl_board_posts / tbl_board_files) ───

export type BoardType = 'education' | 'general' | 'free' | 'seminar';

// tbl_board_categories
export interface BoardCategory {
  idx: number;
  officeIdx: number;
  boardType: BoardType;
  name: string;
  sortOrder: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// tbl_board_files
export interface BoardFile {
  idx: number;
  postIdx: number;
  filePath: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
}

// tbl_board_posts — 목록용 (content 제외)
export interface BoardPostItem {
  idx: number;
  officeIdx: number;
  boardType: BoardType;
  categoryIdx: number | null;
  categoryName: string | null; // tbl_board_categories.name join
  title: string;
  accountIdx: number;
  accountName: string; // tbl_office_accounts.name join
  viewCount: number;
  status: number;
  createdAt: string;
  updatedAt: string;
}

// tbl_board_posts — 상세용
export interface BoardPost extends BoardPostItem {
  content: string;
  files: BoardFile[];
}

// 동영상 교육 게시글 (boardType: 'education', 동영상 탭)
// content 필드에 저장된 JSON { youtube_id, description } 을 API가 파싱하여 반환
export interface EducationVideoItem extends BoardPostItem {
  youtubeId: string;
  thumbnailUrl: string;
  description: string;
  isCompleted: boolean; // 교육 완료 여부 (추후 별도 이력 테이블 연동)
}

// 세미나 게시글 목록 (boardType: 'seminar')
// content 필드에 저장된 JSON { start_at, end_at, deadline, capacity, registered_count, thumbnail_url } 을 API가 파싱
export interface SeminarPostItem extends BoardPostItem {
  thumbnailUrl: string;
  startAt: string;
  endAt: string;
  deadline: string;
  capacity: number;
  registeredCount: number;
  isFull: boolean;
}

// 세미나 상세
export interface SeminarPost extends SeminarPostItem {
  description: string; // 세미나 소개글
  files: BoardFile[];
}

// ─── 직원평가 (tbl_evaluation_categories / tbl_evaluation_items / tbl_evaluations / tbl_evaluation_scores) ───

// tbl_evaluation_categories
export interface EvaluationCategory {
  idx: number;
  officeIdx: number;
  name: string;
  maxScore: number;
  sortOrder: number;
  status: number;
}

// tbl_evaluation_items
export interface EvaluationItem {
  idx: number;
  categoryIdx: number;
  name: string;
  maxScore: number;
  sortOrder: number;
}

// tbl_evaluations
export interface Evaluation {
  idx: number;
  officeIdx: number;
  targetAccountIdx: number;
  evaluatorAccountIdx: number;
  periodStart: string;   // YYYY-MM-DD
  periodEnd: string;     // YYYY-MM-DD
  totalScore: number;
  grade: string | null;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

// tbl_evaluation_scores
export interface EvaluationScore {
  idx: number;
  evaluationIdx: number;
  itemIdx: number;
  score: number;
  comment: string | null;
}

// 월별 평가 요약 — 바차트용
export interface MonthlyEvalStat {
  month: number;         // 1~12
  myScore: number;       // 해당 월 내 총점
  groupAverage: number;  // 해당 월 그룹 평균
}

// 카테고리별 평가 상세 — 레이더차트용
export interface CategoryEvalStat {
  categoryName: string;
  myScore: number;
  groupAverage: number;
  maxScore: number;
}

// StatScreen 전체 응답
export interface StatSummary {
  year: number;
  month: number;
  monthlyStats: MonthlyEvalStat[];   // 해당 연도 전체 월별
  categoryStats: CategoryEvalStat[]; // 선택 월 카테고리별
  evaluation: {
    totalScore: number;
    grade: string | null;
    comment: string | null;
  } | null;
}

// ────────────────────────────────────────────────────────────────────────────

// 영업점 계정 역할 (tbl_office_accounts.role)
export type UserRole = 'FP' | 'TL' | 'BM' | 'BA';

// 역할 레벨 (숫자 비교가 필요한 경우)
export const ROLE_LEVEL: Record<UserRole, number> = {
  FP: 1, // Financial Planner (일반 설계사)
  TL: 2, // Team Leader (팀장)
  BM: 3, // Branch Manager (지점장)
  BA: 4, // Branch Administrator (영업점 관리자)
};

// 영업점 (tbl_offices)
export interface Office {
  idx: number;
  name: string;
  ceoName?: string;
  businessNumber?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  planIdx: number;
  planCode: string;
  status: number;
  rdsHost?: string;
  rdsPort?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

// 영업점 계정 (tbl_office_accounts) — 로그인 유저
export interface User {
  idx: number;
  loginId: string;
  name: string;
  phone: string | null;
  email: string | null;
  role: UserRole;
  deptIdx: number | null;
  orgIdx: number | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  office: Office;
}
