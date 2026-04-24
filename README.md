# React Native + TypeScript Portfolio

React Native와 TypeScript를 활용한 실무 프로젝트 코드 샘플입니다.  
보험설계사용 고객 관리 앱을 개발하면서 적용한 구조와 패턴을 공개합니다.

> 실제 서비스에서 사용된 코드 기반이며, API 엔드포인트는 플레이스홀더로 대체되어 있습니다.  
> 데모 계정(`test / test`)으로 앱 흐름을 직접 확인할 수 있습니다.

---

## 주요 기술 스택

| 항목 | 버전 |
|---|---|
| **React Native** | 0.84.1 |
| **TypeScript** | 5.8.x |
| React | 19.2.3 |
| Node.js | >= 22.11.0 |
| 상태 관리 | Zustand 5.x |
| 네비게이션 | React Navigation 7.x |
| 오디오 재생 | react-native-track-player |
| 차트 | react-native-gifted-charts, react-native-svg |
| 캘린더 | react-native-calendars |
| 키보드 제어 | react-native-keyboard-controller |
| 파일 처리 | @react-native-documents/picker, react-native-blob-util |
| 폰트 | Pretendard |

---

## TypeScript 활용 포인트

### 1. 타입 정의 (`src/types/`)
도메인 엔티티 전반에 걸쳐 인터페이스를 정의했습니다. API 응답 → 화면 렌더링까지 타입이 일관되게 흐릅니다.

```ts
// src/types/index.ts
export interface Customer {
  idx: number;
  customerType: CustomerType;
  name: string;
  consultStatus: string;
  // ...
}
```

### 2. 네비게이션 타입 안전성 (`src/navigation/types.ts`)
React Navigation의 파라미터 타입을 선언해 스크린 간 데이터 전달 시 타입 오류를 컴파일 타임에 잡습니다.

```ts
export type MainStackParamList = {
  CustomerInfo: { customerType: CustomerType; idx: number };
  BoardInfo: { idx: number; title: string };
  // ...
};
```

### 3. Zustand 스토어 타입화 (`src/store/`)
스토어 상태와 액션을 인터페이스로 명시해 자동완성과 타입 검사가 동작합니다.

```ts
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}
```

### 4. API 레이어 제네릭 패턴 (`src/api/`)
공통 응답 구조를 제네릭으로 정의하고, 각 도메인 API 함수에서 재사용합니다.

```ts
interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T | null;
}

async function customerFetch<T>(url: string): Promise<T> { ... }
```

---

## 프로젝트 구조

```
src/
├── api/               # API 통신 — 제네릭 fetch 래퍼 + 도메인별 함수
│   ├── util.ts        # BASE_URL, 공통 유틸
│   ├── auth.ts        # 로그인 (데모: mock)
│   ├── customer.ts    # 고객 CRUD, 상담이력, DB통계
│   ├── board.ts       # 게시판, 댓글
│   ├── schedule.ts    # 일정 관리
│   └── ...
├── components/        # 재사용 UI 컴포넌트
├── constants/         # 타입화된 컬러/폰트 상수
├── hooks/             # 커스텀 훅 (네트워크 상태, 뒤로가기 등)
├── navigation/        # React Navigation 설정 + 타입 선언
│   ├── types.ts       # ParamList 타입 정의
│   ├── RootNavigator.tsx
│   ├── AuthNavigator.tsx
│   └── MainNavigator.tsx
├── screens/           # 화면 컴포넌트 (20+ 화면)
│   ├── auth/
│   ├── home/
│   ├── db/            # 고객 관리
│   ├── community/     # 게시판
│   ├── schedule/
│   ├── education/
│   └── ...
├── store/             # Zustand 상태 관리
│   ├── authStore.ts   # 인증 (AsyncStorage 영속)
│   └── configStore.ts # 런타임 앱 설정
├── types/             # TypeScript 인터페이스 / 타입 정의
└── utils/             # 유틸리티 함수
```

---

## 네비게이션 구조

3단계 네비게이션으로 인증 상태에 따라 분기합니다.

```
RootNavigator
├── IntroScreen                  ← 스플래시 (AsyncStorage 복원 대기)
├── AuthNavigator                ← 비로그인
│   ├── LoginScreen
│   └── FirstLoginScreen
└── MainNavigator                ← 로그인 후
    ├── TabNavigator (하단 탭 5개)
    │   ├── HomeScreen
    │   ├── DBScreen             — 고객 관리
    │   ├── ScheduleScreen       — 역할 기반 접근 (planCode C/D)
    │   ├── CommunityScreen      — 게시판
    │   └── MyPageScreen
    └── Stack Screens (20+ 전체화면 오버레이)
```

**역할 기반 접근 제어**: `user.planCode` 값에 따라 스케줄/통계 탭 노출 여부가 결정됩니다.

---

## 상태 관리

### authStore
`zustand/middleware/persist`로 AsyncStorage에 저장합니다.  
`isHydrated` 플래그로 복원 완료 전 화면 렌더링을 방지해 깜빡임을 없앴습니다.

| 필드 | 타입 | 설명 |
|---|---|---|
| `isAuthenticated` | `boolean` | 로그인 여부 |
| `user` | `User \| null` | 사용자 정보 |
| `token` | `string \| null` | JWT 토큰 |
| `isHydrated` | `boolean` | 복원 완료 여부 (저장 제외) |

---

## 데모 실행

```bash
yarn install
yarn start

# Android
yarn android

# iOS
yarn ios
```

| ID | PW | 역할 |
|---|---|---|
| `test` | `test` | FP — 일반 설계사 |
| `test2` | `test2` | BM — 지점장 (최초 로그인 플로우) |

---

## 주요 화면

| 영역 | 화면 | 설명 |
|---|---|---|
| 인증 | LoginScreen | 로그인, 최초 로그인 분기 처리 |
| 홈 | HomeScreen | 월별 통계 도넛 차트, 메뉴 바로가기 |
| 고객 관리 | AllList / CustomerInfo | 무한 스크롤, 검색/필터, 상담이력 |
| 게시판 | BoardList / BoardInfo | 목록/상세/댓글, 파일 첨부 |
| 스케줄 | ScheduleScreen | 캘린더 기반 일정 관리 |
| 교육 | VideoDetailScreen | YouTube 재생 + 백그라운드 오디오 |

---

## 공통 컴포넌트

| 컴포넌트 | 설명 |
|---|---|
| `Layout` | SafeAreaView 래퍼 |
| `CommonText / CommonInput / CommonButton` | 디자인 시스템 기본 단위 |
| `DonutChart` | SVG 기반 커스텀 차트 |
| `AudioPlayer` | 백그라운드 오디오 컨트롤 바 |
| `DaumAddressModal` | 다음 주소 검색 WebView 모달 |
| `FilterBottomSheet` | 목록 필터 바텀시트 |
| `NoInternetScreen` | 오프라인 감지 처리 |
