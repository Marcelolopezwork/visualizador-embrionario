'use client'
import { motion } from 'framer-motion'
import { EmbryoCase } from '@/lib/types'

interface Props { data: EmbryoCase }

interface FunnelStep {
  label: string
  sublabel: string
  value: number
  total: number
  color: string
  bg: string
  border: string
}

export default function SceneFunnel({ data }: Props) {
  const { oocytes, fertilization, embryos, finalResult } = data

  const total = oocytes.totalOocytes
  const mii = oocytes.miiOocytes ?? total
  const injected = oocytes.injectedOocytes ?? mii
  const fertilized2pn = fertilization.twoPN ?? 0
  const developed = embryos.filter(e =>
    e.day3 || e.day4 || e.day5 || e.day6 || e.day7
  ).length
  const finalCount = (finalResult.cryopreservedCount ?? 0) + (finalResult.transferredCount ?? 0)

  const steps: FunnelStep[] = [
    {
      label: 'Ovocitos obtenidos',
      sublabel: 'Punción folicular',
      value: total,
      total,
      color: '#3A7D44',
      bg: '#EAF4EC',
      border: '#3A7D44',
    },
    {
      label: 'Ovocitos maduros (MII)',
      sublabel: 'Aptos para el procedimiento',
      value: mii,
      total,
      color: '#2A6332',
      bg: '#DFF0F7',
      border: '#3A7D44',
    },
    {
      label: 'Ovocitos inyectados',
      sublabel: `Procedimiento ${data.procedureType}`,
      value: injected,
      total,
      color: '#5B4397',
      bg: '#F0EDF9',
      border: '#7C6FAF',
    },
    {
      label: 'Fecundación adecuada',
      sublabel: 'Con 2 pronúcleos (2PN)',
      value: fertilized2pn,
      total,
      color: '#92660A',
      bg: '#FEF9EC',
      border: '#C9A84C',
    },
    ...(developed > 0 ? [{
      label: 'Embriones en desarrollo',
      sublabel: 'Alcanzaron estadio de blastocisto',
      value: developed,
      total,
      color: '#1A6645',
      bg: '#EAF6EF',
      border: '#27AE74',
    }] : []),
    {
      label: 'Resultado final',
      sublabel: [
        finalResult.cryopreservedCount ? `${finalResult.cryopreservedCount} criopreservado${finalResult.cryopreservedCount > 1 ? 's' : ''}` : '',
        finalResult.transferredCount ? `${finalResult.transferredCount} transferido${finalResult.transferredCount > 1 ? 's' : ''}` : '',
      ].filter(Boolean).join(' · '),
      value: finalCount,
      total,
      color: '#2A6332',
      bg: '#E0F2F9',
      border: '#3A7D44',
    },
  ]

  const maxWidth = 680

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-8 py-6">
      <motion.div className="text-center mb-8"
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="font-serif text-3xl text-[#1C2B3A] mb-2">Resumen del recorrido</h2>
        <p className="text-sm text-[#94A3B8]">De la obtención al resultado final</p>
        <div className="w-12 h-px bg-[#C9A84C] mx-auto mt-3" />
      </motion.div>

      <div className="w-full flex flex-col items-center gap-1.5" style={{ maxWidth }}>
        {steps.map((step, i) => {
          const widthPct = step.total > 0 ? Math.max(30, (step.value / step.total) * 100) : 30
          const isLast = i === steps.length - 1

          return (
            <motion.div key={step.label} className="w-full flex flex-col items-center"
              initial={{ opacity: 0, scaleX: 0.6 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: i * 0.12, duration: 0.45, ease: 'easeOut' }}>

              {/* Connector line */}
              {i > 0 && (
                <div className="w-px h-3" style={{ background: '#D1DBE3' }} />
              )}

              {/* Bar */}
              <div
                className="flex items-center justify-between px-5 py-3 rounded-xl transition-all"
                style={{
                  width: `${widthPct}%`,
                  background: step.bg,
                  border: `1.5px solid ${step.border}40`,
                  boxShadow: isLast ? `0 4px 16px ${step.border}20` : undefined,
                }}>
                <div className="flex items-center gap-3 min-w-0">
                  {/* Step number */}
                  <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: step.color }}>
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-tight" style={{ color: step.color }}>
                      {step.label}
                    </p>
                    <p className="text-[11px] leading-tight mt-0.5" style={{ color: '#94A3B8' }}>
                      {step.sublabel}
                    </p>
                  </div>
                </div>
                {/* Count */}
                <div className="shrink-0 ml-4 text-right">
                  <span className="text-2xl font-serif font-semibold" style={{ color: step.color }}>
                    {step.value}
                  </span>
                  <span className="text-xs ml-1" style={{ color: '#94A3B8' }}>
                    de {step.total}
                  </span>
                </div>
              </div>

              {/* Drop arrow (except last) */}
              {!isLast && (
                <div className="flex flex-col items-center">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M6 8L0.803848 0.5L11.1962 0.5L6 8Z" fill="#D1DBE3" />
                  </svg>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
