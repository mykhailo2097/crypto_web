export type StatsResult = { avg: number; min: number; max: number; total: number }
export type LinePoint = { i: number; AES: number; Affine: number }
export type BarPoint = { label: string; AES: number; Affine: number }

export function parseKeys(str: string): number[] {
  return str
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n))
}

export function extractError(err: unknown): string {
  if (!err || typeof err !== 'object') return String(err)
  const e = err as { response?: { data?: { detail?: unknown } }; message?: string }
  const detail = e.response?.data?.detail
  if (Array.isArray(detail)) {
    return detail.map((d) => `${d.loc?.join('.')}: ${d.msg}`).join(' | ')
  }
  if (typeof detail === 'string') return detail
  return e.message ?? 'Невідома помилка'
}

export function stats(times: number[]): StatsResult {
  const ms = times.map((t) => t * 1000)
  const avg = ms.reduce((a, b) => a + b, 0) / ms.length
  const min = Math.min(...ms)
  const max = Math.max(...ms)
  const total = ms.reduce((a, b) => a + b, 0)
  return { avg, min, max, total }
}

export const MAX_LINE_POINTS = 400

export function sampleLine(data: LinePoint[]): { data: LinePoint[]; step: number } {
  if (data.length <= MAX_LINE_POINTS) return { data, step: 1 }
  const step = Math.ceil(data.length / MAX_LINE_POINTS)
  return { data: data.filter((_, i) => i % step === 0), step }
}

export function buildLineData(aTimes: number[], bTimes: number[], len: number): LinePoint[] {
  return Array.from({ length: len }, (_, i) => ({
    i: i + 1,
    AES: +(aTimes[i] * 1000).toFixed(5),
    Affine: +(bTimes[i] * 1000).toFixed(5),
  }))
}

export function buildBarData(aS: StatsResult, bS: StatsResult): BarPoint[] {
  return [
    { label: 'Середнє', AES: +aS.avg.toFixed(5), Affine: +bS.avg.toFixed(5) },
    { label: 'Мінімум', AES: +aS.min.toFixed(5), Affine: +bS.min.toFixed(5) },
    { label: 'Максимум', AES: +aS.max.toFixed(5), Affine: +bS.max.toFixed(5) },
  ]
}
