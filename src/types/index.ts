// ─── 정산 (tbl_settlements / tbl_settlement_db_details) ───────────────────────

export type SettlementType = 'db_sales' | 'system_fee';
export type SettlementStatus = '미확정' | '확정';

// GET /api/app/settlements/db  —  목록 행
export interface DbSettlement {
  idx: number;
  settlement_month: string;    // YYYY-MM
  type: SettlementType;
  total_amount: number;
  status: SettlementStatus;
  confirmed_at: string | null;
  office_name: string;
  total_distribute: number;    // SUM(distribute_count)
  total_as_exclude: number;    // SUM(as_exclude_count)
  total_net: number;           // SUM(net_count)
}

// GET /api/app/settlements/db/{idx}  —  상세 행 (tbl_settlement_db_details)
export interface DbSettlementDetail {
  idx: number;
  settlement_idx: number;
  db_grade_name: string;
  unit_price: number;
  distribute_count: number;
  as_exclude_count: number;
  net_count: number;
  amount: number;
}

// GET /api/app/settlements/system/{idx}  —  시스템 이용료 상세
export interface SystemFeeDetail {
  idx: number;
  settlement_idx: number;
  setup_fee: number;
  monthly_fee: number;
  extra_persons: number;
  extra_person_fee: number;
  total_amount: number;
}

// tbl_settlement_fee_tiers
export interface FeeTier {
  idx: number;
  fee_detail_idx: number;
  min_count: number;
  max_count: number | null;
  person_count: number;
  unit_price: number;
  amount: number;
}

// GET /api/app/settlements/total  —  통합 정산
export interface TotalSettlementRow {
  office_idx: number;
  office_name: string;
  settlement_month: string;
  db_amount: number;
  fee_amount: number;
  grand_total: number;
}

export interface TotalSettlementSummary {
  db_total: number;
  fee_total: number;
  grand_total: number;
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
  gender: string | null;
  birthDate: string | null;
  age: number | null;
  job: string | null;
  familyConsult: boolean;
  productCategoryIdx: number | null;
  productCategoryName: string | null;
  dbGradeIdx?: number | null;
  dbGradeName?: string | null;       // office 고객만
  consultStatus: string;
  assignedAccountIdx: number | null;
  assignedAccountName?: string | null;
  distributeAt?: string | null;      // office 고객만
  createdAt: string;
  updatedAt: string;
  latestSchedule?: {
    idx: number;
    title: string;
    content: string | null;
    scheduleDate: string;
    scheduleTime: string | null;
    addr1: string | null;
    addr2: string | null;
    isImportant: string | null;
    createdAt: string;
  } | null;
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

// tbl_audio_tts — 상담 녹취 자막
export interface AudioTtsItem {
  id: number;
  audioFile: string;
  sequenceNo: number;
  transcript: string;
  startTime: number;
  endTime: number;
  confidence: number | null;
  createdAt: string;
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

// tbl_board_education_videos — 게시물에 연결된 유튜브 영상
export interface EducationVideo {
  idx: number;
  youtubeId: string;
  sortOrder: number;
}

// 동영상 교육 게시글 (boardType: 'education', 동영상 탭)
// tbl_board_education_videos 테이블 기반으로 변경
export interface EducationVideoItem extends BoardPostItem {
  videos: EducationVideo[];
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
  isRegistered: boolean; // 현재 로그인 유저의 신청 여부
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
  myScore: number;       // 0~100 퍼센트 (레이더 폴리곤용)
  groupAverage: number;  // 0~100 퍼센트
  maxScore: number;
  rawMyScore?: number;   // 원점수 (라벨 표시용)
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
