import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { ciphersApi, AffineKeys } from '@/api/ciphers.api'
import CipherTabs from '../ui/CipherTabs'

/* ── Icons ─────────────────────────────────────────────────── */

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

const SliderIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
    <circle cx="8" cy="6" r="2" fill="currentColor" stroke="none" />
    <circle cx="16" cy="12" r="2" fill="currentColor" stroke="none" />
    <circle cx="10" cy="18" r="2" fill="currentColor" stroke="none" />
  </svg>
)

/* ── Helpers ────────────────────────────────────────────────── */

function parseKeys(str: string): number[] {
  return str
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n))
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors"
    >
      <CopyIcon />
      {copied ? 'Скопійовано!' : 'Копіювати'}
    </button>
  )
}

/* ── Number field ───────────────────────────────────────────── */

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] text-gray-500 font-semibold tracking-widest">{label}</label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-dark-base border border-border-base rounded-lg px-3 py-2 text-sm font-mono text-gray-300 focus:outline-none focus:border-border-purple transition-colors"
      />
    </div>
  )
}

/* ── Key row ────────────────────────────────────────────────── */

function KeyRow({
  label,
  badge,
  value,
  onChange,
}: {
  label: string
  badge: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 text-xs text-gray-500 font-semibold shrink-0">
        {label} <span className="text-purple-400 font-mono">{badge}</span>
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="напр. 103, 211, 307"
        className="flex-1 bg-dark-base border border-border-base rounded-lg px-3 py-2 text-sm font-mono text-gray-300 placeholder-gray-600 focus:outline-none focus:border-border-purple transition-colors"
      />
    </div>
  )
}

/* ── Result block ───────────────────────────────────────────── */

function ResultBlock({
  label,
  value,
  executionTime,
  accentClass,
}: {
  label: string
  value: string
  executionTime: number
  accentClass: string
}) {
  return (
    <div className="bg-dark-input border border-affine-border rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold ${accentClass}`}>{label}</span>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500">⏱ {(executionTime * 1000).toFixed(3)} мс</span>
          <CopyButton text={value} />
        </div>
      </div>
      <textarea
        readOnly
        value={value}
        rows={3}
        className="w-full bg-dark-base border border-border-base rounded-lg px-3 py-2.5 text-sm font-mono text-gray-300 resize-none focus:outline-none"
      />
    </div>
  )
}

/* ── Main component ─────────────────────────────────────────── */

export default function AffineCryptoPanel() {
  // Generation settings
  const [manualP, setManualP] = useState('')
  const [autoGenCount, setAutoGenCount] = useState(3)
  const [minP, setMinP] = useState(100)
  const [maxP, setMaxP] = useState(10000)

  // Keys (filled after generation or manually)
  const [pKeys, setPKeys] = useState('')
  const [aKeys, setAKeys] = useState('')
  const [sKeys, setSKeys] = useState('')

  // Operation inputs
  const [encryptInput, setEncryptInput] = useState('')
  const [decryptInput, setDecryptInput] = useState('')

  const getKeys = (): AffineKeys => ({
    p_keys: parseKeys(pKeys),
    a_keys: parseKeys(aKeys),
    s_keys: parseKeys(sKeys),
  })

  const keysReady = pKeys.trim() !== '' && aKeys.trim() !== '' && sKeys.trim() !== ''

  const generateMutation = useMutation({
    mutationFn: () =>
      ciphersApi.affineGenerateParams({
        manual_p: parseKeys(manualP),
        auto_gen_count: autoGenCount,
        min_p: minP,
        max_p: maxP,
      }),
    onSuccess: (data) => {
      // p_keys from response already includes manual_p + auto-generated
      setPKeys(data.p_keys.join(', '))
      setAKeys(data.a_keys.join(', '))
      setSKeys(data.s_keys.join(', '))
    },
  })

  const encryptMutation = useMutation({
    mutationFn: (text: string) =>
      ciphersApi.affineEncrypt({ data: text, ...getKeys() }),
  })

  const decryptMutation = useMutation({
    mutationFn: (cipherText: string) =>
      ciphersApi.affineDecrypt({ cipher_text: cipherText, ...getKeys() }),
  })

  return (
    <div className="flex flex-col gap-4">

      {/* Generation settings */}
      <div className="bg-dark-card border border-affine-border rounded-xl p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <SliderIcon size={14} />
          <span className="text-sm font-semibold text-gray-200">Налаштування генерації</span>
        </div>

        {/* manual_p */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-gray-500 font-semibold tracking-widest">
            ВЛАСНІ МОДУЛІ <span className="text-purple-400 font-mono">manual_p</span>
            <span className="text-gray-600 ml-2 normal-case tracking-normal">
              — будуть включені до результату генерації
            </span>
          </label>
          <input
            type="text"
            value={manualP}
            onChange={(e) => setManualP(e.target.value)}
            placeholder="напр. 997, 1009 — або залиште пустим"
            className="w-full bg-dark-base border border-border-base rounded-lg px-3 py-2.5 text-sm font-mono text-gray-300 placeholder-gray-600 focus:outline-none focus:border-border-purple transition-colors"
          />
        </div>

        {/* auto_gen_count / min_p / max_p */}
        <div className="grid grid-cols-3 gap-3">
          <NumberField
            label="КІЛЬКІСТЬ АВТО"
            value={autoGenCount}
            onChange={setAutoGenCount}
            min={1}
          />
          <NumberField
            label="МІН. ЗНАЧЕННЯ p"
            value={minP}
            onChange={setMinP}
            min={2}
          />
          <NumberField
            label="МАКС. ЗНАЧЕННЯ p"
            value={maxP}
            onChange={setMaxP}
            min={minP + 1}
          />
        </div>

        <button
          onClick={() => generateMutation.mutate()}
          disabled={generateMutation.isPending}
          className="self-start flex items-center gap-2 px-4 py-2.5 bg-affine-bg border border-affine-border text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generateMutation.isPending ? <SpinIcon /> : <KeyIcon />}
          Генерувати параметри
        </button>

        {generateMutation.isError && (
          <p className="text-red-400 text-xs">Помилка генерації параметрів</p>
        )}
      </div>

      {/* Keys display / edit */}
      <div className="bg-dark-card border border-affine-border rounded-xl p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <KeyIcon size={14} />
          <span className="text-sm font-semibold text-gray-200">Ключі шифрування</span>
          <span className="text-xs text-gray-500 ml-1">можна редагувати вручну</span>
        </div>
        <KeyRow label="Модулі" badge="p_keys" value={pKeys} onChange={setPKeys} />
        <KeyRow label="Множники" badge="a_keys" value={aKeys} onChange={setAKeys} />
        <KeyRow label="Зсуви" badge="s_keys" value={sKeys} onChange={setSKeys} />
      </div>

      {/* Tabs */}
      <CipherTabs
        accentColor="purple"
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
                    className="w-full bg-dark-input border border-border-base rounded-lg px-3 py-2.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-border-purple transition-colors resize-none"
                  />
                </div>
                <button
                  onClick={() => encryptMutation.mutate(encryptInput)}
                  disabled={!encryptInput.trim() || !keysReady || encryptMutation.isPending}
                  className="self-start flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-700 to-violet-600 hover:from-purple-600 hover:to-violet-500 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {encryptMutation.isPending ? <SpinIcon /> : <LockIcon />}
                  Зашифрувати
                </button>
                {encryptMutation.isError && (
                  <p className="text-red-400 text-xs">Помилка шифрування</p>
                )}
                {encryptMutation.data && (
                  <div className="flex flex-col gap-3">
                    <ResultBlock
                      label="ШИФРОТЕКСТ (читабельний)"
                      value={encryptMutation.data.cipher_readable}
                      executionTime={encryptMutation.data.execution_time}
                      accentClass="text-purple-400"
                    />
                    <ResultBlock
                      label="ШИФРОТЕКСТ (компактний)"
                      value={encryptMutation.data.cipher_compact}
                      executionTime={encryptMutation.data.execution_time}
                      accentClass="text-violet-400"
                    />
                  </div>
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
                    ШИФРОТЕКСТ
                  </label>
                  <textarea
                    value={decryptInput}
                    onChange={(e) => setDecryptInput(e.target.value)}
                    placeholder="Введіть шифротекст (читабельний або компактний формат)..."
                    rows={4}
                    className="w-full bg-dark-input border border-border-base rounded-lg px-3 py-2.5 text-sm font-mono text-gray-300 placeholder-gray-600 focus:outline-none focus:border-border-purple transition-colors resize-none"
                  />
                </div>
                <button
                  onClick={() => decryptMutation.mutate(decryptInput)}
                  disabled={!decryptInput.trim() || !keysReady || decryptMutation.isPending}
                  className="self-start flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-700 to-violet-600 hover:from-purple-600 hover:to-violet-500 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {decryptMutation.isPending ? <SpinIcon /> : <UnlockIcon />}
                  Дешифрувати
                </button>
                {decryptMutation.isError && (
                  <p className="text-red-400 text-xs">Помилка дешифрування</p>
                )}
                {decryptMutation.data && (
                  <ResultBlock
                    label="ВІДКРИТИЙ ТЕКСТ"
                    value={decryptMutation.data.result}
                    executionTime={decryptMutation.data.execution_time}
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