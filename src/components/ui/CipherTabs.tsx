import { useState } from 'react'

interface Tab {
  label: string
  icon?: React.ReactNode
  content: React.ReactNode
}

interface CipherTabsProps {
  tabs: Tab[]
  accentColor?: 'blue' | 'purple'
}

export default function CipherTabs({ tabs, accentColor = 'blue' }: CipherTabsProps) {
  const [active, setActive] = useState(0)

  const activeStyle =
    accentColor === 'purple'
      ? 'bg-gradient-to-r from-purple-700 to-violet-600 text-white'
      : 'bg-blue-600 text-white'

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              active === i
                ? activeStyle
                : 'bg-dark-hover text-gray-400 border border-border-base hover:text-gray-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div>{tabs[active].content}</div>
    </div>
  )
}
