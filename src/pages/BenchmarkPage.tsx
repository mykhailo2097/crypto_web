import { useBenchmarkState } from '@/hooks/useBenchmarkState'
import BenchmarkConfig from '@/components/benchmark/BenchmarkConfig'
import BenchmarkProgress from '@/components/benchmark/BenchmarkProgress'
import ResultSection from '@/components/benchmark/ResultSection'
import type { BenchmarkStep } from '@/hooks/useBenchmarkState'

const STEP_ORDER: BenchmarkStep[] = ['aes-encrypt', 'affine-encrypt', 'aes-decrypt', 'affine-decrypt']

const ChartIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
)

export default function BenchmarkPage() {
  const state = useBenchmarkState()

  const completedSteps: BenchmarkStep[] = [
    state.aesBenchmarkEncrypt.isSuccess ? 'aes-encrypt' : null,
    state.affineBenchmarkEncrypt.isSuccess ? 'affine-encrypt' : null,
    state.aesBenchmarkDecrypt.isSuccess ? 'aes-decrypt' : null,
    state.affineBenchmarkDecrypt.isSuccess ? 'affine-decrypt' : null,
  ].filter(Boolean) as BenchmarkStep[]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-dark-hover border border-border-base rounded-lg flex items-center justify-center flex-shrink-0">
          <ChartIcon />
        </div>
        <div>
          <h1 className="text-xl font-bold">
            Криптографічний <span className="text-indigo-400">бенчмарк</span>
          </h1>
          <p className="text-gray-500 text-sm font-mono">
            // <span className="text-blue-400">AES-256-CBC</span> vs{' '}
            <span className="text-purple-400">Affine CRT</span> • {state.iterations} ітерацій
          </p>
        </div>
      </div>

      <BenchmarkConfig {...state} />

      {state.currentStep !== null && (
        <BenchmarkProgress currentStep={state.currentStep} doneSteps={completedSteps} />
      )}

      {state.hasEncryptResults && (
        <ResultSection
          title="Шифрування"
          subtitle="encrypt"
          lineData={state.encLineData}
          barData={state.encBarData}
          aesS={state.aesEncStats!}
          affineS={state.affineEncStats!}
          iterations={state.iterations}
        />
      )}
      {state.hasDecryptResults && (
        <ResultSection
          title="Дешифрування"
          subtitle="decrypt"
          lineData={state.decLineData}
          barData={state.decBarData}
          aesS={state.aesDecStats!}
          affineS={state.affineDecStats!}
          iterations={state.iterations}
        />
      )}
    </div>
  )
}
