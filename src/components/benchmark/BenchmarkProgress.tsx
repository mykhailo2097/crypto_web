import type { BenchmarkStep } from '@/hooks/useBenchmarkState'

type StepDef = {
  key: BenchmarkStep
  label: string
  color: string
  bg: string
  border: string
}

const STEPS: StepDef[] = [
  { key: 'aes-encrypt',    label: 'AES encrypt',    color: 'text-blue-400',   bg: 'bg-aes-bg',    border: 'border-border-blue' },
  { key: 'affine-encrypt', label: 'Affine encrypt', color: 'text-purple-400', bg: 'bg-affine-bg', border: 'border-affine-border' },
  { key: 'aes-decrypt',    label: 'AES decrypt',    color: 'text-blue-400',   bg: 'bg-aes-bg',    border: 'border-border-blue' },
  { key: 'affine-decrypt', label: 'Affine decrypt', color: 'text-purple-400', bg: 'bg-affine-bg', border: 'border-affine-border' },
]

function SpinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

type Props = {
  currentStep: BenchmarkStep
  doneSteps: BenchmarkStep[]
}

export default function BenchmarkProgress({ currentStep, doneSteps }: Props) {
  return (
    <div className="bg-dark-card border border-border-base rounded-xl p-4 flex flex-col gap-3">
      <span className="text-[10px] text-gray-500 font-semibold tracking-widest">
        ПРОГРЕС БЕНЧМАРКУ
      </span>
      <div className="flex items-center gap-2">
        {STEPS.map((step, idx) => {
          const isDone = doneSteps.includes(step.key)
          const isActive = currentStep === step.key
          const isDelay = currentStep === 'delay' && doneSteps.includes(step.key) && !doneSteps.includes(STEPS[idx + 1]?.key ?? null)
          const isPending = !isDone && !isActive

          return (
            <div key={step.key} className="flex items-center gap-2 flex-1">
              <div
                className={`flex items-center gap-2 flex-1 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                  isDone
                    ? `${step.bg} ${step.border} ${step.color}`
                    : isActive
                    ? `${step.bg} ${step.border} ${step.color}`
                    : 'border-border-base text-gray-600'
                }`}
              >
                <span className={`flex-shrink-0 ${isDone ? 'text-green-400' : isActive ? step.color : 'text-gray-600'}`}>
                  {isDone ? <CheckIcon /> : isActive ? <SpinIcon /> : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                  )}
                </span>
                <span className="truncate">{step.label}</span>
              </div>

              {/* Connector arrow between steps */}
              {idx < STEPS.length - 1 && (
                <span className={`text-xs flex-shrink-0 transition-colors ${
                  isDelay ? 'text-indigo-400 animate-pulse' : isDone ? 'text-gray-400' : 'text-gray-700'
                }`}>
                  {isDelay ? '⏱' : '→'}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
