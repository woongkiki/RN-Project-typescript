export interface BrandTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    tabBar: string;
  };
  logo: string; // 로고 이미지 URL 또는 로컬 경로
}

export interface BrandConfig {
  brandId: string;
  brandName: string;
  apiUrl: string;
  dbKey: string; // 계정별 DB 구분 키
  theme: BrandTheme;
}

export interface User {
  idx: string;
  id: string;
  email: string;
  name: string;
  grade: number;
  brandConfig: BrandConfig;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  brandConfig: BrandConfig | null;
}
