import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  
  isAiAssistantOpen: boolean;
  setAiAssistantOpen: (open: boolean) => void;

  refreshInterval: number; // in seconds
  setRefreshInterval: (interval: number) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      
      isSidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
      
      isCommandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
      
      isAiAssistantOpen: false,
      setAiAssistantOpen: (open) => set({ isAiAssistantOpen: open }),

      refreshInterval: 15,
      setRefreshInterval: (interval) => set({ refreshInterval: interval }),
    }),
    {
      name: 'kubevision-ui-storage',
      partialize: (state) => ({ 
        theme: state.theme, 
        isSidebarCollapsed: state.isSidebarCollapsed,
        refreshInterval: state.refreshInterval 
      }), // only persist these
    }
  )
);
