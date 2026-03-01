import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { ciphersApi } from '@/api/ciphers.api'
import CipherTabs from '../ui/CipherTabs'

const LockIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const UnlockIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </svg>
)

const KeyIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
)

const CopyIcon = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

const SpinIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
)

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors"
    >
      <CopyIcon />
      {copied ? 'Скопійовано!' : 'Копіювати'}
    </button>
  )
}

function ResultBlock({
  result,
  executionTime,
  label,
  accentClass,
}: {
  result: string
  executionTime: number
  label: string
  accentClass: string
}) {
  return (
    <div className="bg-dark-input border border-border-blue rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold ${accentClass}`}>{label}</span>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500">
            ⏱ {(executionTime * 1000).toFixed(3)} мс
          </span>
          <CopyButton text={result} />
        </div>
      </div>
      <textarea
        readOnly
        value={result}
        rows={3}
        className="w-full bg-dark-base border border-border-base rounded-lg px-3 py-2.5 text-sm font-mono text-gray-300 resize-none focus:outline-none"
      />
    </div>
  )
}

export default function AESCryptoPanel() {
  const [key, setKey] = useState('')
  const [encryptInput, setEncryptInput] = useState('')
  const [decryptInput, setDecryptInput] = useState('')

  const generateKeyMutation = useMutation({
    mutationFn: ciphersApi.aesGenerateKey,
    onSuccess: (data) => setKey(data.result),
  })

  const encryptMutation = useMutation({
    mutationFn: (input: string) =>
      ciphersApi.aesEncrypt({ data: input, key: key || null }),
  })

  const decryptMutation = useMutation({
    mutationFn: (input: string) =>
      ciphersApi.aesDecrypt({ data: input, key: key || null }),
  })

  return (
    <div className="flex flex-col gap-4">
      {/* Key section */}
      <div className="bg-dark-card border border-border-base rounded-xl p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <KeyIcon size={14} />
          <span className="text-sm font-semibold text-gray-200">Ключ шифрування</span>
          <span className="text-xs text-gray-500 ml-1">Hex або Base64</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Введіть ключ або натисніть «Генерувати»..."
            className="flex-1 bg-dark-input border border-border-base rounded-lg px-3 py-2.5 text-sm font-mono text-gray-300 placeholder-gray-600 focus:outline-none focus:border-border-blue transition-colors"
          />
          <button
            onClick={() => generateKeyMutation.mutate()}
            disabled={generateKeyMutation.isPending}
            className="flex items-center gap-2 px-4 py-2.5 bg-aes-bg border border-border-blue text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {generateKeyMutation.isPending ? <SpinIcon /> : <KeyIcon />}
            Генерувати
          </button>
        </div>
        {generateKeyMutation.isError && (
          <p className="text-red-400 text-xs">Помилка генерації ключа</p>
        )}
      </div>

      {/* Tabs */}
      <CipherTabs
        accentColor="blue"
        tabs={[
          {
            label: 'Шифрування',
            icon: <LockIcon />,
            content: (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-500 font-semibold tracking-wide">
                    ВІДКРИТИЙ ТЕКСТ
                  </label>
                  <textarea
                    value={encryptInput}
                    onChange={(e) => setEncryptInput(e.target.value)}
                    placeholder="Введіть текст для шифрування..."
                    rows={4}
                    className="w-full bg-dark-input border border-border-base rounded-lg px-3 py-2.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-border-blue transition-colors resize-none"
                  />
                </div>
                <button
                  onClick={() => encryptMutation.mutate(encryptInput)}
                  disabled={!encryptInput.trim() || encryptMutation.isPending}
                  className="self-start flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {encryptMutation.isPending ? <SpinIcon /> : <LockIcon />}
                  Зашифрувати
                </button>
                {encryptMutation.isError && (
                  <p className="text-red-400 text-xs">Помилка шифрування</p>
                )}
                {encryptMutation.data && (
                  <ResultBlock
                    result={encryptMutation.data.result}
                    executionTime={encryptMutation.data.execution_time}
                    label="ШИФРОТЕКСТ (Base64)"
                    accentClass="text-blue-400"
                  />
                )}
              </div>
            ),
          },
          {
            label: 'Дешифрування',
            icon: <UnlockIcon />,
            content: (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-500 font-semibold tracking-wide">
                    ШИФРОТЕКСТ (Base64)
                  </label>
                  <textarea
                    value={decryptInput}
                    onChange={(e) => setDecryptInput(e.target.value)}
                    placeholder="Введіть зашифрований текст (Base64)..."
                    rows={4}
                    className="w-full bg-dark-input border border-border-base rounded-lg px-3 py-2.5 text-sm font-mono text-gray-300 placeholder-gray-600 focus:outline-none focus:border-border-blue transition-colors resize-none"
                  />
                </div>
                <button
                  onClick={() => decryptMutation.mutate(decryptInput)}
                  disabled={!decryptInput.trim() || decryptMutation.isPending}
                  className="self-start flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {decryptMutation.isPending ? <SpinIcon /> : <UnlockIcon />}
                  Дешифрувати
                </button>
                {decryptMutation.isError && (
                  <p className="text-red-400 text-xs">Помилка дешифрування</p>
                )}
                {decryptMutation.data && (
                  <ResultBlock
                    result={decryptMutation.data.result}
                    executionTime={decryptMutation.data.execution_time}
                    label="ВІДКРИТИЙ ТЕКСТ"
                    accentClass="text-green-400"
                  />
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  )
}