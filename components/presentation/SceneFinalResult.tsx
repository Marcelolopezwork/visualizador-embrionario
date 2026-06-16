import { EmbryoCase } from '@/lib/types'

interface Props { data: EmbryoCase }

function CryoIcon() {
  return (
    <svg width="80" height="100" viewBox="0 0 80 100" fill="none">
      <rect x="10" y="20" width="60" height="70" rx="8" fill="url(#cryoGrad)" stroke="#3A7D44" strokeWidth="1.5" />
      <rect x="25" y="10" width="30" height="16" rx="4" fill="#3A7D44" opacity="0.6" />
      <line x1="40" y1="30" x2="40" y2="85" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="15" y1="55" x2="65" y2="55" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
      <circle cx="40" cy="55" r="8" fill="white" opacity="0.15" />
      <defs>
        <linearGradient id="cryoGrad" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#A8D8E8" />
          <stop offset="1" stopColor="#3A7D44" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function SceneFinalResult({ data }: Props) {
  const r = data.finalResult
  const cryo = r.cryopreservedCount ?? 0
  const transferred = r.transferredCount ?? 0
  const stopped = data.embryos.filter(e => e.finalStatus === 'detenido' || e.finalStatus === 'no_viable').length

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-8">
      <h2 className="font-serif text-3xl text-[#1C2B3A] mb-3 text-center">Resultado final</h2>
      <div className="w-12 h-px bg-[#C9A84C] mb-10" />

      <div className="flex gap-12 mb-10 flex-wrap justify-center">
        {cryo > 0 && (
          <div className="flex flex-col items-center gap-3">
            <CryoIcon />
            <div className="text-center">
              <p className="text-3xl font-serif text-[#3A7D44]">{cryo}</p>
              <p className="text-sm text-[#94A3B8]">Embrión{cryo > 1 ? 'es' : ''} criopreservado{cryo > 1 ? 's' : ''}</p>
              {r.cryopreservationDay && <p className="text-xs text-[#94A3B8] mt-0.5">Día {r.cryopreservationDay}</p>}
            </div>
          </div>
        )}
        {transferred > 0 && (
          <div className="flex flex-col items-center gap-3">
            <svg width="80" height="100" viewBox="0 0 80 100" fill="none">
              <ellipse cx="40" cy="55" rx="32" ry="38" fill="url(#transGrad)" stroke="#4CAF7D" strokeWidth="1.5" />
              <ellipse cx="28" cy="38" rx="9" ry="11" fill="white" opacity="0.2" />
              <defs><radialGradient id="transGrad" cx="35%" cy="30%" r="70%"><stop stopColor="#E8F5EE" /><stop offset="1" stopColor="#4CAF7D" stopOpacity="0.7" /></radialGradient></defs>
            </svg>
            <div className="text-center">
              <p className="text-3xl font-serif text-green-600">{transferred}</p>
              <p className="text-sm text-[#94A3B8]">Embrión{transferred > 1 ? 'es' : ''} transferido{transferred > 1 ? 's' : ''}</p>
            </div>
          </div>
        )}
        {stopped > 0 && (
          <div className="flex flex-col items-center gap-3">
            <svg width="80" height="100" viewBox="0 0 80 100" fill="none">
              <ellipse cx="40" cy="55" rx="32" ry="38" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" opacity="0.6" />
            </svg>
            <div className="text-center">
              <p className="text-3xl font-serif text-[#94A3B8]">{stopped}</p>
              <p className="text-sm text-[#94A3B8]">No continuaron su desarrollo</p>
            </div>
          </div>
        )}
      </div>

      {(r.nextStep || r.customNextStepMessage) && (
        <div className="max-w-lg text-center">
          <div className="w-px h-8 bg-[#E2E8F0] mx-auto mb-4" />
          <p className="text-sm font-medium text-[#3A7D44] mb-1">Siguiente paso</p>
          <p className="text-[#1C2B3A]">{r.customNextStepMessage || r.nextStep}</p>
        </div>
      )}
    </div>
  )
}
