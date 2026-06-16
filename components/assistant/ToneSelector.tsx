'use client'

const TONES = ['Claro y directo', 'Cálido y empático', 'Médico pero entendible']

interface Props { value: string; onChange: (v: string) => void }

export default function ToneSelector({ value, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {TONES.map(tone => (
        <button key={tone} onClick={() => onChange(tone)}
          className={`px-3 py-1.5 rounded text-sm border transition-colors ${value === tone ? 'bg-[#3A7D44] text-white border-[#3A7D44]' : 'border-[#CBD5E1] text-[#1C2B3A] hover:border-[#3A7D44]'}`}>
          {tone}
        </button>
      ))}
    </div>
  )
}
