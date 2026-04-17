import { Notification } from '../types';
import { BASE_URL2 } from './util';
import { useAuthStore } from '../store';

interface ApiResponse<T> {
  result?: boolean;
  success?: boolean;
  message: string | null;
  data: T | null;
}

const authHeaders = () => {
  const token = useAuthStore.getState().token ?? '';
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    'X-App-Token': token,
  };
};

// 내 알림 목록 조회
// GET /api/app/notifications
export async function getNotifications(): Promise<Notification[]> {
  try {
    const res = await fetch(`${BASE_URL2}/api/app/notifications`, {
      headers: authHeaders(),
    });

    // console.log('noti', res);
    if (!res.ok) {
      return [];
    }
    const json: ApiResponse<Notification[]> = await res.json();
    console.log('[Notification] response:', JSON.stringify(json, null, 2));
    return Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

// 단건 읽음 처리
// PUT /api/app/notification/{idx}/read
export async function markAsRead(idx: number): Promise<void> {
  await fetch(`${BASE_URL2}/api/app/notification/${idx}/read`, {
    method: 'PUT',
    headers: authHeaders(),
  });
}

// 전체 읽음 처리
// PUT /api/app/notifications/read-all
export async function markAllAsRead(): Promise<void> {
  await fetch(`${BASE_URL2}/api/app/notifications/read-all`, {
    method: 'PUT',
    headers: authHeaders(),
  });
}
