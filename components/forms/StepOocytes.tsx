'use client'
import { OocyteData } from '@/lib/types'
import { Input } from '@/components/ui/Input'

interface Props { data: OocyteData; onChange: (p: Partial<OocyteData>) => void }

const fields: { key: keyof OocyteData; label: string; required?: boolean }[] = [
  { key: 'totalOocytes', label: 'Total de ovocitos obtenidos *', required: true },
  { key: 'decumulatedOocytes', label: 'Ovocitos decumulados' },
  { key: 'vgOocytes', label: 'Ovocitos VG (vesícula germinal)' },
  { key: 'miOocytes', label: 'Ovocitos MI' },
  { key: 'miiOocytes', label: 'Ovocitos MII (maduros)' },
  { key: 'atreticOocytes', label: 'Ovocitos atrésicos' },
  { key: 'injectedOocytes', label: 'Ovocitos inyectados' },
]

export default function StepOocytes({ data, onChange }: Props) {
  return (
    <div className="space-y-5">
      <h2 className="font-serif text-xl text-[#1C2B3A]">Datos de ovocitos</h2>
      <div className="grid grid-cols-2 gap-4">
        {fields.map(f => (
          <Input key={f.key} label={f.label} id={f.key} type="number" min={0}
            value={data[f.key] ?? ''}
            onChange={e => onChange({ [f.key]: e.target.value ? Number(e.target.value) : undefined } as Partial<OocyteData>)}
            placeholder="0" />
        ))}
      </div>
    </div>
  )
}
