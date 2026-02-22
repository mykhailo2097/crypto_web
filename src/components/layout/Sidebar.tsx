import { NavLink } from 'react-router-dom'
import ApiSwitcher from './ApiSwitcher'

const navItems = [
  {
    to: '/aes',
    label: 'AES-256-CBC',
    badge: 'CBC',
    sectionLabel: 'СИМЕТРИЧНЕ ШИФРУВАННЯ',
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
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
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    activeColor: 'text-purple-400 bg-affine-bg',
    inactiveColor: 'text-gray-400 hover:bg-dark-hover',
  },
]

export default function Sidebar() {
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

      {/* API Switcher */}
      <ApiSwitcher />
    </aside>
  )
}
