import { NavLink } from 'react-router-dom'
import ApiSwitcher from './ApiSwitcher'
import { useThemeStore } from '@store/themeStore'

const SunIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
)

const MoonIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const navItems = [
  {
    to: '/aes',
    label: 'AES-256-CBC',
    badge: 'CBC',
    sectionLabel: 'СИМЕТРИЧНЕ ШИФРУВАННЯ',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    activeColor: 'text-blue-400 bg-aes-bg',
    inactiveColor: 'text-gray-400 hover:bg-dark-hover',
  },
  {
    to: '/affine',
    label: 'Affine CRT',
    sectionLabel: 'ЗАЛИШКОВІ КЛАСИ',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    activeColor: 'text-purple-400 bg-affine-bg',
    inactiveColor: 'text-gray-400 hover:bg-dark-hover',
  },
  {
    to: '/benchmark',
    label: 'Крипто бенчмарк',
    sectionLabel: 'АНАЛІЗ',
    badge: undefined,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    activeColor: 'text-indigo-400 bg-indigo-900/30',
    inactiveColor: 'text-gray-400 hover:bg-dark-hover',
  },
]

export default function Sidebar() {
  const { theme, toggle } = useThemeStore()
  const isLight = theme === 'light'

  return (
    <aside className="w-60 bg-dark-sidebar border-r border-border-base flex flex-col gap-6 px-4 py-6 flex-shrink-0 h-screen overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <div>
          <div className="text-sm font-bold">CryptoVault</div>
          <div className="text-[10px] text-gray-500">v1.0 • WEB CRYPTO SUITE</div>
        </div>
      </div>

      {/* Nav */}
      {navItems.map((item) => (
        <div key={item.to} className="flex flex-col gap-2">
          <span className="text-[10px] text-gray-500 font-semibold tracking-widest px-2">
            {item.sectionLabel}
          </span>
          <NavLink
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                isActive ? item.activeColor : item.inactiveColor
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-aes-bg text-blue-400 text-[10px] px-1.5 py-0.5 rounded">
                {item.badge}
              </span>
            )}
          </NavLink>
        </div>
      ))}

      {/* Theme toggle */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] text-gray-500 font-semibold tracking-widest px-2">ТЕМА</span>
        <button
          onClick={toggle}
          className="flex items-center justify-between px-3 py-2 rounded-lg border border-border-base hover:bg-dark-hover transition-all w-full"
        >
          <span className="flex items-center gap-2 text-xs font-medium text-gray-400">
            {isLight ? <SunIcon /> : <MoonIcon />}
            {isLight ? 'Світла' : 'Темна'}
          </span>
          <div className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${isLight ? 'bg-blue-500' : 'bg-gray-600'}`}>
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isLight ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </div>
        </button>
      </div>

      {/* API Switcher */}
      <ApiSwitcher />
    </aside>
  )
}
