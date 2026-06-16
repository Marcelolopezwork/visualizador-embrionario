'use client'
import { motion } from 'framer-motion'
import { EmbryoCase, EmbryoEvolution, EmbryoStatus } from '@/lib/types'

interface Props { data: EmbryoCase }

const DAY_KEYS: (keyof EmbryoEvolution)[] = ['day0', 'day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7']
const DAY_LABELS = ['Día 0', 'Día 1', 'Día 2', 'Día 3', 'Día 4', 'Día 5', 'Día 6', 'Día 7']

const STATUS_ACTIVE: EmbryoStatus[] = ['criopreservado', 'transferido', 'pendiente', 'NGS']

const STATUS_CONFIG: Record<EmbryoStatus, { label: string; color: string; bg: string; border: string; dot: string }> = {
  criopreservado: { label: 'Criopreservado', color: '#2A6332', bg: '#EAF4EC', border: '#3A7D44', dot: '#3A7D44' },
  transferido:    { label: 'Transferido',    color: '#1A6645', bg: '#EAF6EF', border: '#27AE74', dot: '#27AE74' },
  detenido:       { label: 'Detenido',       color: '#64748B', bg: '#F1F5F9', border: '#94A3B8', dot: '#94A3B8' },
  no_viable:      { label: 'No viable',      color: '#94A3B8', bg: '#F8FAFC', border: '#CBD5E1', dot: '#CBD5E1' },
  pendiente:      { label: 'Pendiente',      color: '#92660A', bg: '#FEF9EC', border: '#C9A84C', dot: '#C9A84C' },
  NGS:            { label: 'NGS',            color: '#5B4397', bg: '#F3F0FB', border: '#7C6FAF', dot: '#7C6FAF' },
}

function isActive(status?: EmbryoStatus) {
  return !status || STATUS_ACTIVE.includes(status)
}

function getLastActiveDay(embryo: EmbryoEvolution): number {
  let last = -1
  DAY_KEYS.forEach((k, i) => { if (embryo[k]) last = i })
  return last
}

function EmbryoOrb({ status, size = 28 }: { status?: EmbryoStatus; size?: number }) {
  const cfg = status ? STATUS_CONFIG[status] : null
  const fill = cfg?.border ?? '#CBD5E1'
  const active = isActive(status)
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" style={{ opacity: active ? 1 : 0.45 }}>
      <defs>
        <radialGradient id={`og-${status ?? 'none'}`} cx="38%" cy="32%" r="68%">
          <stop stopColor="white" stopOpacity="0.55" />
          <stop offset="1" stopColor={fill} stopOpacity="0.9" />
        </radialGradient>
        <filter id={`blur-${status ?? 'none'}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <circle cx="14" cy="14" r="12.5" fill={`url(#og-${status ?? 'none'})`} stroke={fill} strokeWidth="1" />
      <ellipse cx="10" cy="10" rx="3.5" ry="2.5" fill="white" opacity="0.35" />
    </svg>
  )
}

function DayCell({ value, isLast, active }: { value?: string; isLast: boolean; active: boolean }) {
  if (!value) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: active ? '#D1DBE3' : '#EDF0F2' }} />
      </div>
    )
  }

  const isBlastocyst = /bl\./i.test(value)
  const isMorula = /morula/i.test(value)

  return (
    <div className="flex flex-col items-center justify-center gap-0.5">
      <div
        className="px-2 py-1 rounded text-[10px] font-semibold leading-tight text-center"
        style={{
          background: isLast
            ? (active ? '#3A7D44' : '#94A3B8')
            : isBlastocyst
            ? '#EAF4EC'
            : isMorula
            ? '#F3F0FB'
            : '#F1F5F9',
          color: isLast
            ? 'white'
            : isBlastocyst
            ? '#2A6332'
            : isMorula
            ? '#5B4397'
            : '#475569',
          border: `1px solid ${isLast ? 'transparent' : isBlastocyst ? '#3A7D4433' : '#E2E8F0'}`,
          maxWidth: 74,
          wordBreak: 'break-word',
        }}
      >
        {value}
      </div>
    </div>
  )
}

function ProgressTrack({ embryo, active }: { embryo: EmbryoEvolution; active: boolean }) {
  const lastDay = getLastActiveDay(embryo)
  return (
    <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex items-center px-2" style={{ zIndex: 0 }}>
      {DAY_KEYS.map((_, i) => {
        if (i === DAY_KEYS.length - 1) return null
        const filled = i < lastDay && active
        return (
          <div key={i} className="flex-1 h-px transition-colors"
            style={{ background: filled ? '#3A7D4433' : '#E9EDF0' }} />
        )
      })}
    </div>
  )
}

export default function SceneTimeline({ data }: Props) {
  const embryos = data.embryos
  const activeCount = embryos.filter(e => isActive(e.finalStatus)).length
  const cryoCount = embryos.filter(e => e.finalStatus === 'criopreservado').length
  const transferCount = embryos.filter(e => e.finalStatus === 'transferido').length
  const stoppedCount = embryos.filter(e => !isActive(e.finalStatus)).length

  return (
    <div className="flex flex-col min-h-[calc(100vh-140px)] px-6 py-6 max-w-[1200px] mx-auto w-full">

      {/* Header */}
      <motion.div className="text-center mb-6" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="font-serif text-3xl text-[#1C2B3A] mb-2">Evolución embrionaria día a día</h2>
        <div className="w-12 h-px bg-[#C9A84C] mx-auto mb-4" />
        {/* Summary chips */}
        <div className="flex gap-3 justify-center flex-wrap">
          {cryoCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" style={{ background: '#EAF4EC', color: '#2A6332', border: '1px solid #3A7D4433' }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#3A7D44' }} />
              {cryoCount} criopreservado{cryoCount > 1 ? 's' : ''}
            </span>
          )}
          {transferCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" style={{ background: '#EAF6EF', color: '#1A6645', border: '1px solid #27AE7433' }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#27AE74' }} />
              {transferCount} transferido{transferCount > 1 ? 's' : ''}
            </span>
          )}
          {stoppedCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" style={{ background: '#F8FAFC', color: '#64748B', border: '1px solid #CBD5E133' }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#CBD5E1' }} />
              {stoppedCount} no continuaron su desarrollo
            </span>
          )}
        </div>
      </motion.div>

      {/* Timeline grid */}
      <div className="flex-1 overflow-x-auto">
        <div style={{ minWidth: 820 }}>

          {/* Day header row */}
          <div className="grid mb-2" style={{ gridTemplateColumns: '96px repeat(8, 1fr) 120px' }}>
            <div />
            {DAY_LABELS.map((label, i) => (
              <div key={i} className="text-center">
                <span className="text-[11px] font-semibold tracking-wide uppercase" style={{ color: '#94A3B8' }}>{label}</span>
              </div>
            ))}
            <div className="text-center">
              <span className="text-[11px] font-semibold tracking-wide uppercase" style={{ color: '#94A3B8' }}>Resultado</span>
            </div>
          </div>

          {/* Embryo rows */}
          <div className="space-y-2">
            {embryos.map((embryo, idx) => {
              const active = isActive(embryo.finalStatus)
              const status = embryo.finalStatus
              const cfg = status ? STATUS_CONFIG[status] : null
              const lastDay = getLastActiveDay(embryo)

              return (
                <motion.div key={embryo.embryoNumber}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06, duration: 0.35, ease: 'easeOut' }}
                  className="grid items-center rounded-xl overflow-hidden"
                  style={{
                    gridTemplateColumns: '96px repeat(8, 1fr) 120px',
                    background: active ? (cfg?.bg ?? '#F8FAFC') : '#F8FAFC',
                    border: `1px solid ${active ? (cfg?.border ?? '#CBD5E1') + '40' : '#E9EDF0'}`,
                    opacity: active ? 1 : 0.55,
                    minHeight: 56,
                  }}>

                  {/* Embryo label */}
                  <div className="flex items-center gap-2 px-3 py-2">
                    <EmbryoOrb status={embryo.finalStatus} size={26} />
                    <div>
                      <p className="text-xs font-semibold" style={{ color: active ? '#1C2B3A' : '#94A3B8' }}>
                        #{embryo.embryoNumber}
                      </p>
                    </div>
                  </div>

                  {/* Day cells */}
                  {DAY_KEYS.map((dk, di) => {
                    const val = embryo[dk] as string | undefined
                    const isLast = di === lastDay && !!val
                    return (
                      <div key={dk} className="px-1 py-2 flex items-center justify-center" style={{ minHeight: 56 }}>
                        <DayCell value={val} isLast={isLast} active={active} />
                      </div>
                    )
                  })}

                  {/* Status cell */}
                  <div className="px-3 py-2 flex flex-col items-center justify-center gap-1">
                    {cfg && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}55` }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
                        {cfg.label}
                      </span>
                    )}
                    {embryo.finalQuality && (
                      <span className="text-[10px] font-mono font-bold" style={{ color: cfg?.color ?? '#94A3B8' }}>
                        {embryo.finalQuality}
                      </span>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <motion.div
        className="mt-5 flex gap-5 justify-center flex-wrap"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        {(Object.entries(STATUS_CONFIG) as [EmbryoStatus, typeof STATUS_CONFIG[EmbryoStatus]][])
          .filter(([s]) => embryos.some(e => e.finalStatus === s))
          .map(([s, cfg]) => (
            <div key={s} className="flex items-center gap-1.5 text-[11px]" style={{ color: '#64748B' }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: cfg.dot }} />
              {cfg.label}
            </div>
          ))}
      </motion.div>
    </div>
  )
}
