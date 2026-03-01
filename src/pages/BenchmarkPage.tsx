import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { ciphersApi, AffineKeys } from '@/api/ciphers.api'

const DEFAULT_TEXT = ''

/* ── Icons ─────────────────────────────────────────────────── */

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

/* ── Helpers ────────────────────────────────────────────────── */

function parseKeys(str: string): number[] {
  return str.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n))
}

function extractError(err: unknown): string {
  if (!err || typeof err !== 'object') return String(err)
  const e = err as { response?: { data?: { detail?: unknown } }; message?: string }
  const detail = e.response?.data?.detail
  if (Array.isArray(detail)) {
    return detail.map((d) => `${d.loc?.join('.')}: ${d.msg}`).join(' | ')
  }
  if (typeof detail === 'string') return detail
  return e.message ?? 'Невідома помилка'
}

function stats(times: number[]) {
  const ms = times.map((t) => t * 1000)
  const avg = ms.reduce((a, b) => a + b, 0) / ms.length
  const min = Math.min(...ms)
  const max = Math.max(...ms)
  const total = ms.reduce((a, b) => a + b, 0)
  return { avg, min, max, total }
}

/* ── Stat card ──────────────────────────────────────────────── */

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string
  sub: string
  accent: string
}) {
  return (
    <div className="bg-dark-card border border-border-base rounded-xl p-4 flex flex-col gap-1">
      <span className="text-[10px] text-gray-500 font-semibold tracking-widest">{label}</span>
      <span className={`text-lg font-bold font-mono ${accent}`}>{value}</span>
      <span className="text-xs text-gray-500">{sub}</span>
    </div>
  )
}

/* ── Custom tooltip ─────────────────────────────────────────── */

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: number
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-dark-card border border-border-base rounded-lg px-3 py-2.5 text-xs">
      <p className="text-gray-400 mb-1.5">Ітерація {label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <span className="font-mono font-semibold">{p.value.toFixed(4)} мс</span>
        </p>
      ))}
    </div>
  )
}

function BarTooltip({ active, payload, label }: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-dark-card border border-border-base rounded-lg px-3 py-2.5 text-xs">
      <p className="text-gray-400 mb-1.5">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <span className="font-mono font-semibold">{p.value.toFixed(4)} мс</span>
        </p>
      ))}
    </div>
  )
}

/* ── Main page ──────────────────────────────────────────────── */

export default function BenchmarkPage() {
  const [iterations, setIterations] = useState(100)
  const [text, setText] = useState(DEFAULT_TEXT)
  const [aesKey, setAesKey] = useState('')

  // Affine generation settings
  const [manualP, setManualP] = useState('')
  const [autoGenCount, setAutoGenCount] = useState(3)
  const [minP, setMinP] = useState(100)
  const [maxP, setMaxP] = useState(10000)

  // Affine keys (filled after generation)
  const [pKeys, setPKeys] = useState('')
  const [aKeys, setAKeys] = useState('')
  const [sKeys, setSKeys] = useState('')

  // Generate AES key
  const generateAesKey = useMutation({
    mutationFn: ciphersApi.aesGenerateKey,
    onSuccess: (d) => setAesKey(d.result),
  })

  // Generate Affine params
  const generateAffineParams = useMutation({
    mutationFn: () =>
      ciphersApi.affineGenerateParams({
        manual_p: parseKeys(manualP),
        auto_gen_count: autoGenCount,
        min_p: minP,
        max_p: maxP,
      }),
    onSuccess: (d) => {
      setPKeys(d.p_keys.join(', '))
      setAKeys(d.a_keys.join(', '))
      setSKeys(d.s_keys.join(', '))
    },
  })

  const aesBenchmarkEncrypt = useMutation({
    mutationFn: () =>
      ciphersApi.aesBenchmarkEncrypt({ data: text, key: aesKey, iterations }),
  })

  const affineBenchmarkEncrypt = useMutation({
    mutationFn: () =>
      ciphersApi.affineBenchmarkEncrypt({
        data: text,
        p_keys: parseKeys(pKeys),
        a_keys: parseKeys(aKeys),
        s_keys: parseKeys(sKeys),
        iterations,
      }),
  })

  const aesBenchmarkDecrypt = useMutation({
    mutationFn: (ciphertext: string) =>
      ciphersApi.aesBenchmarkDecrypt({ data: ciphertext, key: aesKey, iterations }),
  })

  const affineBenchmarkDecrypt = useMutation({
    mutationFn: (cipherText: string) =>
      ciphersApi.affineBenchmarkDecrypt({
        cipher_text: cipherText,
        p_keys: parseKeys(pKeys),
        a_keys: parseKeys(aKeys),
        s_keys: parseKeys(sKeys),
        iterations,
      }),
  })

  const isRunning =
    aesBenchmarkEncrypt.isPending || affineBenchmarkEncrypt.isPending ||
    aesBenchmarkDecrypt.isPending || affineBenchmarkDecrypt.isPending

  const hasEncryptResults = aesBenchmarkEncrypt.data && affineBenchmarkEncrypt.data
  const hasDecryptResults = aesBenchmarkDecrypt.data && affineBenchmarkDecrypt.data
  const hasResults = hasEncryptResults && hasDecryptResults

  const canRun =
    text.trim() !== '' &&
    aesKey.trim() !== '' &&
    pKeys.trim() !== '' &&
    aKeys.trim() !== '' &&
    sKeys.trim() !== '' &&
    !isRunning

  const handleRun = async () => {
    // 1. Run encrypt benchmarks in parallel
    const [aesEnc, affineEnc] = await Promise.all([
      aesBenchmarkEncrypt.mutateAsync(),
      affineBenchmarkEncrypt.mutateAsync(),
    ])
    // 2. Run decrypt benchmarks with ciphertext from step 1
    await Promise.all([
      aesBenchmarkDecrypt.mutateAsync(aesEnc.result),
      affineBenchmarkDecrypt.mutateAsync(affineEnc.cipher_readable),
    ])
  }

  // ── Chart data builders ────────────────────────────────────

  const buildLineData = (
    aTimes: number[],
    bTimes: number[],
    len: number,
  ) =>
    Array.from({ length: len }, (_, i) => ({
      i: i + 1,
      AES: +(aTimes[i] * 1000).toFixed(5),
      Affine: +(bTimes[i] * 1000).toFixed(5),
    }))

  const buildBarData = (
    aS: ReturnType<typeof stats>,
    bS: ReturnType<typeof stats>,
  ) => [
    { label: 'Середнє', AES: +aS.avg.toFixed(5), Affine: +bS.avg.toFixed(5) },
    { label: 'Мінімум', AES: +aS.min.toFixed(5), Affine: +bS.min.toFixed(5) },
    { label: 'Максимум', AES: +aS.max.toFixed(5), Affine: +bS.max.toFixed(5) },
  ]

  const encLineData = hasEncryptResults
    ? buildLineData(aesBenchmarkEncrypt.data!.execution_times, affineBenchmarkEncrypt.data!.execution_times, iterations)
    : []
  const decLineData = hasDecryptResults
    ? buildLineData(aesBenchmarkDecrypt.data!.execution_times, affineBenchmarkDecrypt.data!.execution_times, iterations)
    : []

  const aesEncStats = hasEncryptResults ? stats(aesBenchmarkEncrypt.data!.execution_times) : null
  const affineEncStats = hasEncryptResults ? stats(affineBenchmarkEncrypt.data!.execution_times) : null
  const aesDecStats = hasDecryptResults ? stats(aesBenchmarkDecrypt.data!.execution_times) : null
  const affineDecStats = hasDecryptResults ? stats(affineBenchmarkDecrypt.data!.execution_times) : null

  const encBarData = hasEncryptResults ? buildBarData(aesEncStats!, affineEncStats!) : []
  const decBarData = hasDecryptResults ? buildBarData(aesDecStats!, affineDecStats!) : []

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-dark-hover border border-border-base rounded-lg flex items-center justify-center flex-shrink-0">
            <ChartIcon size={18} />
          </div>
          <div>
            <h1 className="text-xl font-bold">
              Криптографічний <span className="text-indigo-400">бенчмарк</span>
            </h1>
            <p className="text-gray-500 text-sm font-mono">
              // <span className="text-blue-400">AES-256-CBC</span> vs{' '}
              <span className="text-purple-400">Affine CRT</span> • {iterations} ітерацій
            </p>
          </div>
        </div>
      </div>

      {/* Config */}
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
            <label className="text-[10px] text-gray-500 font-semibold tracking-widest">
              ІТЕРАЦІЙ
            </label>
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

            {/* manual_p */}
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

            {/* auto_gen_count / min_p / max_p */}
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
          {isRunning ? `Запуск ${iterations} ітерацій...` : `Запустити бенчмарк · ${iterations} ітерацій`}
        </button>

        {[aesBenchmarkEncrypt, affineBenchmarkEncrypt, aesBenchmarkDecrypt, affineBenchmarkDecrypt]
          .filter((m) => m.isError)
          .map((m, i) => (
            <div key={i} className="bg-danger-bg border border-border-red rounded-lg px-3 py-2.5 flex flex-col gap-1">
              <p className="text-red-300 text-xs font-mono break-all">{extractError(m.error)}</p>
            </div>
          ))}
      </div>

      {/* ── Results ── */}
      {hasEncryptResults && (
        <ResultSection
          title="Шифрування"
          subtitle="encrypt"
          lineData={encLineData}
          barData={encBarData}
          aesS={aesEncStats!}
          affineS={affineEncStats!}
          iterations={iterations}
        />
      )}
      {hasDecryptResults && (
        <ResultSection
          title="Дешифрування"
          subtitle="decrypt"
          lineData={decLineData}
          barData={decBarData}
          aesS={aesDecStats!}
          affineS={affineDecStats!}
          iterations={iterations}
        />
      )}
    </div>
  )
}

/* ── Reusable result section ────────────────────────────────── */

function ResultSection({
  title,
  subtitle,
  lineData,
  barData,
  aesS,
  affineS,
  iterations,
}: {
  title: string
  subtitle: string
  lineData: { i: number; AES: number; Affine: number }[]
  barData: { label: string; AES: number; Affine: number }[]
  aesS: ReturnType<typeof stats>
  affineS: ReturnType<typeof stats>
  iterations: number
}) {
  const aesWins = aesS.avg < affineS.avg
  const diff = Math.abs(aesS.avg - affineS.avg)
  const pct = ((diff / Math.max(aesS.avg, affineS.avg)) * 100).toFixed(1)

  return (
    <>
      {/* Section label */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border-base" />
        <span className="text-xs text-gray-500 font-semibold tracking-widest uppercase px-2">
          {title}
        </span>
        <div className="h-px flex-1 bg-border-base" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard label={`AES · СЕРЕДНІЙ · ${subtitle.toUpperCase()}`} value={`${aesS.avg.toFixed(4)} мс`}
          sub={`з ${iterations} ітерацій`} accent="text-blue-400" />
        <StatCard label={`AES · ЗАГАЛЬНИЙ · ${subtitle.toUpperCase()}`} value={`${aesS.total.toFixed(2)} мс`}
          sub={`мін ${aesS.min.toFixed(4)} · макс ${aesS.max.toFixed(4)}`} accent="text-blue-300" />
        <StatCard label={`AFFINE · СЕРЕДНІЙ · ${subtitle.toUpperCase()}`} value={`${affineS.avg.toFixed(4)} мс`}
          sub={`з ${iterations} ітерацій`} accent="text-purple-400" />
        <StatCard label={`AFFINE · ЗАГАЛЬНИЙ · ${subtitle.toUpperCase()}`} value={`${affineS.total.toFixed(2)} мс`}
          sub={`мін ${affineS.min.toFixed(4)} · макс ${affineS.max.toFixed(4)}`} accent="text-purple-300" />
      </div>

      {/* Winner */}
      <div className={`border rounded-xl px-5 py-3 flex items-center gap-3 ${aesWins ? 'bg-aes-bg border-border-blue' : 'bg-affine-bg border-affine-border'}`}>
        <span className="text-2xl">🏆</span>
        <div>
          <span className={`font-bold ${aesWins ? 'text-blue-400' : 'text-purple-400'}`}>
            {aesWins ? 'AES-256-CBC' : 'Affine CRT'}
          </span>
          <span className="text-gray-400 text-sm"> швидший на </span>
          <span className="text-green-400 font-bold text-sm">{pct}%</span>
          <span className="text-gray-500 text-sm ml-2">({diff.toFixed(4)} мс різниця у середньому)</span>
        </div>
      </div>

      {/* Line chart */}
      <div className="bg-dark-card border border-border-base rounded-xl p-5 flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-200">Час {title.toLowerCase()} по ітераціях</h3>
          <p className="text-xs text-gray-500 mt-0.5">мс на кожну ітерацію з {iterations}</p>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={lineData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="i" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#1f2937' }} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#1f2937' }}
              tickFormatter={(v) => v.toFixed(3)} width={62} />
            <Tooltip
              cursor={{ stroke: '#4b5563', strokeWidth: 1, strokeDasharray: '4 4' }}
              position={{ x: 10, y: 8 }}
              wrapperStyle={{ outline: 'none' }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                const aes = payload.find((p) => p.dataKey === 'AES')?.value as number
                const affine = payload.find((p) => p.dataKey === 'Affine')?.value as number
                return (
                  <div className="bg-dark-input border border-border-base rounded-lg px-3 py-2.5 text-xs min-w-[175px]">
                    <p className="text-gray-500 text-[10px] font-semibold tracking-widest mb-2">ІТЕРАЦІЯ {label}</p>
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span className="flex items-center gap-1.5 text-blue-400">
                        <span className="w-3 h-0.5 bg-blue-400 inline-block rounded" />AES
                      </span>
                      <span className="font-mono font-semibold text-blue-300">{aes?.toFixed(5)} мс</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-1.5 text-purple-400">
                        <span className="w-3 h-0.5 bg-purple-400 inline-block rounded" />Affine
                      </span>
                      <span className="font-mono font-semibold text-purple-300">{affine?.toFixed(5)} мс</span>
                    </div>
                  </div>
                )
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
              formatter={(value) => (
                <span style={{ color: value === 'AES' ? '#60a5fa' : '#c084fc' }}>{value}</span>
              )} />
            <Line type="monotone" dataKey="AES" stroke="#60a5fa" strokeWidth={1.5} dot={false}
              activeDot={{ r: 3, fill: '#60a5fa', stroke: '#1e3a5f', strokeWidth: 2 }} />
            <Line type="monotone" dataKey="Affine" stroke="#c084fc" strokeWidth={1.5} dot={false}
              activeDot={{ r: 3, fill: '#c084fc', stroke: '#2d1b69', strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar + Donut charts */}
      <div className="grid grid-cols-[1fr_280px] gap-4">
        <div className="bg-dark-card border border-border-base rounded-xl p-5 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-200">Порівняння статистик · {title.toLowerCase()}</h3>
            <p className="text-xs text-gray-500 mt-0.5">середній, мінімальний та максимальний час (мс)</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#1f2937' }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#1f2937' }}
                tickFormatter={(v) => v.toFixed(3)} width={62} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} content={<BarTooltip />} wrapperStyle={{ outline: 'none' }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                formatter={(value) => (
                  <span style={{ color: value === 'AES' ? '#60a5fa' : '#c084fc' }}>{value}</span>
                )} />
              <Bar dataKey="AES" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={60} />
              <Bar dataKey="Affine" fill="#a855f7" radius={[4, 4, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut chart */}
        <div className="bg-dark-card border border-border-base rounded-xl p-5 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-200">Частка часу · {title.toLowerCase()}</h3>
            <p className="text-xs text-gray-500 mt-0.5">за середнім значенням</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="relative">
              <PieChart width={160} height={160}>
                <Pie
                  data={[
                    { name: 'AES-256-CBC', value: aesS.avg },
                    { name: 'Affine CRT', value: affineS.avg },
                  ]}
                  cx={80} cy={80}
                  innerRadius={52} outerRadius={76}
                  startAngle={90} endAngle={-270}
                  dataKey="value"
                  strokeWidth={0}
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#a855f7" />
                </Pie>
                <Tooltip
                  wrapperStyle={{ outline: 'none', zIndex: 50 }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const p = payload[0]
                    const total = aesS.avg + affineS.avg
                    const pct = ((p.value as number) / total * 100).toFixed(1)
                    return (
                      <div style={{ background: 'var(--color-dark-input)', border: '1px solid var(--color-border-base)', borderRadius: 8, padding: '8px 12px', fontSize: 12, whiteSpace: 'nowrap' }}>
                        <p style={{ color: p.payload.fill, marginBottom: 2 }}>{p.name}</p>
                        <p style={{ color: '#e5e7eb', fontFamily: 'monospace', fontWeight: 600 }}>{pct}%</p>
                      </div>
                    )
                  }}
                />
              </PieChart>
              {/* Center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className={`text-lg font-bold font-mono ${aesWins ? 'text-blue-400' : 'text-purple-400'}`}>
                  {aesWins
                    ? `${((aesS.avg / (aesS.avg + affineS.avg)) * 100).toFixed(0)}%`
                    : `${((affineS.avg / (aesS.avg + affineS.avg)) * 100).toFixed(0)}%`}
                </span>
                <span className="text-[10px] text-gray-500">{aesWins ? 'AES' : 'Affine'}</span>
              </div>
            </div>
            {/* Legend */}
            <div className="flex flex-col gap-1.5 text-xs w-full px-2">
              {[
                { name: 'AES-256-CBC', color: '#3b82f6', val: aesS.avg },
                { name: 'Affine CRT', color: '#a855f7', val: affineS.avg },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5" style={{ color: item.color }}>
                    <span className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-mono text-gray-400">{item.val.toFixed(4)} мс</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
