import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { BarPoint } from '@/utils/benchmark'

function BarTooltip({
  active,
  payload,
  label,
}: {
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

type Props = {
  title: string
  barData: BarPoint[]
}

export default function BarChartCard({ title, barData }: Props) {
  return (
    <div className="bg-dark-card border border-border-base rounded-xl p-5 flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-200">
          Порівняння статистик · {title.toLowerCase()}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          середній, мінімальний та максимальний час (мс)
        </p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={barData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="label"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#1f2937' }}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: '#1f2937' }}
            tickFormatter={(v) => v.toFixed(3)}
            width={62}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            content={<BarTooltip />}
            wrapperStyle={{ outline: 'none' }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
            formatter={(value) => (
              <span style={{ color: value === 'AES' ? '#60a5fa' : '#c084fc' }}>{value}</span>
            )}
          />
          <Bar dataKey="AES" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={60} />
          <Bar dataKey="Affine" fill="#a855f7" radius={[4, 4, 0, 0]} maxBarSize={60} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
