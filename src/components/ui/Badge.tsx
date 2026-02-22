interface BadgeProps {
  children: React.ReactNode
  variant?: 'blue' | 'green' | 'orange' | 'purple' | 'indigo' | 'red'
  className?: string
}

const variantStyles: Record<string, string> = {
  blue: 'bg-aes-bg text-blue-400',
  green: 'bg-military-bg text-green-400',
  orange: 'bg-[#422006] text-orange-400',
  purple: 'bg-affine-bg text-purple-400',
  indigo: 'bg-[#1e1b4b] text-indigo-400',
  red: 'bg-[#450a0a] text-red-400',
}

export default function Badge({ children, variant = 'blue', className = '' }: BadgeProps) {
  return (
    <span
      className={`text-xs px-3 py-1 rounded font-semibold ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
