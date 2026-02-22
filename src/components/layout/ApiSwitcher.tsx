import { useApiStore } from '@store/apiStore.ts'

interface ApiOption {
  mode: 'local' | 'production'
  label: string
  url: string
  icon: React.ReactNode
  activeStyle: string
  activeLabelStyle: string
  activeUrlStyle: string
  activeDot: boolean
}

const options: ApiOption[] = [
  {
    mode: 'local',
    label: 'Локальний',
    url: 'localhost:8000',
    icon: (
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </svg>
    ),
    activeStyle: 'border-green-800 bg-[#052e16]',
    activeLabelStyle: 'text-green-400',
    activeUrlStyle: 'text-green-600',
    activeDot: true,
  },
  {
    mode: 'production',
    label: 'Віддалений',
    url: 'api.server.com',
    icon: (
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    activeStyle: 'border-blue-700 bg-aes-bg',
    activeLabelStyle: 'text-blue-400',
    activeUrlStyle: 'text-gray-500',
    activeDot: true,
  },
]

export default function ApiSwitcher() {
  const { mode, setMode } = useApiStore()

  return (
    <div className="mt-auto flex flex-col gap-2">
      <span className="text-xs text-gray-500 font-semibold tracking-widest px-2">API СЕРВЕР</span>
      <div className="flex flex-col gap-1.5">
        {options.map((opt) => {
          const isActive = mode === opt.mode
          return (
            <button
              key={opt.mode}
              onClick={() => setMode(opt.mode)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-all text-left w-full ${
                isActive ? opt.activeStyle : 'border-border-base bg-transparent hover:bg-dark-hover'
              }`}
            >
              <span className={isActive ? opt.activeLabelStyle : 'text-gray-500'}>{opt.icon}</span>
              <div className="flex-1 min-w-0">
                <div
                  className={`text-xs font-medium ${isActive ? opt.activeLabelStyle : 'text-gray-400'}`}
                >
                  {opt.label}
                </div>
                <div
                  className={`text-[10px] font-mono truncate ${isActive ? opt.activeUrlStyle : 'text-gray-600'}`}
                >
                  {opt.url}
                </div>
              </div>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_5px_#4ade80] flex-shrink-0" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
