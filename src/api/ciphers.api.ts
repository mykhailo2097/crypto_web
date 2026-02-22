import httpClient from './httpClient'
import { AESCipher, AffineCipher } from '../types/cipher.types'

export const ciphersApi = {
  getAESInfo: () => httpClient.get<AESCipher>('/crypto/aes/info'),
  getAffineInfo: () => httpClient.get<AffineCipher>('/crypto/affine_crt/info'),
}
