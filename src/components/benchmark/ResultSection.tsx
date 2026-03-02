import LineChartCard from './LineChartCard'
import BarChartCard from './BarChartCard'
import DonutChartCard from './DonutChartCard'
import type { StatsResult, LinePoint, BarPoint } from '@/utils/benchmark'

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

type Props = {
  title: string
  subtitle: string
  lineData: LinePoint[]
  barData: BarPoint[]
  aesS: StatsResult
  affineS: StatsResult
  iterations: number
}

export default function ResultSection({
  title,
  subtitle,
  lineData,
  barData,
  aesS,
  affineS,
  iterations,
}: Props) {
  const aesWins = aesS.avg < affineS.avg
  const diff = Math.abs(aesS.avg - affineS.avg)
  const pct = ((diff / Math.max(aesS.avg, affineS.avg)) * 100).toFixed(1)

  return (
    <>
      {/* Section divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border-base" />
        <span className="text-xs text-gray-500 font-semibold tracking-widest uppercase px-2">
          {title}
        </span>
        <div className="h-px flex-1 bg-border-base" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard
          label={`AES · СЕРЕДНІЙ · ${subtitle.toUpperCase()}`}
          value={`${aesS.avg.toFixed(4)} мс`}
          sub={`з ${iterations} ітерацій`}
          accent="text-blue-400"
        />
        <StatCard
          label={`AES · ЗАГАЛЬНИЙ · ${subtitle.toUpperCase()}`}
          value={`${aesS.total.toFixed(2)} мс`}
          sub={`мін ${aesS.min.toFixed(4)} · макс ${aesS.max.toFixed(4)}`}
          accent="text-blue-300"
        />
        <StatCard
          label={`AFFINE · СЕРЕДНІЙ · ${subtitle.toUpperCase()}`}
          value={`${affineS.avg.toFixed(4)} мс`}
          sub={`з ${iterations} ітерацій`}
          accent="text-purple-400"
        />
        <StatCard
          label={`AFFINE · ЗАГАЛЬНИЙ · ${subtitle.toUpperCase()}`}
          value={`${affineS.total.toFixed(2)} мс`}
          sub={`мін ${affineS.min.toFixed(4)} · макс ${affineS.max.toFixed(4)}`}
          accent="text-purple-300"
        />
      </div>

      {/* Winner banner */}
      <div
        className={`border rounded-xl px-5 py-3 flex items-center gap-3 ${
          aesWins ? 'bg-aes-bg border-border-blue' : 'bg-affine-bg border-affine-border'
        }`}
      >
        <span className="text-2xl">🏆</span>
        <div>
          <span className={`font-bold ${aesWins ? 'text-blue-400' : 'text-purple-400'}`}>
            {aesWins ? 'AES-256-CBC' : 'Affine CRT'}
          </span>
          <span className="text-gray-400 text-sm"> швидший на </span>
          <span className="text-green-400 font-bold text-sm">{pct}%</span>
          <span className="text-gray-500 text-sm ml-2">
            ({diff.toFixed(4)} мс різниця у середньому)
          </span>
        </div>
      </div>

      {/* Line chart */}
      <LineChartCard title={title} lineData={lineData} iterations={iterations} />

      {/* Bar + Donut */}
      <div className="grid grid-cols-[1fr_280px] gap-4">
        <BarChartCard title={title} barData={barData} />
        <DonutChartCard title={title} aesS={aesS} affineS={affineS} />
      </div>
    </>
  )
}
