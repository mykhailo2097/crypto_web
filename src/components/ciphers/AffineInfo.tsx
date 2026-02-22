import { AffineCipher } from '../../types/cipher.types'
import {
  Badge,
  StatCard,
  FeatureList,
  UseCaseTags,
  FormulaBox,
  PageHeader,
  CipherTabs,
  MathBasis,
} from '../ui'

interface Props {
  data: AffineCipher
}

const LayersIcon = ({ color = 'currentColor', size = 20 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
)

const LockIcon = ({ color = 'currentColor', size = 14 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

export default function AffineInfo({ data }: Props) {
  const { parameters } = data

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-purple-900 to-violet-600">
            <LayersIcon color="white" />
          </div>
        }
        title={
          <>
            Афінне шифрування <span className="text-purple-400">CRT</span>
          </>
        }
        subtitle="// Affine CRT • Афінне шифрування в системі залишкових класів"
        badges={<Badge variant="indigo">Шифрування з афінним перетворенням в СЗК</Badge>}
      />

      {/* Info card */}
      <div className="border border-affine-border rounded-xl p-6 flex flex-col gap-4 bg-gradient-to-br from-dark-deep to-dark-card">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-purple-900 to-violet-600">
            <LayersIcon color="white" size={18} />
          </div>
          <span className="font-semibold">{data.name_ua}</span>
          <Badge variant="purple">{data.name}</Badge>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed">{data.description}</p>

        {/* Formulas */}
        <div className="grid grid-cols-2 gap-3">
          <FormulaBox
            title="Шифрування"
            formula={parameters.affine_formula}
            accentColor="purple"
            icon={
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 20V10" />
                <path d="M12 20V4" />
                <path d="M6 20v-6" />
              </svg>
            }
          />
          <FormulaBox
            title="Розшифрування"
            formula={parameters.inverse_formula}
            accentColor="blue"
            icon={
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 12h18" />
                <path d="M9 6l-6 6 6 6" />
              </svg>
            }
          />
        </div>

        {/* key_a_condition */}
        <div className="bg-warning-bg border border-warning-border rounded-lg px-4 py-3 flex items-center gap-3">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className="text-yellow-400 text-sm font-mono">
            Умова для ключа a: {parameters.key_a_condition}
          </span>
        </div>

        {/* encoding + key_s_condition */}
        <div className="flex flex-wrap gap-2">
          <span className="border border-blue-500 text-blue-400 text-xs px-3 py-1.5 rounded-full">
            {parameters.encoding}
          </span>
          <span className="border border-green-600 text-green-400 text-xs px-3 py-1.5 rounded-full">
            Умова для ключа s: {parameters.key_s_condition}
          </span>
        </div>

        <FeatureList features={data.features} />
      </div>

      {/* Stats p, a, s */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          theme="purple"
          icon={
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#c084fc"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          }
          label="МОДУЛЬ"
          value={<span className="text-purple-400 font-mono">p</span>}
          sublabel="— Модуль системи"
          footnote="Приватний"
        />
        <StatCard
          theme="purple"
          icon={
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4ade80"
              strokeWidth="2"
            >
              <path d="M18 20V10" />
              <path d="M12 20V4" />
              <path d="M6 20v-6" />
            </svg>
          }
          label="МНОЖНИК"
          value={<span className="text-green-400 font-mono">a</span>}
          sublabel="— Множник"
          footnote="Приватний ключ"
        />
        <StatCard
          theme="purple"
          icon={
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          }
          label="ЗСУВ"
          value={<span className="text-yellow-400 font-mono">s</span>}
          sublabel="— Зсув"
          footnote="Приватний ключ"
        />
        <StatCard
          theme="red"
          icon={<LockIcon color="#f87171" size={14} />}
          label="БЕЗПЕКА"
          value={
            <span className="text-red-400 text-sm font-semibold leading-snug">
              p, a та s —<br />
              всі приватні ключі
            </span>
          }
        />
      </div>

      <MathBasis items={data.mathematical_basis} />

      <UseCaseTags useCases={data.use_cases} variant="purple" />

      <CipherTabs
        accentColor="purple"
        tabs={[
          {
            label: 'Шифрування',
            icon: <LockIcon />,
            content: <div className="text-gray-500 text-sm">// Форма шифрування</div>,
          },
          {
            label: 'Розшифрування',
            icon: <LockIcon />,
            content: <div className="text-gray-500 text-sm">// Форма розшифрування</div>,
          },
        ]}
      />
    </div>
  )
}
