export const BASE_URL2 = 'http://insightcore.cafe24.com';
export const BASE_URL = 'https://cnj0005.cafe24.com';

/** 영업점별 RDS 서버 URL 생성 */
export const getOfficeBaseUrl = (rdsHost: string, rdsPort: number) =>
  `http://${rdsHost}:${rdsPort}`;
