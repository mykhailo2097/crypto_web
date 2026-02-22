import { useQuery } from '@tanstack/react-query'
import { ciphersApi } from '../api/ciphers.api'

export const useAESInfo = () => {
  return useQuery({
    queryKey: ['aes-info'],
    queryFn: ciphersApi.getAESInfo,
    staleTime: 1000 * 60 * 10,
  })
}
