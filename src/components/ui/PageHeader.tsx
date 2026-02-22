import React from 'react'

interface PageHeaderProps {
  icon?: React.ReactNode
  title: React.ReactNode
  subtitle: string
  badges?: React.ReactNode
}

export default function PageHeader({ icon, title, subtitle, badges }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 text-4xl font-bold">
        {icon}
        <span>{title}</span>
      </div>
      <div className="text-gray-500 text-sm mt-2 font-mono">{subtitle}</div>
      {badges && <div className="flex items-center gap-2 mt-3 flex-wrap">{badges}</div>}
    </div>
  )
}
