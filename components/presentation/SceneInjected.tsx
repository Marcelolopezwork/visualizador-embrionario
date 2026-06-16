import { EmbryoCase } from '@/lib/types'

interface Props { data: EmbryoCase }

export default function SceneInjected({ data }: Props) {
  const injected = data.oocytes.injectedOocytes ?? data.oocytes.miiOocytes ?? data.oocytes.totalOocytes

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-8">
      <h2 className="font-serif text-3xl text-[#1C2B3A] mb-3 text-center">Ovocitos inyectados</h2>
      <div className="w-12 h-px bg-[#C9A84C] mb-8" />
      <div className="flex items-center justify-center mb-10">
        <div className="relative">
          <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
            <circle cx="80" cy="80" r="75" fill="url(#injGrad)" stroke="#3A7D44" strokeWidth="2" />
            <circle cx="60" cy="60" r="18" fill="white" opacity="0.25" />
            <text x="80" y="90" textAnchor="middle" fontSize="48" fontWeight="700" fill="#3A7D44">{injected}</text>
            <defs><radialGradient id="injGrad" cx="35%" cy="30%" r="70%"><stop stopColor="#E8F4F8" /><stop offset="1" stopColor="#7DB88A" /></radialGradient></defs>
          </svg>
        </div>
      </div>
      <p className="text-xl text-[#1C2B3A] text-center max-w-lg">
        Se realizó el procedimiento de <strong className="text-[#3A7D44]">{data.procedureType}</strong> sobre <strong className="text-[#3A7D44]">{injected} ovocitos</strong>.
      </p>
    </div>
  )
}
