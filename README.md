# React Native + TypeScript + Zustand

React Native, TypeScript, Zustand를 활용한 모바일 앱 포트폴리오입니다.

> API 엔드포인트는 플레이스홀더로 대체되어 있습니다.  
> 데모 계정(`test / test`)으로 앱 흐름을 확인할 수 있습니다.

---

## 기술 스택

| 항목 | 버전 |
|---|---|
| **React Native** | 0.84.1 |
| **TypeScript** | 5.8.x |
| **Zustand** | 5.x |
| React | 19.2.3 |
| React Navigation | 7.x |
| react-native-track-player | nightly |
| react-native-svg | - |
| react-native-calendars | - |
| react-native-keyboard-controller | - |

---

## TypeScript 활용 포인트

### 1. 도메인 타입 정의 (`src/types/`)
API 응답부터 화면 렌더링까지 타입이 일관되게 흐르도록 인터페이스를 정의했습니다.

```ts
export type CustomerType = 'possible' | 'consult' | 'contract';

export interface Customer {
  idx: number;
  customerType: CustomerType;
  name: string;
  consultStatus: string;
  assignedAccountIdx: number | null;
  createdAt: string;
  // ...
}
```

### 2. 네비게이션 파라미터 타입 (`src/navigation/types.ts`)
스크린 간 데이터 전달 시 타입 오류를 컴파일 타임에 잡습니다.

```ts
export type MainStackParamList = {
  CustomerInfo: { customerType: CustomerType; idx: number };
  BoardInfo: { idx: number; title: string };
  ScheduleForm: { scheduleIdx?: number } | undefined;
  // ...
};

// 사용 예
type Props = NativeStackScreenProps<MainStackParamList, 'CustomerInfo'>;
```

### 3. Zustand 스토어 타입화 (`src/store/`)
상태와 액션을 인터페이스로 명시해 자동완성과 타입 검사가 동작합니다.  
`persist` 미들웨어로 AsyncStorage에 영속 저장하며, `partialize`로 저장 제외 필드를 제어합니다.

```ts
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isHydrated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setHydrated: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({ ... }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
        // isHydrated는 저장 제외
      }),
    }
  )
);
```

### 4. API 레이어 제네릭 패턴 (`src/api/`)
공통 응답 구조를 제네릭으로 추상화하고 각 도메인에서 재사용합니다.

```ts
interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T | null;
}

async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: authHeaders() });
  const json: ApiResponse<T> = await res.json();
  if (!json.success || json.data == null) {
    throw new Error(json.message ?? '요청 실패');
  }
  return json.data;
}
```

---

## 프로젝트 구조

```
src/
├── api/               # 제네릭 fetch 래퍼 + 도메인별 API 함수
├── components/        # 재사용 UI 컴포넌트
├── constants/         # 타입화된 컬러/폰트 상수
├── hooks/             # 커스텀 훅
├── navigation/        # React Navigation 설정 + ParamList 타입
│   ├── types.ts
│   ├── RootNavigator.tsx
│   ├── AuthNavigator.tsx
│   └── MainNavigator.tsx
├── screens/           # 화면 컴포넌트 (20+)
├── store/             # Zustand 스토어
│   ├── authStore.ts   # 인증 상태 (AsyncStorage 영속)
│   └── configStore.ts # 런타임 설정
├── types/             # TypeScript 인터페이스 / 타입 정의
└── utils/
```

---

## 네비게이션 구조

3단계 구조로 인증 상태에 따라 분기합니다.

```
RootNavigator
├── IntroScreen          ← isHydrated 대기 후 분기
├── AuthNavigator        ← 비로그인
│   ├── LoginScreen
│   └── FirstLoginScreen
└── MainNavigator        ← 로그인 후
    ├── TabNavigator (하단 탭 5개)
    └── Stack Screens (20+ 전체화면 오버레이)
```

`RootNavigator`는 Zustand의 `isHydrated`가 `true`가 될 때까지 렌더링을 지연시켜 AsyncStorage 복원 전 화면 깜빡임을 방지합니다.

---

## 실행

```bash
yarn install
yarn start

yarn android   # Android
yarn ios       # iOS
```

| ID | PW |
|---|---|
| `test` | `test` |
| `test2` | `test2` |
