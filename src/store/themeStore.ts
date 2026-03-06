import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'light'

interface ThemeStore {
  theme: Theme
  toggle: () => void
}

function applyTheme(t: Theme) {
  document.documentElement.setAttribute('data-theme', t)
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'light',
      toggle: () => {
        const next = get().theme === 'light' ? 'light' : 'light'
        set({ theme: next })
        applyTheme(next)
      },
    }),
    {
      name: 'crypto-theme',
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme)
      },
    },
  ),
)

// Sync init — prevents flash on page load
try {
  const raw = localStorage.getItem('crypto-theme')
  if (raw) {
    const parsed = JSON.parse(raw) as { state?: { theme?: Theme } }
    applyTheme(parsed.state?.theme ?? 'light')
  } else {
    applyTheme('light')
  }
} catch {
  applyTheme('light')
}
