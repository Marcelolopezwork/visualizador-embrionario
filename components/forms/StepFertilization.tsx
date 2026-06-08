'use client'
import { FertilizationData } from '@/lib/types'
import { Input } from '@/components/ui/Input'

interface Props { data: FertilizationData; onChange: (p: Partial<FertilizationData>) => void }

const fields: { key: keyof FertilizationData; label: string; description: string }[] = [
  { key: 'twoPN', label: 'Fecundación adecuada (2PN)', description: 'Fecundación normal' },
  { key: 'notFertilized', label: 'No fertilizados', description: 'Sin fecundación' },
  { key: 'onePN', label: '1PN', description: 'Un pronúcleo' },
  { key: 'threePN', label: '3PN', description: 'Tres pronúcleos' },
  { key: 'cytolyzed', label: 'Citolizados', description: 'Daño celular' },
  { key: 'fertilizationAtretic', label: 'Atrésicos en fertilización', description: 'No aptos' },
]

export default function StepFertilization({ data, onChange }: Props) {
  return (
    <div className="space-y-5">
      <h2 className="font-serif text-xl text-[#1C2B3A]">Resultados de fertilización</h2>
      <div className="grid grid-cols-2 gap-4">
        {fields.map(f => (
          <div key={f.key}>
            <Input label={f.label} id={f.key} type="number" min={0}
              value={data[f.key] ?? ''}
              onChange={e => onChange({ [f.key]: e.target.value ? Number(e.target.value) : undefined } as Partial<FertilizationData>)}
              placeholder="0" />
            <p className="text-xs text-[#94A3B8] mt-0.5">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
