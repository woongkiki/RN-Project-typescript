// src/api/notification.ts
// import { BASE_URL } from './util';
import { Notification } from '../types';

// ─── Mock 데이터 (tbl_notifications 기준) ─────────────────────────────────────
// target_type: 'office_account', target_idx: 1 (test 계정 idx)

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    idx: 1,
    targetType: 'office_account',
    targetIdx: 1,
    officeIdx: 1,
    type: 'schedule',
    title: '스케줄 알림',
    message: '홍길동님과의 미팅이 2시간 후 시작됩니다.',
    linkUrl: null,
    isRead: false,
    readAt: null,
    createdAt: '2026-04-01 14:00:00',
  },
  {
    idx: 2,
    targetType: 'office_account',
    targetIdx: 1,
    officeIdx: 1,
    type: 'db',
    title: '새 DB 배정',
    message: '새로운 고객 DB가 배정되었습니다. 확인해보세요.',
    linkUrl: null,
    isRead: false,
    readAt: null,
    createdAt: '2026-04-01 11:30:00',
  },
  {
    idx: 3,
    targetType: 'office_account',
    targetIdx: 1,
    officeIdx: 1,
    type: 'community',
    title: '커뮤니티 댓글',
    message: '회원님의 게시글에 새 댓글이 달렸습니다.',
    linkUrl: null,
    isRead: true,
    readAt: '2026-03-31 18:00:00',
    createdAt: '2026-03-31 17:20:00',
  },
  {
    idx: 4,
    targetType: 'office_account',
    targetIdx: 1,
    officeIdx: 1,
    type: 'schedule',
    title: '스케줄 알림',
    message: '김철수님과의 통화 일정이 내일 오전 10시입니다.',
    linkUrl: null,
    isRead: true,
    readAt: '2026-03-31 10:00:00',
    createdAt: '2026-03-31 09:00:00',
  },
  {
    idx: 5,
    targetType: 'office_account',
    targetIdx: 1,
    officeIdx: null,
    type: 'system',
    title: '시스템 공지',
    message: '앱이 새로운 버전으로 업데이트되었습니다.',
    linkUrl: null,
    isRead: true,
    readAt: '2026-03-30 10:00:00',
    createdAt: '2026-03-30 09:00:00',
  },
  {
    idx: 6,
    targetType: 'office_account',
    targetIdx: 1,
    officeIdx: 1,
    type: 'db',
    title: '진행상태 변경',
    message: '홍길동님의 진행상태가 미팅완료로 변경되었습니다.',
    linkUrl: null,
    isRead: true,
    readAt: '2026-03-29 16:00:00',
    createdAt: '2026-03-29 15:45:00',
  },
];

// in-memory 상태 (mock용)
let mockData = [...MOCK_NOTIFICATIONS];

// ─── API 함수 ──────────────────────────────────────────────────────────────────

// 내 알림 목록 조회
// GET /api/notifications
export async function getNotifications(): Promise<Notification[]> {
  // TODO: 실제 API 연동 시 아래 주석 해제
  // const res = await fetch(`${BASE_URL}/api/notifications`, {
  //   headers: { Authorization: `Bearer ${token}` },
  // });
  // const json = await res.json();
  // return json.data;

  return new Promise(resolve =>
    setTimeout(() => resolve([...mockData]), 300),
  );
}

// 단건 읽음 처리
// PATCH /api/notifications/:idx/read
export async function markAsRead(idx: number): Promise<void> {
  // TODO: 실제 API 연동 시 아래 주석 해제
  // await fetch(`${BASE_URL}/api/notifications/${idx}/read`, {
  //   method: 'PATCH',
  //   headers: { Authorization: `Bearer ${token}` },
  // });

  return new Promise(resolve =>
    setTimeout(() => {
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      mockData = mockData.map(n =>
        n.idx === idx ? { ...n, isRead: true, readAt: now } : n,
      );
      resolve();
    }, 100),
  );
}

// 전체 읽음 처리
// PATCH /api/notifications/read-all
export async function markAllAsRead(): Promise<void> {
  // TODO: 실제 API 연동 시 아래 주석 해제
  // await fetch(`${BASE_URL}/api/notifications/read-all`, {
  //   method: 'PATCH',
  //   headers: { Authorization: `Bearer ${token}` },
  // });

  return new Promise(resolve =>
    setTimeout(() => {
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      mockData = mockData.map(n =>
        n.isRead ? n : { ...n, isRead: true, readAt: now },
      );
      resolve();
    }, 100),
  );
}
