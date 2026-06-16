'use client'
import { motion } from 'framer-motion'
import { EmbryoCase } from '@/lib/types'

interface Props { data: EmbryoCase }

function OocyteCircle({ index }: { index: number }) {
  const id = `og-${index}`
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: 'easeOut' }}>
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <defs>
          <radialGradient id={id} cx="36%" cy="30%" r="70%">
            <stop stopColor="#EAF4EC" />
            <stop offset="0.5" stopColor="#7DB88A" />
            <stop offset="1" stopColor="#4A8C5A" />
          </radialGradient>
          <filter id={`shadow-${index}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#3A7D44" floodOpacity="0.18" />
          </filter>
        </defs>
        <circle cx="26" cy="26" r="23" fill={`url(#${id})`} filter={`url(#shadow-${index})`} />
        <ellipse cx="19" cy="18" rx="5" ry="4" fill="white" opacity="0.45" />
        <circle cx="26" cy="26" r="23" fill="none" stroke="#3A7D44" strokeWidth="0.75" opacity="0.4" />
      </svg>
    </motion.div>
  )
}

export default function SceneOocytes({ data }: Props) {
  const total = data.oocytes.totalOocytes
  const display = Math.min(total, 20)

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-8">
      <motion.div className="text-center mb-10" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="font-serif text-3xl text-[#1C2B3A] mb-3">Ovocitos obtenidos</h2>
        <div className="w-12 h-px bg-[#C9A84C] mx-auto" />
      </motion.div>

      <div className="flex flex-wrap justify-center gap-4 max-w-2xl mb-12">
        {Array.from({ length: display }).map((_, i) => <OocyteCircle key={i} index={i} />)}
        {total > 20 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            className="flex items-center justify-center w-13 h-13 text-sm font-medium text-[#94A3B8]">
            +{total - 20}
          </motion.div>
        )}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: display * 0.04 + 0.2 }}
        className="text-center">
        <p className="text-2xl text-[#1C2B3A] font-light max-w-lg leading-relaxed">
          En el procedimiento se obtuvieron{' '}
          <span className="font-semibold text-[#3A7D44]">{total} ovocitos</span>.
        </p>
      </motion.div>
    </div>
  )
}
