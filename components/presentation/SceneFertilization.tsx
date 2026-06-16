'use client'
import { motion } from 'framer-motion'
import { EmbryoCase } from '@/lib/types'

interface Props { data: EmbryoCase }

interface Group {
  key: string
  label: string
  sublabel: string
  count: number
  primary: boolean
  color: string
  bg: string
  border: string
}

function FertOrb({ color, size = 40, highlight = false }: { color: string; size?: number; highlight?: boolean }) {
  const id = `fo-${color.replace('#', '')}`
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <defs>
        <radialGradient id={id} cx="36%" cy="30%" r="70%">
          <stop stopColor="white" stopOpacity={highlight ? 0.6 : 0.3} />
          <stop offset="1" stopColor={color} stopOpacity="0.9" />
        </radialGradient>
        <filter id={`fs-${id}`} x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor={color} floodOpacity="0.3" />
        </filter>
      </defs>
      <circle cx="20" cy="20" r="18" fill={`url(#${id})`} filter={highlight ? `url(#fs-${id})` : undefined} />
      <ellipse cx="14" cy="13" rx="4.5" ry="3.5" fill="white" opacity={highlight ? 0.45 : 0.25} />
      {highlight && <circle cx="20" cy="20" r="18" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />}
    </svg>
  )
}

export default function SceneFertilization({ data }: Props) {
  const f = data.fertilization

  const groups: Group[] = [
    { key: '2pn', label: '2PN', sublabel: 'Fecundación adecuada', count: f.twoPN ?? 0, primary: true, color: '#3A7D44', bg: '#EAF4EC', border: '#3A7D44' },
    { key: 'nf', label: 'No fecundados', sublabel: 'Sin fecundación', count: f.notFertilized ?? 0, primary: false, color: '#94A3B8', bg: '#F8FAFC', border: '#CBD5E1' },
    { key: '1pn', label: '1PN', sublabel: 'Un pronúcleo', count: f.onePN ?? 0, primary: false, color: '#C9A84C', bg: '#FEF9EC', border: '#C9A84C' },
    { key: '3pn', label: '3PN', sublabel: 'Tres pronúcleos', count: f.threePN ?? 0, primary: false, color: '#E07A5F', bg: '#FDF1EE', border: '#E07A5F' },
    { key: 'cy', label: 'Citolizados', sublabel: '', count: f.cytolyzed ?? 0, primary: false, color: '#B0BEC5', bg: '#F1F5F9', border: '#CBD5E1' },
    { key: 'at', label: 'Atrésicos', sublabel: '', count: f.fertilizationAtretic ?? 0, primary: false, color: '#CFD8DC', bg: '#F8FAFC', border: '#E2E8F0' },
  ].filter(g => g.count > 0)

  const twoPN = f.twoPN ?? 0

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-8">
      <motion.div className="text-center mb-10" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="font-serif text-3xl text-[#1C2B3A] mb-3">Resultado de la fertilización</h2>
        <div className="w-12 h-px bg-[#C9A84C] mx-auto" />
      </motion.div>

      <div className="flex flex-wrap justify-center gap-6 mb-10 max-w-3xl">
        {groups.map((g, gi) => (
          <motion.div key={g.key}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.1, duration: 0.4 }}
            className="flex flex-col items-center rounded-2xl px-5 py-4 min-w-[110px]"
            style={{ background: g.bg, border: `1px solid ${g.border}40` }}>

            <div className="flex flex-wrap justify-center gap-1.5 mb-3" style={{ maxWidth: 100 }}>
              {Array.from({ length: Math.min(g.count, 6) }).map((_, i) => (
                <FertOrb key={i} color={g.color} size={g.primary ? 38 : 32} highlight={g.primary} />
              ))}
              {g.count > 6 && (
                <span className="text-xs self-center font-medium" style={{ color: g.color }}>+{g.count - 6}</span>
              )}
            </div>

            <span className="text-2xl font-serif font-semibold" style={{ color: g.color }}>{g.count}</span>
            <span className="text-xs font-semibold mt-0.5 text-center" style={{ color: g.color }}>{g.label}</span>
            {g.sublabel && <span className="text-[10px] text-center mt-0.5" style={{ color: '#94A3B8' }}>{g.sublabel}</span>}
          </motion.div>
        ))}
      </div>

      <motion.p className="text-2xl text-[#1C2B3A] font-light text-center max-w-xl leading-relaxed"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        Luego de la fecundación,{' '}
        <span className="font-semibold text-[#3A7D44]">{twoPN} ovocito{twoPN !== 1 ? 's' : ''} presentaron fecundación adecuada</span>{' '}
        (2 pronúcleos).
      </motion.p>
    </div>
  )
}
