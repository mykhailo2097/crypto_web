interface FeatureListProps {
  features: string[]
}

export default function FeatureList({ features }: FeatureListProps) {
  return (
    <div className="border-t border-border-base pt-3 flex flex-col gap-2">
      {features.map((feature, i) => (
        <div key={i} className="flex items-center gap-2 text-gray-400 text-sm">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4ade80"
            strokeWidth="2"
            className="flex-shrink-0"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {feature}
        </div>
      ))}
    </div>
  )
}
