// 포트폴리오 데모용 — 실제 서버 URL은 환경변수로 관리합니다
export const BASE_URL2 = 'https://api.example.com';
export const BASE_URL = 'https://api.example.com';

/** 현재 앱 버전 (빌드 시 수동으로 맞춰야 함) */
export const APP_VERSION = '1.0';

/** 스토어 URL (등록 후 채워넣기) */
export const ANDROID_STORE_URL = '';
export const IOS_STORE_URL = '';

/** 영업점별 RDS 서버 URL 생성 */
export const getOfficeBaseUrl = (rdsHost: string, rdsPort: number) =>
  `http://${rdsHost}:${rdsPort}`;
