import { useAESInfo } from '../hooks/useAESInfo'
import AESInfo from '../components/ciphers/AESInfo'
import { AESCipher } from '@/types/cipher.types.ts'

export default function AESPage() {
  const { data, isLoading, isError } = useAESInfo()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
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

  return <AESInfo data={data as unknown as AESCipher} />
}
