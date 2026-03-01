import React from 'react'

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  sublabel?: string
  footnote?: string
  theme?: 'default' | 'purple' | 'red'
}

const themeStyles: Record<string, string> = {
  default: 'bg-dark-card border-border-base',
  purple: 'border-border-purple bg-stat-purple',
  red: 'border-border-red bg-stat-red',
}

export default function StatCard({
  icon,
  label,
  value,
  sublabel,
  footnote,
  theme = 'default',
}: StatCardProps) {
  return (
    <div className={`border rounded-xl p-4 flex flex-col gap-2 ${themeStyles[theme]}`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-gray-500 text-[10px] font-semibold tracking-widest uppercase">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <div className="text-[32px] font-bold font-mono leading-none">{value}</div>
        {sublabel && <span className="text-gray-500 text-sm">{sublabel}</span>}
      </div>
      {footnote && <div className="text-gray-600 text-xs">{footnote}</div>}
    </div>
  )
}
