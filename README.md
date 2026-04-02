# InsuranceCNJ

보험 설계사용 업무 지원 앱 (React Native)

## 프로젝트 구조

```
src/
├── screens/
│   ├── auth/        ← 로그인 화면
│   ├── home/        ← 홈 화면
│   ├── tab1/        ← Tab1 화면
│   ├── tab2/        ← Tab2 화면
│   └── mypage/      ← 마이페이지 화면
├── navigation/      ← 네비게이션 구조
├── context/         ← 로그인 후 브랜드 config, 인증 상태 전역 관리
├── api/             ← 서버 통신 (로그인 후 받은 API URL 기반)
├── hooks/           ← 공통 커스텀 훅
├── components/      ← 공통 UI 컴포넌트
├── theme/           ← 테마 타입 및 기본값 정의
└── types/           ← 공통 타입 정의
```

## 앱 플로우

```
앱 실행
↓
로그인 화면 (auth)
↓ 로그인 성공 → 서버에서 { theme, apiUrl, dbKey } 수신
↓
AuthContext에 저장
↓
Tab 네비게이션 (home / tab1 / tab2 / mypage)
↓
모든 화면에서 Context로 테마 / API 접근
```

## 기술 스택

| 항목          | 내용                                |
| ------------- | ----------------------------------- |
| Framework     | React Native 0.84.1                 |
| Language      | TypeScript                          |
| Navigation    | React Navigation 7                  |
| 상태 관리     | Zustand + Context API               |
| 오디오 재생   | react-native-track-player (nightly) |
| 파일 첨부     | @react-native-documents/picker      |
| 파일 다운로드 | react-native-blob-util              |
| 키보드 제어   | react-native-keyboard-controller    |
| 차트          | react-native-gifted-charts          |

## 환경 설정

- Node.js >= 22.11.0
- React Native CLI
- Android Studio / Xcode
