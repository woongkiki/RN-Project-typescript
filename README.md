# React Native - TypeScript
React Native + TypeScript로 개발되었으며, 역할 기반 접근 제어, 3단계 네비게이션 구조, Zustand 상태 관리 등을 적용했습니다.

> 이 레포지토리는 포트폴리오 목적으로 공개한 버전입니다.  
> API 엔드포인트는 플레이스홀더로 대체되어 있으며, 데모 계정(`test / test`)으로 앱 흐름을 확인할 수 있습니다.

---

## 목차

1. [기술 스택](#기술-스택)
2. [프로젝트 구조](#프로젝트-구조)
3. [시작하기](#시작하기)
4. [네비게이션 구조](#네비게이션-구조)
5. [상태 관리](#상태-관리)
6. [API 레이어](#api-레이어)
7. [화면 목록](#화면-목록)
8. [공통 컴포넌트](#공통-컴포넌트)
9. [스타일 컨벤션](#스타일-컨벤션)

---

## 기술 스택

| 항목 | 버전 |
|---|---|
| React Native | 0.84.1 |
| React | 19.2.3 |
| TypeScript | 5.8.x |
| Node.js | >= 22.11.0 |
| 상태 관리 | Zustand 5.x |
| 네비게이션 | React Navigation 7.x |
| 오디오 재생 | react-native-track-player (nightly) |
| 파일 첨부 | @react-native-documents/picker |
| 파일 다운로드 | react-native-blob-util |
| 키보드 제어 | react-native-keyboard-controller |
| 차트 | react-native-gifted-charts, react-native-svg |
| 캘린더 | react-native-calendars |
| 폰트 | Pretendard |

---

## 프로젝트 구조

```
src/
├── api/               # API 통신 함수 모음
│   ├── util.ts        # BASE_URL 상수 및 공통 유틸
│   ├── auth.ts        # 로그인 API (데모: mockLogin)
│   ├── customer.ts    # 고객 목록/상세/상태변경/이력/DB통계
│   ├── board.ts       # 게시판 목록/상세/댓글
│   ├── notification.ts# 알림 API
│   ├── schedule.ts    # 스케줄 API
│   ├── adjustment.ts  # 정산 API
│   ├── evaluation.ts  # 평가 API
│   └── plan.ts        # 요금제별 메뉴 코드 조회
├── components/        # 공유 컴포넌트
├── constants/         # colors.ts, fonts.ts
├── hooks/             # 커스텀 훅
├── navigation/        # 네비게이션 설정 및 타입
├── screens/           # 화면 컴포넌트
│   ├── auth/          # 로그인, 최초 로그인, 인트로
│   ├── home/          # 홈, 메뉴설정
│   ├── db/            # DB 리스트, 고객 상세, 진행업무 등
│   ├── community/     # 커뮤니티, 게시판
│   ├── schedule/      # 스케줄
│   ├── education/     # 교육 영상
│   ├── seminar/       # 세미나
│   ├── adjust/        # 정산
│   ├── statistics/    # 통계/분석
│   ├── notification/  # 알림
│   ├── mypage/        # 마이페이지
│   └── product/       # 상품 상세
├── store/             # Zustand 스토어
│   ├── authStore.ts   # 인증 상태 (AsyncStorage 영속)
│   └── configStore.ts # 런타임 앱 설정
├── types/             # TypeScript 타입 정의
├── theme/             # 테마 설정
└── utils/             # 유틸리티 함수
```

---

## 시작하기

```bash
# 의존성 설치
yarn install

# Metro 번들러 시작
yarn start

# Android 실행
yarn android

# iOS 실행
yarn ios

# 린트
yarn lint

# 테스트
yarn test
```

**데모 계정**

| ID | PW | 역할 |
|---|---|---|
| test | test | FP (일반 설계사) |
| test2 | test2 | BM (지점장, 최초 로그인 플로우) |

---

## 네비게이션 구조

앱은 3단계 네비게이션 구조로 구성됩니다.

```
RootNavigator
├── IntroScreen              ← 앱 최초 진입 (로고 + 로딩바, ~2초)
├── AuthNavigator            ← 비로그인 상태
│   ├── LoginScreen
│   └── FirstLoginScreen
└── MainNavigator            ← 로그인 상태
    ├── TabNavigator (하단 탭)
    │   ├── Home             — 홈 (도넛 차트, 메뉴 바로가기, 게시판 미리보기)
    │   ├── Tab1             — DB 리스트 (고객 관리)
    │   ├── Schedule         — 스케줄 (planCode C/D 요금제만 노출)
    │   ├── Tab2             — 커뮤니티 (일반/자유 게시판)
    │   └── MyPage           — 전체메뉴 (마이페이지)
    └── Stack Screens (전체화면 오버레이)
        ├── PossibleList     — 가망 고객 리스트
        ├── ProgressList     — 상담 상태별 진행 중인 업무
        ├── AllList          — 전체 고객 리스트
        ├── CustomerInfo     — 고객 상세 / 상담이력 / 상태변경이력
        ├── BoardList        — 일반 게시판
        ├── FreeBoardList    — 자유 게시판
        ├── BoardInfo        — 게시글 상세 + 댓글
        ├── BoardForm        — 게시글 작성 (파일첨부)
        ├── ScheduleForm     — 일정 등록/수정
        ├── EducationScreen  — 교육 영상 목록
        ├── VideoDetailScreen— 교육 영상 상세
        ├── SeminarScreen    — 세미나 목록
        ├── SeminarInfo      — 세미나 상세
        ├── Adjustment       — 정산
        ├── StatScreen       — 통계/분석
        ├── NotificationScreen— 알림 목록
        ├── MenuSetting      — 홈 메뉴 설정
        ├── MyInfoUpdate     — 내 정보 수정
        └── ProductDetail    — 상품 상세
```

### IntroScreen 동작

`RootNavigator`는 앱 시작 시 Zustand 스토어의 `isHydrated` 상태를 확인합니다. AsyncStorage 복원이 완료된 뒤 2초 동안 `IntroScreen`을 표시하고, 이후 `isAuthenticated` 값에 따라 `AuthNavigator` 또는 `MainNavigator`로 분기합니다.

---

## 상태 관리

### authStore (`src/store/authStore.ts`)

AsyncStorage에 `persist`로 저장되며, 앱 재시작 시 자동 복원됩니다.

| 필드 | 설명 |
|---|---|
| `isAuthenticated` | 로그인 여부 |
| `user` | 로그인한 사용자 정보 (idx, name, role 등) |
| `token` | JWT Bearer 토큰 |
| `office` | 소속 영업점 정보 (planCode, planIdx 포함) |
| `isHydrated` | AsyncStorage 복원 완료 여부 (저장 제외) |

주요 액션: `setAuth`, `updateUser`, `clearAuth`, `setHydrated`

### configStore (`src/store/configStore.ts`)

런타임 앱 설정(`AppConfig`)을 보관하며, 재시작 시 저장되지 않습니다.

---

## API 레이어

모든 API 요청에는 `Authorization: Bearer {token}` 및 `X-App-Token: {token}` 헤더가 포함됩니다.  
이 포트폴리오 버전에서는 실서버 URL이 플레이스홀더로 대체되어 있으며, 로그인은 mock 데이터로 동작합니다.

### 주요 API 모듈

| 파일 | 주요 기능 |
|---|---|
| `auth.ts` | 로그인 (`loginApi`) |
| `customer.ts` | 고객 목록/페이징, 상세, 상담 상태 변경, 상담이력, 상태변경이력, 월별 DB통계 |
| `board.ts` | 게시글 목록/상세/작성/삭제, 댓글 목록/작성/삭제 |
| `notification.ts` | 알림 목록, 읽음 처리 |
| `schedule.ts` | 일정 목록/등록/수정/삭제 |
| `adjustment.ts` | 정산 내역 |
| `evaluation.ts` | 평가 데이터 |
| `plan.ts` | 요금제별 허용 메뉴 코드 조회 |

---

## 화면 목록

### 인증

| 화면 | 설명 |
|---|---|
| `IntroScreen` | 앱 시작 로고 화면 (Animated 로딩바 2초) |
| `LoginScreen` | 아이디/비밀번호 로그인 |
| `FirstLoginScreen` | 최초 로그인 시 추가 정보 입력 |

### 홈

| 화면 | 설명 |
|---|---|
| `HomeScreen` | 월별 DB 통계 도넛 차트, 기능 메뉴 바로가기, 최근 게시글 미리보기 |
| `MenuSetting` | 홈 화면 메뉴 항목 커스터마이즈 (드래그 정렬) |

### DB (고객 관리)

| 화면 | 설명 |
|---|---|
| `DBScreen` | DB 진행률, 업무 현황 카운트, 변경 이력 테이블 |
| `AllList` | 전체 고객 목록 (무한 스크롤 페이징, 검색, 필터) |
| `ProgressList` | 상담 상태별 진행 중인 업무 (카테고리 탭 + 무한 스크롤) |
| `PossibleList` | 가망 고객 리스트 |
| `CustomerInfo` | 고객 상세 정보, 상담 이력 등록, 상담 상태 변경 및 상태 변경 이력 |

### 커뮤니티

| 화면 | 설명 |
|---|---|
| `CommunityScreen` | 신규 알림 배너, 일반/자유 게시판 미리보기 |
| `BoardList` | 일반 게시판 목록 (페이징) |
| `FreeBoardList` | 자유 게시판 목록 (페이징) |
| `BoardInfo` | 게시글 상세 + 댓글 목록/작성/삭제 |
| `BoardForm` | 게시글 작성 (파일 첨부 포함) |

### 스케줄 (planCode C/D)

| 화면 | 설명 |
|---|---|
| `ScheduleScreen` | 달력 기반 일정 목록 |
| `ScheduleForm` | 일정 등록/수정 (고객 연결, 주소 검색) |

### 교육

| 화면 | 설명 |
|---|---|
| `EducationScreen` | 교육 영상 탭별 목록 |
| `VideoDetailScreen` | YouTube/로컬 영상 재생 (백그라운드 오디오 포함) |

### 기타

| 화면 | 설명 |
|---|---|
| `SeminarScreen` | 세미나 목록 |
| `SeminarInfo` | 세미나 상세 |
| `Adjustment` | 정산 내역 |
| `StatScreen` | 통계/분석 (planCode C/D) |
| `NotificationScreen` | 알림 목록, 읽음 처리 |
| `MyPageScreen` | 내 정보 확인, 로그아웃 |
| `MyInfoUpdate` | 내 정보 수정 |

---

## 공통 컴포넌트

| 컴포넌트 | 설명 |
|---|---|
| `Layout` | 화면 래퍼 (SafeAreaView, 스크롤 옵션) |
| `MainHeader` | 메인 탭 헤더 (로고, 우측 액션 슬롯) |
| `SubHeader` | 스택 화면 헤더 (뒤로가기 버튼) |
| `CommonText` | Pretendard 폰트 적용 텍스트 |
| `CommonInput` | 공통 입력 필드 |
| `CommonButton` | 공통 버튼 |
| `CommonConfirmModal` | 확인/취소 다이얼로그 |
| `ClientBox` | 고객 목록 아이템 카드 |
| `BoardCommon` | 게시글 목록 아이템 |
| `CategoryButton` | 카테고리 필터 버튼 (카운트 뱃지 포함) |
| `DonutChart` | SVG 기반 도넛 차트 (percent/fraction 모드) |
| `AudioPlayer` | 백그라운드 오디오 재생 컨트롤 바 |
| `NoInternetScreen` | 오프라인 감지 안내 화면 |
| `CustomerSearchModal` | 고객 검색 모달 |
| `DaumAddressModal` | 다음 주소 검색 WebView 모달 |
| `FilterBottomSheet` | 목록 필터 바텀시트 |

---

## 스타일 컨벤션

- **색상**: `src/constants/colors.ts`의 토큰 사용 (`colors.primary`, `colors.gray10` 등)
- **폰트**: `src/constants/fonts.ts`의 스프레드 사용 (`fonts.regular`, `fonts.semiBold` 등)
  - 전역 폰트 스케일 비활성화: `index.js`에서 `Text.defaultProps.allowFontScaling = false` 설정
- **스타일**: `StyleSheet.create()` 원칙
- **그림자**: iOS `shadow*` 속성과 Android `elevation` 병행 적용
