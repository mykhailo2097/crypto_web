interface FormulaBoxProps {
  title: string
  formula: string
  hint?: string
  accentColor?: 'purple' | 'blue'
  icon?: React.ReactNode
}

const accentStyles: Record<string, string> = {
  purple: 'border-purple-600',
  blue: 'border-blue-600',
}

const titleStyles: Record<string, string> = {
  purple: 'text-purple-400',
  blue: 'text-blue-400',
}

export default function FormulaBox({
  title,
  formula,
  hint,
  accentColor = 'blue',
  icon,
}: FormulaBoxProps) {
  return (
    <div
      className={`bg-dark-input border-l-4 ${accentStyles[accentColor]} rounded-lg p-4 flex flex-col gap-2`}
    >
      <p className={`text-sm font-semibold flex items-center gap-2 ${titleStyles[accentColor]}`}>
        {icon}
        {title}
      </p>
      <p className="text-gray-300 text-sm font-mono">{formula}</p>
      {hint && <p className="text-gray-600 text-xs font-mono">{hint}</p>}
    </div>
  )
}
