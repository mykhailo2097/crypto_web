import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { ciphersApi } from '@/api/ciphers.api'
import { parseKeys, stats, buildLineData, buildBarData } from '@/utils/benchmark'

export type BenchmarkStep =
  | 'aes-encrypt'
  | 'affine-encrypt'
  | 'aes-decrypt'
  | 'affine-decrypt'
  | 'delay'
  | null

export function useBenchmarkState() {
  const [iterations, setIterations] = useState(100)
  const [text, setText] = useState('')
  const [aesKey, setAesKey] = useState('')
  const [currentStep, setCurrentStep] = useState<BenchmarkStep>(null)

  const [manualP, setManualP] = useState('')
  const [autoGenCount, setAutoGenCount] = useState(3)
  const [minP, setMinP] = useState(100)
  const [maxP, setMaxP] = useState(10000)

  const [pKeys, setPKeys] = useState('')
  const [aKeys, setAKeys] = useState('')
  const [sKeys, setSKeys] = useState('')

  const generateAesKey = useMutation({
    mutationFn: ciphersApi.aesGenerateKey,
    onSuccess: (d) => setAesKey(d.result),
  })

  const generateAffineParams = useMutation({
    mutationFn: () =>
      ciphersApi.affineGenerateParams({
        manual_p: parseKeys(manualP),
        auto_gen_count: autoGenCount,
        min_p: minP,
        max_p: maxP,
      }),
    onSuccess: (d) => {
      setPKeys(d.p_keys.join(', '))
      setAKeys(d.a_keys.join(', '))
      setSKeys(d.s_keys.join(', '))
    },
  })

  // Send iterations + 5 so the first 5 (warm-up) iterations can be dropped client-side
  const warmIterations = iterations + 5

  const aesBenchmarkEncrypt = useMutation({
    mutationFn: () =>
      ciphersApi.aesBenchmarkEncrypt({ data: text, key: aesKey, iterations: warmIterations }),
  })

  const affineBenchmarkEncrypt = useMutation({
    mutationFn: () =>
      ciphersApi.affineBenchmarkEncrypt({
        data: text,
        p_keys: parseKeys(pKeys),
        a_keys: parseKeys(aKeys),
        s_keys: parseKeys(sKeys),
        iterations: warmIterations,
      }),
  })

  const aesBenchmarkDecrypt = useMutation({
    mutationFn: (ciphertext: string) =>
      ciphersApi.aesBenchmarkDecrypt({ data: ciphertext, key: aesKey, iterations: warmIterations }),
  })

  const affineBenchmarkDecrypt = useMutation({
    mutationFn: (cipherText: string) =>
      ciphersApi.affineBenchmarkDecrypt({
        cipher_text: cipherText,
        p_keys: parseKeys(pKeys),
        a_keys: parseKeys(aKeys),
        s_keys: parseKeys(sKeys),
        iterations: warmIterations,
      }),
  })


  const hasEncryptResults = !!(aesBenchmarkEncrypt.data && affineBenchmarkEncrypt.data)
  const hasDecryptResults = !!(aesBenchmarkDecrypt.data && affineBenchmarkDecrypt.data)

  const canRun =
    text.trim() !== '' &&
    aesKey.trim() !== '' &&
    pKeys.trim() !== '' &&
    aKeys.trim() !== '' &&
    sKeys.trim() !== '' &&
    currentStep === null

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const handleRun = async () => {
    aesBenchmarkEncrypt.reset()
    affineBenchmarkEncrypt.reset()
    aesBenchmarkDecrypt.reset()
    affineBenchmarkDecrypt.reset()
    try {
      setCurrentStep('aes-encrypt')
      const aesEnc = await aesBenchmarkEncrypt.mutateAsync()
      setCurrentStep('delay')
      await delay(1000)
      setCurrentStep('affine-encrypt')
      const affineEnc = await affineBenchmarkEncrypt.mutateAsync()
      setCurrentStep('delay')
      await delay(1000)
      setCurrentStep('aes-decrypt')
      await aesBenchmarkDecrypt.mutateAsync(aesEnc.result)
      setCurrentStep('delay')
      await delay(1000)
      setCurrentStep('affine-decrypt')
      await affineBenchmarkDecrypt.mutateAsync(affineEnc.cipher_readable)
    } finally {
      setCurrentStep(null)
    }
  }

  // Drop the first (warm-up) iteration before computing stats and chart data
  const aesEncTimes = hasEncryptResults ? aesBenchmarkEncrypt.data!.execution_times.slice(5) : []
  const affineEncTimes = hasEncryptResults
    ? affineBenchmarkEncrypt.data!.execution_times.slice(5)
    : []
  const aesDecTimes = hasDecryptResults ? aesBenchmarkDecrypt.data!.execution_times.slice(5) : []
  const affineDecTimes = hasDecryptResults
    ? affineBenchmarkDecrypt.data!.execution_times.slice(5)
    : []

  const aesEncStats = hasEncryptResults ? stats(aesEncTimes) : null
  const affineEncStats = hasEncryptResults ? stats(affineEncTimes) : null
  const aesDecStats = hasDecryptResults ? stats(aesDecTimes) : null
  const affineDecStats = hasDecryptResults ? stats(affineDecTimes) : null

  const encLineData = hasEncryptResults
    ? buildLineData(aesEncTimes, affineEncTimes, iterations)
    : []
  const decLineData = hasDecryptResults
    ? buildLineData(aesDecTimes, affineDecTimes, iterations)
    : []

  const encBarData = hasEncryptResults ? buildBarData(aesEncStats!, affineEncStats!) : []
  const decBarData = hasDecryptResults ? buildBarData(aesDecStats!, affineDecStats!) : []

  return {
    currentStep,
    iterations,
    setIterations,
    text,
    setText,
    aesKey,
    setAesKey,
    manualP,
    setManualP,
    autoGenCount,
    setAutoGenCount,
    minP,
    setMinP,
    maxP,
    setMaxP,
    pKeys,
    aKeys,
    sKeys,
    generateAesKey,
    generateAffineParams,
    aesBenchmarkEncrypt,
    affineBenchmarkEncrypt,
    aesBenchmarkDecrypt,
    affineBenchmarkDecrypt,
    isRunning: currentStep !== null,
    canRun,
    hasEncryptResults,
    hasDecryptResults,
    handleRun,
    encLineData,
    decLineData,
    encBarData,
    decBarData,
    aesEncStats,
    affineEncStats,
    aesDecStats,
    affineDecStats,
  }
}

export type BenchmarkState = ReturnType<typeof useBenchmarkState>
