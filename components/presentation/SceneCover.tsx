'use client'
import { motion } from 'framer-motion'
import { EmbryoCase } from '@/lib/types'

interface Props { data: EmbryoCase }

const PROCEDURE_LABELS: Record<string, string> = {
  ICSI: 'ICSI — Inyección intracitoplásmica de espermatozoides',
  FIV: 'FIV — Fertilización in vitro',
  CRIO_OVOCITOS: 'Criopreservación de ovocitos',
}

export default function SceneCover({ data }: Props) {
  const date = data.procedureDate
    ? new Date(data.procedureDate + 'T00:00:00').toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] text-center px-8 relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <svg width="100%" height="100%" viewBox="0 0 1440 800" fill="none" preserveAspectRatio="xMidYMid slice">
          <circle cx="200" cy="150" r="280" fill="#3A7D44" opacity="0.03" />
          <circle cx="1300" cy="650" r="320" fill="#C9A84C" opacity="0.04" />
          <circle cx="1100" cy="100" r="180" fill="#3A7D44" opacity="0.025" />
        </svg>
      </div>

      {/* Main orb */}
      <motion.div className="mb-10"
        initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}>
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <defs>
            <radialGradient id="coverOuter" cx="36%" cy="30%" r="70%">
              <stop stopColor="#D4EED8" />
              <stop offset="0.5" stopColor="#7DB88A" />
              <stop offset="1" stopColor="#3A7D44" />
            </radialGradient>
            <radialGradient id="coverInner" cx="36%" cy="30%" r="70%">
              <stop stopColor="#EAF4EC" />
              <stop offset="1" stopColor="#3A7D44" stopOpacity="0.5" />
            </radialGradient>
            <filter id="coverShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#3A7D44" floodOpacity="0.2" />
            </filter>
          </defs>
          <circle cx="60" cy="60" r="56" fill="url(#coverOuter)" filter="url(#coverShadow)" />
          <circle cx="60" cy="60" r="36" fill="url(#coverInner)" opacity="0.6" />
          <circle cx="60" cy="60" r="18" fill="#3A7D44" opacity="0.25" />
          <ellipse cx="42" cy="38" rx="12" ry="9" fill="white" opacity="0.35" />
          <circle cx="60" cy="60" r="56" fill="none" stroke="#3A7D44" strokeWidth="1" opacity="0.35" />
        </svg>
      </motion.div>

      {/* Title */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
        <h1 className="font-serif text-5xl text-[#1C2B3A] mb-3 leading-tight">Evolución Embrionaria</h1>
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-12 bg-[#C9A84C]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
          <div className="h-px w-12 bg-[#C9A84C]" />
        </div>
      </motion.div>

      {/* Patient info */}
      <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
        <p className="text-2xl font-light text-[#3A7D44] mb-1">{data.patientName}</p>
        {data.patientAge && <p className="text-sm text-[#94A3B8]">{data.patientAge} años</p>}
      </motion.div>

      {/* Meta info */}
      <motion.div className="flex flex-col items-center gap-1.5 text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.5 }}>
        {date && (
          <span className="px-4 py-1.5 rounded-full text-[#1C2B3A] font-medium" style={{ background: '#F1F5F9', border: '1px solid #E2E8F0' }}>
            {date}
          </span>
        )}
        {data.doctorName && <p className="text-[#94A3B8]">{data.doctorName}</p>}
        {data.procedureType && (
          <p className="text-xs font-semibold tracking-wider uppercase text-[#3A7D44] mt-1">
            {PROCEDURE_LABELS[data.procedureType] ?? data.procedureType}
          </p>
        )}
      </motion.div>
    </div>
  )
}
