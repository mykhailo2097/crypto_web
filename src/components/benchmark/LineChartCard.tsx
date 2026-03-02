import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  ResponsiveContainer,
} from 'recharts'
import { sampleLine } from '@/utils/benchmark'
import type { LinePoint } from '@/utils/benchmark'

type Props = {
  title: string
  lineData: LinePoint[]
  iterations: number
}

export default function LineChartCard({ title, lineData, iterations }: Props) {
  const { data: sampled, step } = sampleLine(lineData)

  return (
    <div className="bg-dark-card border border-border-base rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-200">
            Час {title.toLowerCase()} по ітераціях
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">мс на кожну ітерацію з {iterations}</p>
        </div>
        {step > 1 && (
          <span className="text-[10px] text-gray-500 font-mono shrink-0">
            кожна {step}-а точка
          </span>
        )}
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={sampled} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="i"
            tick={{ fill: '#6b7280', fontSize: 11 }}
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
            cursor={{ stroke: '#4b5563', strokeWidth: 1, strokeDasharray: '4 4' }}
            position={{ x: 10, y: 8 }}
            wrapperStyle={{ outline: 'none' }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              const aes = payload.find((p) => p.dataKey === 'AES')?.value as number
              const affine = payload.find((p) => p.dataKey === 'Affine')?.value as number
              return (
                <div className="bg-dark-input border border-border-base rounded-lg px-3 py-2.5 text-xs min-w-[175px]">
                  <p className="text-gray-500 text-[10px] font-semibold tracking-widest mb-2">
                    ІТЕРАЦІЯ {label}
                  </p>
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="flex items-center gap-1.5 text-blue-400">
                      <span className="w-3 h-0.5 bg-blue-400 inline-block rounded" />
                      AES
                    </span>
                    <span className="font-mono font-semibold text-blue-300">
                      {aes?.toFixed(5)} мс
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-purple-400">
                      <span className="w-3 h-0.5 bg-purple-400 inline-block rounded" />
                      Affine
                    </span>
                    <span className="font-mono font-semibold text-purple-300">
                      {affine?.toFixed(5)} мс
                    </span>
                  </div>
                </div>
              )
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            formatter={(value) => (
              <span style={{ color: value === 'AES' ? '#60a5fa' : '#c084fc' }}>{value}</span>
            )}
          />
          <Line
            type="monotone"
            dataKey="AES"
            stroke="#60a5fa"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3, fill: '#60a5fa', stroke: '#1e3a5f', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="Affine"
            stroke="#c084fc"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3, fill: '#c084fc', stroke: '#2d1b69', strokeWidth: 2 }}
          />
          <Brush
            dataKey="i"
            height={36}
            travellerWidth={8}
            stroke="var(--color-border-base)"
            fill="var(--color-dark-input)"
            tickFormatter={() => ''}
          >
            <LineChart>
              <Line dataKey="AES" stroke="#3b82f6" strokeWidth={1} dot={false} />
              <Line dataKey="Affine" stroke="#a855f7" strokeWidth={1} dot={false} />
            </LineChart>
          </Brush>
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
