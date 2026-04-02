// src/types/auth.ts
export interface User {
  id: string;
  name: string;
  email: string;
  // 서버에서 내려오는 필드에 맞게 추가
}

export interface AppConfig {
  apiUrl: string;
  dbKey: string;
  theme: 'light' | 'dark' | string; // theme 타입에 맞게 수정
}
