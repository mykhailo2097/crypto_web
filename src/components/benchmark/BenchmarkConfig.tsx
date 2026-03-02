import { extractError } from '@/utils/benchmark'
import type { BenchmarkState } from '@/hooks/useBenchmarkState'

const KeyIcon = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
)

const SpinIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
)

const ChartIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
)

export default function BenchmarkConfig({
  iterations, setIterations,
  text, setText,
  aesKey, setAesKey,
  manualP, setManualP,
  autoGenCount, setAutoGenCount,
  minP, setMinP,
  maxP, setMaxP,
  pKeys, aKeys, sKeys,
  generateAesKey,
  generateAffineParams,
  aesBenchmarkEncrypt,
  affineBenchmarkEncrypt,
  aesBenchmarkDecrypt,
  affineBenchmarkDecrypt,
  isRunning,
  canRun,
  handleRun,
}: BenchmarkState) {
  return (
    <div className="bg-dark-card border border-border-base rounded-xl p-5 flex flex-col gap-5">
      {/* Text + iterations */}
      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-[10px] text-gray-500 font-semibold tracking-widest">
            ТЕКСТ ДЛЯ БЕНЧМАРКУ
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            className="w-full bg-dark-input border border-border-base rounded-lg px-3 py-2.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-border-blue transition-colors resize-none"
          />
        </div>
        <div className="flex flex-col gap-2 w-36 shrink-0">
          <label className="text-[10px] text-gray-500 font-semibold tracking-widest">ІТЕРАЦІЙ</label>
          <input
            type="number"
            value={iterations}
            min={1}
            max={10000}
            onChange={(e) => setIterations(Math.max(1, Math.min(10000, Number(e.target.value))))}
            className="w-full bg-dark-input border border-border-base rounded-lg px-3 py-2.5 text-sm font-mono text-gray-300 focus:outline-none focus:border-border-blue transition-colors"
          />
          <span className="text-[10px] text-gray-600">макс. 10 000</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* AES key */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-blue-400 font-semibold tracking-widest flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            AES-256 КЛЮЧ
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={aesKey}
              onChange={(e) => setAesKey(e.target.value)}
              placeholder="Hex або Base64..."
              className="flex-1 min-w-0 bg-dark-input border border-border-base rounded-lg px-3 py-2 text-xs font-mono text-gray-300 placeholder-gray-600 focus:outline-none focus:border-border-blue transition-colors"
            />
            <button
              onClick={() => generateAesKey.mutate()}
              disabled={generateAesKey.isPending}
              className="flex items-center gap-1.5 px-3 py-2 bg-aes-bg border border-border-blue text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-900/40 transition-all disabled:opacity-50 whitespace-nowrap"
            >
              {generateAesKey.isPending ? <SpinIcon /> : <KeyIcon />}
              Генерувати
            </button>
          </div>
        </div>

        {/* Affine keys */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[10px] text-purple-400 font-semibold tracking-widest flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
            AFFINE CRT ПАРАМЕТРИ
          </label>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-500">
              ВЛАСНІ МОДУЛІ <span className="text-purple-400 font-mono">manual_p</span>
            </span>
            <input
              type="text"
              value={manualP}
              onChange={(e) => setManualP(e.target.value)}
              placeholder="напр. 997, 1009 — або порожньо"
              className="w-full bg-dark-input border border-border-base rounded-lg px-3 py-2 text-xs font-mono text-gray-300 placeholder-gray-600 focus:outline-none focus:border-border-purple transition-colors"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'КІЛЬКІСТЬ', val: autoGenCount, set: setAutoGenCount, min: 1, max: undefined },
              { label: 'МІН. p', val: minP, set: setMinP, min: 2, max: undefined },
              { label: 'МАКС. p', val: maxP, set: setMaxP, min: minP + 1, max: undefined },
            ].map(({ label, val, set, min, max }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-500 font-semibold">{label}</span>
                <input
                  type="number"
                  value={val}
                  min={min}
                  max={max}
                  onChange={(e) => set(Number(e.target.value))}
                  className="w-full bg-dark-input border border-border-base rounded-lg px-2 py-1.5 text-xs font-mono text-gray-300 focus:outline-none focus:border-border-purple transition-colors"
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => generateAffineParams.mutate()}
            disabled={generateAffineParams.isPending}
            className="self-start flex items-center gap-1.5 px-3 py-2 bg-affine-bg border border-affine-border text-purple-400 rounded-lg text-xs font-medium hover:bg-purple-900/30 transition-all disabled:opacity-50"
          >
            {generateAffineParams.isPending ? <SpinIcon /> : <KeyIcon />}
            Генерувати параметри
          </button>

          {generateAffineParams.isError && (
            <p className="text-red-400 text-xs font-mono bg-danger-bg border border-border-red rounded px-2 py-1.5 break-all">
              {extractError(generateAffineParams.error)}
            </p>
          )}

          {pKeys && (
            <div className="flex flex-col gap-0.5 text-[10px] font-mono bg-dark-input rounded-lg px-3 py-2 border border-border-base">
              <span className="text-gray-500">p: <span className="text-purple-400">{pKeys}</span></span>
              <span className="text-gray-500">a: <span className="text-purple-400">{aKeys}</span></span>
              <span className="text-gray-500">s: <span className="text-purple-400">{sKeys}</span></span>
            </div>
          )}
        </div>
      </div>

      {/* Run button */}
      <button
        onClick={handleRun}
        disabled={!canRun}
        className="self-start flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isRunning ? <SpinIcon size={16} /> : <ChartIcon size={16} />}
        {isRunning
          ? `Запуск ${iterations} ітерацій...`
          : `Запустити бенчмарк · ${iterations} ітерацій`}
      </button>

      {[aesBenchmarkEncrypt, affineBenchmarkEncrypt, aesBenchmarkDecrypt, affineBenchmarkDecrypt]
        .filter((m) => m.isError)
        .map((m, i) => (
          <div key={i} className="bg-danger-bg border border-border-red rounded-lg px-3 py-2.5">
            <p className="text-red-300 text-xs font-mono break-all">{extractError(m.error)}</p>
          </div>
        ))}
    </div>
  )
}
