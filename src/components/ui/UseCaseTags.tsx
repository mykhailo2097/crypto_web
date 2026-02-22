// Іконки для use cases — циклічно по індексу
const useCaseIcons = [
  // 📚 навчання
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>,
  // 🔬 дослідження
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v11m0 0a4 4 0 0 0 4 4h2a4 4 0 0 0 4-4V9M9 14H5a2 2 0 0 1-2-2V9m0 0h18" />
  </svg>,
  // 🔗 розподілені
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>,
  // 🎓 демонстрація
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>,
]

interface UseCaseTagsProps {
  useCases: string[]
  variant?: 'default' | 'purple'
}

export default function UseCaseTags({ useCases, variant = 'default' }: UseCaseTagsProps) {
  const tagStyle =
    variant === 'purple' ? 'bg-[#1e1b4b] text-indigo-300' : 'bg-dark-hover text-gray-300'

  return (
    <div className="border border-border-base rounded-xl p-4 flex flex-wrap gap-2">
      {useCases.map((uc, i) => (
        <span
          key={i}
          className={`flex items-center gap-2 text-sm px-4 py-1.5 rounded-full ${tagStyle}`}
        >
          <span className="opacity-70 flex-shrink-0">{useCaseIcons[i % useCaseIcons.length]}</span>
          {uc}
        </span>
      ))}
    </div>
  )
}
