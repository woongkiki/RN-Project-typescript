import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Office } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  office: Office | null;
  isHydrated: boolean;

  setAuth: (user: User, token: string, office: Office) => void;
  updateUser: (updates: Partial<User>) => void;
  clearAuth: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      isAuthenticated: false,
      user: null,
      token: null,
      office: null,
      isHydrated: false,

      setAuth: (user, token, office) =>
        set({ isAuthenticated: true, user, token, office }),

      updateUser: updates =>
        set(state => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      clearAuth: () =>
        set({ isAuthenticated: false, user: null, token: null, office: null }),

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
        office: state.office,
      }),
      onRehydrateStorage: () => state => {
        state?.setHydrated();
      },
    },
  ),
);
