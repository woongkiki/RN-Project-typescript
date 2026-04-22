import { BASE_URL2 } from './util';
import { useAuthStore } from '../store';
import { MenuCode } from './plan';

const authHeaders = () => {
  const token = useAuthStore.getState().token ?? '';
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    'X-App-Token': token,
  };
};

/** 저장된 메뉴 순서 조회 (없으면 빈 배열) */
export const getMenuOrder = async (): Promise<MenuCode[]> => {
  try {
    const res = await fetch(`${BASE_URL2}/api/app/menu/order`, {
      headers: authHeaders(),
    });
    const json = await res.json();
    const ok = json.success ?? json.result ?? false;
    if (!ok || !json.data) return [];
    return (json.data.order ?? []) as MenuCode[];
  } catch {
    return [];
  }
};

/** 메뉴 순서 저장 */
export const saveMenuOrder = async (order: MenuCode[]): Promise<void> => {
  await fetch(`${BASE_URL2}/api/app/menu/order`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ order }),
  });
};
