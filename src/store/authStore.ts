// src/store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, BrandConfig } from '../types';

interface AuthState {
  // State
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  brandConfig: BrandConfig | null;
  isHydrated: boolean;

  // Actions
  setAuth: (user: User, token: string, brandConfig: BrandConfig) => void;
  clearAuth: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      // ① 상태 (State) - 데이터 보관함
      isAuthenticated: false,
      user: null,
      token: null,
      brandConfig: null,
      isHydrated: false,

      // ② 액션 (Action) - 상태를 바꾸는 함수
      setAuth: (user, token, brandConfig) =>
        set({
          isAuthenticated: true,
          user,
          token,
          brandConfig,
        }),

      clearAuth: () =>
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          brandConfig: null,
        }),

      setHydrated: () => set({ isHydrated: true }),
    }),
    // ③ persist - AsyncStorage에 자동 저장
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
        brandConfig: state.brandConfig,
        // isHydrated는 저장 안 함 (매번 새로 계산)
      }),
      onRehydrateStorage: () => state => {
        state?.setHydrated(); // 복원 완료 시 isHydrated = true
      },
    },
  ),
);
