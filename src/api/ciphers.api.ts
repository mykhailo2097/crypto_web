import httpClient from './httpClient'
import { AESCipher, AffineCipher } from '../types/cipher.types'

export interface AesCryptoResponse {
  result: string
  execution_time: number
}

export interface AffineKeys {
  p_keys: number[]
  a_keys: number[]
  s_keys: number[]
}

export interface AffineGenerateParamsResponse extends AffineKeys {
  prod_p: string
}

export interface AffineEncryptResponse extends AffineKeys {
  cipher_compact: string
  cipher_readable: string
  execution_time: number
}

export interface AffineCryptoResponse {
  result: string
  execution_time: number
}

export const ciphersApi = {
  getAESInfo: () => httpClient.get<AESCipher, AESCipher>('/crypto/aes/info'),
  getAffineInfo: () => httpClient.get<AffineCipher, AffineCipher>('/crypto/affine_crt/info'),

  aesGenerateKey: () =>
    httpClient.get<{ result: string }, { result: string }>('/crypto/aes/generate-key'),

  aesEncrypt: (body: { data: string; key?: string | null }) =>
    httpClient.post<AesCryptoResponse, AesCryptoResponse>('/crypto/aes/encrypt', body),

  aesDecrypt: (body: { data: string; key?: string | null }) =>
    httpClient.post<AesCryptoResponse, AesCryptoResponse>('/crypto/aes/decrypt', body),

  affineGenerateParams: (body?: {
    manual_p?: number[]
    auto_gen_count?: number
    min_p?: number
    max_p?: number
  }) =>
    httpClient.post<AffineGenerateParamsResponse, AffineGenerateParamsResponse>(
      '/crypto/affine_crt/generate-params',
      body ?? {},
    ),

  affineEncrypt: (body: { data: string } & AffineKeys) =>
    httpClient.post<AffineEncryptResponse, AffineEncryptResponse>(
      '/crypto/affine_crt/encrypt',
      body,
    ),

  affineDecrypt: (body: { cipher_text: string } & AffineKeys) =>
    httpClient.post<AffineCryptoResponse, AffineCryptoResponse>(
      '/crypto/affine_crt/decrypt',
      body,
    ),

  // ── Benchmarks ────────────────────────────────────────────

  aesBenchmarkEncrypt: (body: { data: string; key: string; iterations: number }) =>
    httpClient.post<{ result: string; execution_times: number[] }, { result: string; execution_times: number[] }>(
      '/crypto/aes/benchmark-encrypt',
      body,
    ),

  affineBenchmarkEncrypt: (body: { data: string; iterations: number } & AffineKeys) =>
    httpClient.post<
      { cipher_compact: string; cipher_readable: string; execution_times: number[] } & AffineKeys,
      { cipher_compact: string; cipher_readable: string; execution_times: number[] } & AffineKeys
    >('/crypto/affine_crt/benchmark-encrypt', body),

  aesBenchmarkDecrypt: (body: { data: string; key: string; iterations: number }) =>
    httpClient.post<{ result: string; execution_times: number[] }, { result: string; execution_times: number[] }>(
      '/crypto/aes/benchmark-decrypt',
      body,
    ),

  affineBenchmarkDecrypt: (body: { cipher_text: string; iterations: number } & AffineKeys) =>
    httpClient.post<{ result: string; execution_times: number[] }, { result: string; execution_times: number[] }>(
      '/crypto/affine_crt/benchmark-decrypt',
      body,
    ),
}
