import { PieChart, Pie, Cell, Tooltip } from 'recharts'
import type { StatsResult } from '@/utils/benchmark'

type Props = {
  title: string
  aesS: StatsResult
  affineS: StatsResult
}

export default function DonutChartCard({ title, aesS, affineS }: Props) {
  const aesWins = aesS.avg < affineS.avg
  const totalAvg = aesS.avg + affineS.avg

  const pieData = [
    { name: 'AES-256-CBC', value: aesS.avg, fill: '#3b82f6' },
    { name: 'Affine CRT', value: affineS.avg, fill: '#a855f7' },
  ]

  return (
    <div className="bg-dark-card border border-border-base rounded-xl p-5 flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-200">
          Частка часу · {title.toLowerCase()}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">за середнім значенням</p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <div className="relative">
          <PieChart width={160} height={160}>
            <Pie
              data={pieData}
              cx={80}
              cy={80}
              innerRadius={52}
              outerRadius={76}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              strokeWidth={0}
            >
              {pieData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              wrapperStyle={{ outline: 'none', zIndex: 50 }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const p = payload[0]
                const pct = (((p.value as number) / totalAvg) * 100).toFixed(1)
                return (
                  <div
                    style={{
                      background: 'var(--color-dark-input)',
                      border: '1px solid var(--color-border-base)',
                      borderRadius: 8,
                      padding: '8px 12px',
                      fontSize: 12,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <p style={{ color: p.payload.fill, marginBottom: 2 }}>{p.name}</p>
                    <p style={{ color: '#e5e7eb', fontFamily: 'monospace', fontWeight: 600 }}>
                      {pct}%
                    </p>
                  </div>
                )
              }}
            />
          </PieChart>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span
              className={`text-lg font-bold font-mono ${aesWins ? 'text-blue-400' : 'text-purple-400'}`}
            >
              {((( aesWins ? aesS.avg : affineS.avg) / totalAvg) * 100).toFixed(0)}%
            </span>
            <span className="text-[10px] text-gray-500">{aesWins ? 'AES' : 'Affine'}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 text-xs w-full px-2">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5" style={{ color: item.fill }}>
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                  style={{ backgroundColor: item.fill }}
                />
                {item.name}
              </span>
              <span className="font-mono text-gray-400">{item.value.toFixed(4)} мс</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
