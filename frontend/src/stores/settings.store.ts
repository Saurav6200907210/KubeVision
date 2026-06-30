import { create } from 'zustand';

interface SettingsState {
  theme: 'dark' | 'light';
  refreshInterval: number;
  defaultNamespace: string;
  setSettings: (settings: Partial<SettingsState>) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'light', // match default light
  refreshInterval: 15,
  defaultNamespace: 'default',
  setSettings: (settings) => set((state) => ({ ...state, ...settings })),
}));
