import { useAffineInfo } from '../hooks/useAffineInfo'
import AffineInfo from '../components/ciphers/AffineInfo'
import { AffineCipher } from '@/types/cipher.types.ts'

export default function AffinePage() {
  const { data, isLoading, isError } = useAffineInfo()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-500 text-sm">Завантаження...</span>
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400 text-sm">Помилка завантаження даних</div>
      </div>
    )
  }

  return <AffineInfo data={data as unknown as AffineCipher} />
}
