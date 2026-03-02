import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { ciphersApi, EncodingTableEntry } from '@/api/ciphers.api'

/* ── Category config ────────────────────────────────────────── */

const CATEGORY_META: Record<string, { color: string; accent: string; bg: string; border: string }> = {
  'Великі літери A-Z': { color: '#60a5fa', accent: 'text-blue-400', bg: 'bg-aes-bg', border: 'border-border-blue' },
  'Малі літери a-z':   { color: '#c084fc', accent: 'text-purple-400', bg: 'bg-affine-bg', border: 'border-affine-border' },
  'Цифри 0-9':         { color: '#4ade80', accent: 'text-green-400', bg: 'bg-military-bg', border: 'border-border-green' },
  'Розділові знаки':   { color: '#fb923c', accent: 'text-orange-400', bg: 'bg-badge-orange', border: 'border-border-yellow' },
}

const fallbackMeta = { color: '#94a3b8', accent: 'text-gray-400', bg: 'bg-dark-hover', border: 'border-border-base' }

function getMeta(category: string) {
  return CATEGORY_META[category] ?? fallbackMeta
}

/* ── Icons ──────────────────────────────────────────────────── */

const TableIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18" />
  </svg>
)

const SearchIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

/* ── Stat card ──────────────────────────────────────────────── */

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent: string }) {
  return (
    <div className="bg-dark-card border border-border-base rounded-xl p-4 flex flex-col gap-1">
      <span className="text-[10px] text-gray-500 font-semibold tracking-widest">{label}</span>
      <span className={`text-2xl font-bold font-mono ${accent}`}>{value}</span>
      {sub && <span className="text-xs text-gray-500">{sub}</span>}
    </div>
  )
}

/* ── Main page ──────────────────────────────────────────────── */

export default function EncodingTablePage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['encoding-table'],
    queryFn: ciphersApi.getEncodingTable,
  })

  const categories = useMemo(() => {
    if (!data) return []
    const counts: Record<string, number> = {}
    data.table.forEach((row) => {
      counts[row.category] = (counts[row.category] ?? 0) + 1
    })
    return Object.entries(counts).map(([name, count]) => ({ name, count }))
  }, [data])

  const filtered = useMemo(() => {
    if (!data) return []
    return data.table.filter((row) => {
      const matchesSearch =
        !search ||
        row.char.toLowerCase().includes(search.toLowerCase()) ||
        row.name.toLowerCase().includes(search.toLowerCase()) ||
        String(row.code).includes(search)
      const matchesCategory = !activeCategory || row.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [data, search, activeCategory])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin mr-2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        Завантаження таблиці кодування...
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="bg-danger-bg border border-border-red rounded-xl p-4 text-red-400 text-sm">
        Помилка завантаження таблиці кодування
      </div>
    )
  }

  const pieData = categories.map(({ name, count }) => ({ name, value: count }))

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-dark-hover border border-border-base rounded-lg flex items-center justify-center flex-shrink-0">
          <TableIcon size={18} />
        </div>
        <div>
          <h1 className="text-xl font-bold">
            Таблиця <span className="text-green-400">кодування</span>
          </h1>
          <p className="text-gray-500 text-sm font-mono">
            // алфавіт шифру · <span className="text-green-400">{data.total_chars}</span> символів · коди{' '}
            <span className="text-gray-400">{data.code_range}</span>
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="ВСЬОГО СИМВОЛІВ" value={String(data.total_chars)} sub="у алфавіті шифру" accent="text-green-400" />
        <StatCard label="ДІАПАЗОН КОДІВ" value={data.code_range} sub="числовий код символу" accent="text-blue-400" />
        {categories.map(({ name, count }) => (
          <StatCard
            key={name}
            label={name.toUpperCase()}
            value={String(count)}
            sub={`символів`}
            accent={getMeta(name).accent}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-[1fr_260px] gap-4">

        {/* Bar chart */}
        <div className="bg-dark-card border border-border-base rounded-xl p-5 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-200">Розподіл за категоріями</h3>
            <p className="text-xs text-gray-500 mt-0.5">кількість символів у кожній групі</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={categories} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#1f2937' }}
                tickFormatter={(v: string) => v.split(' ')[0]}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#1f2937' }}
                width={28}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                wrapperStyle={{ outline: 'none' }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const p = payload[0]
                  return (
                    <div style={{ background: 'var(--color-dark-input)', border: '1px solid var(--color-border-base)', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
                      <p style={{ color: getMeta(p.payload.name).color, fontWeight: 600 }}>{p.payload.name}</p>
                      <p style={{ color: '#e5e7eb', fontFamily: 'monospace' }}>{p.value} символів</p>
                    </div>
                  )
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={60}>
                {categories.map(({ name }) => (
                  <Cell key={name} fill={getMeta(name).color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-dark-card border border-border-base rounded-xl p-5 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-200">Частка груп</h3>
            <p className="text-xs text-gray-500 mt-0.5">у загальному алфавіті</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <PieChart width={140} height={140}>
              <Pie
                data={pieData}
                cx={70} cy={70}
                innerRadius={42} outerRadius={66}
                startAngle={90} endAngle={-270}
                dataKey="value"
                strokeWidth={0}
              >
                {pieData.map(({ name }) => (
                  <Cell key={name} fill={getMeta(name).color} />
                ))}
              </Pie>
              <Tooltip
                wrapperStyle={{ outline: 'none' }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const p = payload[0]
                  const pct = ((p.value as number) / data.total_chars * 100).toFixed(1)
                  return (
                    <div style={{ background: 'var(--color-dark-input)', border: '1px solid var(--color-border-base)', borderRadius: 8, padding: '8px 12px', fontSize: 12, whiteSpace: 'nowrap' }}>
                      <p style={{ color: getMeta(p.name as string).color, fontWeight: 600 }}>{p.name}</p>
                      <p style={{ color: '#e5e7eb', fontFamily: 'monospace' }}>{pct}% · {p.value} шт</p>
                    </div>
                  )
                }}
              />
            </PieChart>
            <div className="flex flex-col gap-1.5 w-full text-xs">
              {categories.map(({ name, count }) => {
                const meta = getMeta(name)
                const pct = (count / data.total_chars * 100).toFixed(0)
                return (
                  <div key={name} className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5" style={{ color: meta.color }}>
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: meta.color }} />
                      {name.split(' ')[0]}
                    </span>
                    <span className="font-mono text-gray-400">{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-dark-card border border-border-base rounded-xl flex flex-col">

        {/* Table header / filters */}
        <div className="p-4 flex items-center gap-3 border-b border-border-base flex-wrap">
          <div className="relative flex-1 min-w-48">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Пошук за символом, назвою або кодом..."
              className="w-full bg-dark-input border border-border-base rounded-lg pl-9 pr-3 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-border-blue transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                !activeCategory
                  ? 'bg-dark-hover border-border-base text-gray-200'
                  : 'border-border-base text-gray-500 hover:bg-dark-hover'
              }`}
            >
              Всі ({data.total_chars})
            </button>
            {categories.map(({ name, count }) => {
              const meta = getMeta(name)
              const isActive = activeCategory === name
              return (
                <button
                  key={name}
                  onClick={() => setActiveCategory(isActive ? null : name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    isActive ? `${meta.bg} ${meta.border}` : 'border-border-base text-gray-500 hover:bg-dark-hover'
                  }`}
                  style={isActive ? { color: meta.color } : {}}
                >
                  {name.split(' ')[0]} ({count})
                </button>
              )
            })}
          </div>
          <span className="text-xs text-gray-500 ml-auto shrink-0">{filtered.length} символів</span>
        </div>

        {/* Table body */}
        <div className="overflow-auto max-h-[480px]">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-dark-card z-10">
              <tr className="border-b border-border-base">
                <th className="text-left px-4 py-3 text-[10px] text-gray-500 font-semibold tracking-widest w-20">КОД</th>
                <th className="text-left px-4 py-3 text-[10px] text-gray-500 font-semibold tracking-widest w-20">СИМВОЛ</th>
                <th className="text-left px-4 py-3 text-[10px] text-gray-500 font-semibold tracking-widest">НАЗВА</th>
                <th className="text-left px-4 py-3 text-[10px] text-gray-500 font-semibold tracking-widest">КАТЕГОРІЯ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row: EncodingTableEntry) => {
                const meta = getMeta(row.category)
                return (
                  <tr
                    key={row.code}
                    className="border-b border-border-base hover:bg-dark-hover transition-colors"
                  >
                    <td className="px-4 py-2.5">
                      <span className="font-mono font-bold text-gray-300">{row.code}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg font-mono font-bold text-base"
                        style={{ background: meta.color + '22', color: meta.color }}
                      >
                        {row.char === ' ' ? '␣' : row.char}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-400 text-xs">{row.name}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`text-[10px] font-semibold px-2 py-1 rounded ${meta.bg}`}
                        style={{ color: meta.color }}
                      >
                        {row.category}
                      </span>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500 text-sm">
                    Нічого не знайдено
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
