# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start Metro bundler
yarn start

# Run on Android
yarn android

# Run on iOS
yarn ios

# Lint
yarn lint

# Run tests
yarn test

# Run a single test file
yarn test path/to/file.test.ts
```

Node.js >= 22.11.0 is required.

## Architecture Overview

This is a React Native 0.84 / React 19 app for insurance agents (보험설계사). It uses TypeScript 5.8 throughout.

### Navigation

Three-layer navigation structure:

1. **RootNavigator** — branches based on `useAuthStore().isAuthenticated` (after hydration)
2. **AuthNavigator** — pre-login: `LoginScreen` → `FirstLoginScreen`
3. **MainNavigator** — post-login: bottom tab bar + stack overlays
   - 5 tabs: Home, DB (고객관리), Schedule (스케줄, role > 2 only), Community (커뮤니티), MyPage (전체메뉴)
   - 20+ stack screens rendered as full-screen overlays

Navigation types are declared in `src/navigation/types.ts`. Screen props use `NativeStackScreenProps<ParamList, 'ScreenName'>`.

### State Management

Zustand stores in `src/store/`:

- **authStore** — persists to AsyncStorage via `zustand/middleware/persist`. Contains `isAuthenticated`, `user`, `token`, `brandConfig`, and `isHydrated`. The app waits for `isHydrated` before rendering to prevent flicker. `partialize()` excludes `isHydrated` from persistence.
- **configStore** — holds runtime `AppConfig`, not persisted.

`src/store/index.ts` re-exports stores.

### API Layer

`src/api/util.ts` exports `BASE_URL` (`https://cnj0005.cafe24.com`).

`src/api/auth.ts` contains `loginApi()`. Currently uses mock data for test accounts (`test` / `test2`). Real API call is stubbed with a TODO comment.

### Key Shared Components

- `Layout` — standard screen wrapper
- `MainHeader` / `SubHeader` — two header variants
- `CommonText`, `CommonInput`, `CommonButton` — base UI primitives
- `NoInternetScreen` — shown by `useNetworkStatus` hook when offline

### Styling Conventions

- Colors defined in `src/constants/colors.ts`
- Pretendard font family defined in `src/constants/fonts.ts`; font scaling is disabled globally in `index.js`
- Component styles use `StyleSheet.create()`

### Audio

`react-native-track-player` (nightly build) is registered via `PlaybackService` in `index.js`. The service handles background playback.

### Role-Based Access

`user.role` (number) controls UI visibility. The Schedule tab is only shown when `role > 2`.

## Demo Accounts

- `test` / `test`
- `test2` / `test2`
