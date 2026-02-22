import { useQuery } from '@tanstack/react-query'
import { ciphersApi } from '../api/ciphers.api'

export const useAffineInfo = () => {
  return useQuery({
    queryKey: ['affine-info'],
    queryFn: ciphersApi.getAffineInfo,
    staleTime: 1000 * 60 * 10,
  })
}
