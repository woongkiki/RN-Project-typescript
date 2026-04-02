// src/store/configStore.ts
import { create } from 'zustand';
import type { AppConfig } from '../types/auth';

interface ConfigState {
  // State
  config: AppConfig | null;

  // Actions
  setConfig: (config: AppConfig) => void;
  clearConfig: () => void;
}

export const useConfigStore = create<ConfigState>()(set => ({
  config: null,

  setConfig: config => set({ config }),

  clearConfig: () => set({ config: null }),
}));
