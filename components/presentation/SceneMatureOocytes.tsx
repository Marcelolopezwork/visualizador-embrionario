'use client'
import { motion } from 'framer-motion'
import { EmbryoCase } from '@/lib/types'

interface Props { data: EmbryoCase }

function MatureOocyte({ index }: { index: number }) {
  const id = `mii-${index}`
  return (
    <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}>
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <defs>
          <radialGradient id={id} cx="36%" cy="30%" r="70%">
            <stop stopColor="#C8E8CE" />
            <stop offset="0.5" stopColor="#4A8C5A" />
            <stop offset="1" stopColor="#3A7D44" />
          </radialGradient>
          <filter id={`ds-${index}`} x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#3A7D44" floodOpacity="0.25" />
          </filter>
        </defs>
        <circle cx="28" cy="28" r="25" fill={`url(#${id})`} filter={`url(#ds-${index})`} />
        <ellipse cx="20" cy="19" rx="6" ry="4.5" fill="white" opacity="0.4" />
        <circle cx="28" cy="28" r="25" fill="none" stroke="#3A7D44" strokeWidth="1" opacity="0.5" />
        <circle cx="28" cy="28" r="8" fill="none" stroke="white" strokeWidth="0.75" opacity="0.25" />
      </svg>
    </motion.div>
  )
}

function OtherOocyte({ index }: { index: number }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }}
      transition={{ delay: 0.1 + index * 0.03, duration: 0.3 }}>
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="25" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="0.75" />
        <ellipse cx="20" cy="19" rx="6" ry="4.5" fill="white" opacity="0.3" />
      </svg>
    </motion.div>
  )
}

export default function SceneMatureOocytes({ data }: Props) {
  const total = data.oocytes.totalOocytes
  const mii = data.oocytes.miiOocytes ?? 0
  const other = Math.max(0, total - mii)

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-8">
      <motion.div className="text-center mb-10" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="font-serif text-3xl text-[#1C2B3A] mb-2">Ovocitos maduros</h2>
        <p className="text-sm text-[#94A3B8] font-medium tracking-wide uppercase mb-3">Estadio MII</p>
        <div className="w-12 h-px bg-[#C9A84C] mx-auto" />
      </motion.div>

      <div className="flex flex-wrap justify-center gap-4 max-w-2xl mb-4">
        {Array.from({ length: Math.min(mii, 20) }).map((_, i) => <MatureOocyte key={i} index={i} />)}
        {Array.from({ length: Math.min(other, 10) }).map((_, i) => <OtherOocyte key={`o-${i}`} index={i} />)}
      </div>

      <motion.div className="flex gap-5 mb-8 text-xs text-[#94A3B8]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#3A7D44]" />
          MII — maduros ({mii})
        </div>
        {other > 0 && (
          <div className="flex items-center gap-1.5 opacity-50">
            <div className="w-3 h-3 rounded-full bg-[#94A3B8]" />
            Otros ({other})
          </div>
        )}
      </motion.div>

      <motion.p className="text-2xl text-[#1C2B3A] font-light text-center max-w-lg leading-relaxed"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        De los ovocitos obtenidos,{' '}
        <span className="font-semibold text-[#3A7D44]">{mii} estaban en etapa MII</span>{' '}
        y fueron aptos para continuar el procedimiento.
      </motion.p>
    </div>
  )
}
