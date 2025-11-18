import { create } from 'zustand'

interface UIState {
  language: 'th' | 'en' | 'zh'
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  setLanguage: (language: 'th' | 'en' | 'zh') => void
  setTheme: (theme: 'light' | 'dark') => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
}

export const useUIStore = create<UIState>((set) => ({
  language: 'th',
  theme: 'light',
  sidebarOpen: false,
  
  setLanguage: (language) => set({ language }),
  setTheme: (theme) => set({ theme }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}))

