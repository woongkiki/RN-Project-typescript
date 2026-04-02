import { BrandConfig, User } from '../types';

interface LoginResponse {
  user: User;
  firstlogin: boolean;
  brandConfig: BrandConfig;
  token: string;
}

// 실제 서버 연동 전 mock 데이터
const mockLogin = (id: string, password: string): LoginResponse => {
  // 계정에 따라 다른 브랜드 config 반환
  if (id === 'test') {
    return {
      token: 'mock-token-a',
      firstlogin: false,
      user: {
        idx: '2',
        id,
        email: 'test@test.com',
        name: '홍길동',
        grade: 1,
        brandConfig: {
          brandId: 'brand-a',
          brandName: '보험사 A',
          apiUrl: 'https://api-a.example.com',
          dbKey: 'brand_a_db',
          theme: {
            colors: {
              primary: '#FF3B30',
              secondary: '#FF6B6B',
              background: '#FFFFFF',
              text: '#000000',
              tabBar: '#F8F8F8',
            },
            logo: '',
          },
        },
      },
      brandConfig: {
        brandId: 'brand-a',
        brandName: '보험사 A',
        apiUrl: 'https://api-a.example.com',
        dbKey: 'brand_a_db',
        theme: {
          colors: {
            primary: '#FF3B30',
            secondary: '#FF6B6B',
            background: '#0f0',
            text: '#000000',
            tabBar: '#F8F8F8',
          },
          logo: '',
        },
      },
    };
  }

  return {
    token: 'mock-token-b',
    firstlogin: true,
    user: {
      idx: '2',
      id,
      email: 'test2@test.com',
      name: '김철수',
      grade: 4,
      brandConfig: {
        brandId: 'brand-b',
        brandName: '보험사 C',
        apiUrl: 'https://api-b.example.com',
        dbKey: 'brand_b_db',
        theme: {
          colors: {
            primary: '#007AFF',
            secondary: '#5856D6',
            background: '#F2F2F7',
            text: '#000000',
            tabBar: '#F8F8F8',
          },
          logo: '',
        },
      },
    },
    brandConfig: {
      brandId: 'brand-b',
      brandName: '보험사 C',
      apiUrl: 'https://api-b.example.com',
      dbKey: 'brand_b_db',
      theme: {
        colors: {
          primary: '#007AFF',
          secondary: '#5856D6',
          background: '#F2F2F7',
          text: '#000000',
          tabBar: '#F8F8F8',
        },
        logo: '',
      },
    },
  };
};

export const loginApi = async (
  id: string,
  password: string,
): Promise<LoginResponse> => {
  // TODO: 실제 API 연동 시 아래 주석 해제
  // const response = await fetch('https://your-api.com/auth/login', {
  //   method: 'POST',
  //   headers: {'Content-Type': 'application/json'},
  //   body: JSON.stringify({id, password}),
  // });
  // return response.json();

  return new Promise(resolve => {
    setTimeout(() => resolve(mockLogin(id, password)), 500);
  });
};
