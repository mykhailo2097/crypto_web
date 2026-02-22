import { AESCipher } from '@/types/cipher.types.ts'
import { Badge, StatCard, FeatureList, UseCaseTags, PageHeader, CipherTabs } from '../ui'

interface Props {
  data: AESCipher
}

const LockIcon = ({ color = 'currentColor', size = 20 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const KeyIcon = ({ color = 'currentColor', size = 16 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
)

const BlockIcon = ({ color = 'currentColor', size = 16 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
)

const WaveIcon = ({ color = 'currentColor', size = 16 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
)

const ShieldIcon = ({ color = 'currentColor', size = 16 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

export default function AESInfo({ data }: Props) {
  const { parameters } = data

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={
          <>
            AES-<span className="text-blue-400">256</span> Шифрування
          </>
        }
        subtitle={`// Симетричний блоковий шифр • ${parameters.key_size_bits}-bit key • ${parameters.mode} mode`}
        badges={
          <>
            <Badge variant="green">● SECURE</Badge>
            <span className="text-gray-500 text-xs">• {data.security_level}</span>
          </>
        }
      />

      {/* Info card */}
      <div className="bg-dark-card border border-border-base rounded-xl p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-10 h-10 bg-aes-bg rounded-lg flex items-center justify-center flex-shrink-0">
            <LockIcon color="#60a5fa" />
          </div>
          <span className="font-semibold">{data.name}</span>
          <Badge variant="blue">{data.type}</Badge>
          <span className="text-gray-500 text-sm">• {data.security_level}</span>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed">
          {/*{data.description}*/}
          Advanced Encryption Standard з 256-бітним ключем у режимі CBC — симетричний блоковий шифр,
          прийнятий як федеральний стандарт США у 2001 році. Виконує 14 раундів трансформацій
          (SubBytes, ShiftRows, MixColumns, AddRoundKey). Вважається практично нерозбивним при
          сучасних обчислювальних потужностях — для перебору всіх ключів знадобляться мільярди років
          навіть на найпотужніших суперкомп'ютерах. Використовується в TLS, VPN, повнодисковому
          шифруванні (BitLocker, FileVault) та банківських системах.
        </p>

        {/* Government badges */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 bg-nsa-bg border border-green-800 rounded-md px-3 py-1.5">
            <ShieldIcon color="#4ade80" size={12} />
            <span className="text-green-400 text-xs font-semibold">АНБ Схвалено</span>
          </div>
          <div className="flex items-center gap-2 bg-fips-bg border border-blue-800 rounded-md px-3 py-1.5">
            <LockIcon color="#60a5fa" size={12} />
            <span className="text-blue-400 text-xs font-semibold">FIPS 197</span>
          </div>
          <div className="flex items-center gap-2 bg-gov-bg border border-yellow-800 rounded-md px-3 py-1.5">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="text-yellow-400 text-xs font-semibold">Урядовий стандарт США</span>
          </div>
        </div>

        {/* Military Grade bar */}
        <div className="bg-dark-input border border-border-blue rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShieldIcon color="#60a5fa" size={13} />
              <span className="text-gray-400 text-xs font-semibold">Рівень безпеки</span>
            </div>
            <span className="text-green-400 text-xs font-bold bg-military-bg px-2 py-0.5 rounded">
              MILITARY GRADE
            </span>
          </div>
          <div className="bg-dark-hover rounded h-1.5 overflow-hidden">
            <div className="w-full h-full rounded bg-gradient-to-r from-blue-600 to-green-400" />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-gray-600 text-xs">Базовий</span>
            <span className="text-gray-600 text-xs">Стандартний</span>
            <span className="text-green-400 text-xs font-semibold">Військовий ▲</span>
          </div>
        </div>

        {/* Key formats */}
        <div className="bg-dark-input border-l-4 border-purple-500 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <KeyIcon color="#c084fc" size={12} />
            <p className="text-purple-400 text-sm font-semibold">Формати ключів:</p>
          </div>
          {data.key_formats.map((f, i) => (
            <p key={i} className="text-gray-300 text-sm font-mono mb-1">
              • {f}
            </p>
          ))}
        </div>

        <FeatureList features={data.features} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          icon={<KeyIcon color="#f59e0b" />}
          label="KEY SIZE"
          value={
            <span className="text-yellow-400">
              {parameters.key_size_bits}
              <span className="text-sm text-gray-500 ml-1">
                / {parameters.key_size_bytes} байти
              </span>
            </span>
          }
        />
        <StatCard
          icon={<BlockIcon color="#60a5fa" />}
          label="BLOCK SIZE"
          value={
            <span className="text-blue-400">
              {parameters.block_size_bits}
              <span className="text-sm text-gray-500 ml-1">
                / {parameters.block_size_bytes} байт
              </span>
            </span>
          }
        />
        <StatCard
          icon={<WaveIcon color="#4ade80" />}
          label="IV SIZE"
          value={
            <span className="text-green-400">
              {parameters.iv_size_bytes}
              <span className="text-sm text-gray-500 ml-1">байт</span>
            </span>
          }
        />
        <StatCard
          icon={<ShieldIcon color="#fb923c" />}
          label="MODE / PADDING"
          value={
            <span className="text-orange-400 text-xl">
              {parameters.mode} / {parameters.padding}
            </span>
          }
        />
      </div>

      <UseCaseTags useCases={data.use_cases} />

      <CipherTabs
        accentColor="blue"
        tabs={[
          {
            label: 'Шифрування',
            icon: <LockIcon size={14} />,
            content: <div className="text-gray-500 text-sm">// Форма шифрування</div>,
          },
          {
            label: 'Розшифрування',
            icon: <LockIcon size={14} />,
            content: <div className="text-gray-500 text-sm">// Форма розшифрування</div>,
          },
        ]}
      />
    </div>
  )
}
