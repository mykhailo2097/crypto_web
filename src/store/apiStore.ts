import { create } from 'zustand'

type ApiMode = 'local' | 'production'

interface ApiStore {
  mode: ApiMode
  setMode: (mode: ApiMode) => void
  getBaseUrl: () => string
}

export const useApiStore = create<ApiStore>((set, get) => ({
  mode: 'production',
  setMode: (mode) => set({ mode }),
  getBaseUrl: () => {
    return get().mode === 'local' ? 'http://192.168.0.156:8000' : import.meta.env.VITE_API_URL
  },
}))
