import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ApiMode = 'local' | 'production'

interface ApiStore {
  mode: ApiMode
  setMode: (mode: ApiMode) => void
  getBaseUrl: () => string
}

export const useApiStore = create<ApiStore>()(
  persist(
    (set, get) => ({
      mode: 'production',
      setMode: (mode) => set({ mode }),
      getBaseUrl: () => {
        return get().mode === 'local'
          ? import.meta.env.VITE_LOCAL_API_URL ?? 'http://localhost:8000'
          : import.meta.env.VITE_API_URL
      },
    }),
    { name: 'crypto-api-mode' },
  ),
)
