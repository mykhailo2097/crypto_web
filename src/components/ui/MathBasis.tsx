// Унікальні іконки та кольори для кожного пункту математичної основи
const mathItems = [
  {
    symbol: '∑',
    color: '#a855f7',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
        <path d="M18 20H6l6-8-6-8h12" />
      </svg>
    ),
  },
  {
    symbol: 'f',
    color: '#60a5fa',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
        <path d="M18 20V10" />
        <path d="M12 20V4" />
        <path d="M6 20v-6" />
      </svg>
    ),
  },
  {
    symbol: '∩',
    color: '#4ade80',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
        <path d="M5 7c0 6.627 3.134 12 7 12s7-5.373 7-12" />
        <path d="M5 7H3m2 0h14m0 0h2" />
      </svg>
    ),
  },
  {
    symbol: '≡',
    color: '#fbbf24',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
        <line x1="4" y1="8" x2="20" y2="8" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="16" x2="20" y2="16" />
      </svg>
    ),
  },
]

interface MathBasisProps {
  items: string[]
}

export default function MathBasis({ items }: MathBasisProps) {
  return (
    <div className="border border-affine-border rounded-xl p-5 bg-gradient-to-br from-dark-deep to-dark-card">
      <p className="text-purple-400 text-sm font-semibold mb-3 flex items-center gap-2">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
        Математична основа
      </p>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item, i) => {
          const meta = mathItems[i % mathItems.length]
          return (
            <div
              key={i}
              className="bg-dark-input px-3 py-2.5 rounded-lg text-gray-300 text-sm flex items-center gap-2.5"
            >
              {meta.icon}
              {item}
            </div>
          )
        })}
      </div>
    </div>
  )
}
