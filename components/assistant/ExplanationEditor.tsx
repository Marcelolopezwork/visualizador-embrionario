'use client'
import { PatientExplanation } from '@/lib/types'

interface Props { explanation: PatientExplanation; onChange: (e: PatientExplanation) => void }

const SECTIONS: { key: keyof PatientExplanation; label: string }[] = [
  { key: 'generalSummary', label: 'Resumen general' },
  { key: 'fertilizationExplanation', label: 'Fertilización' },
  { key: 'embryoEvolutionExplanation', label: 'Evolución embrionaria' },
  { key: 'finalResultExplanation', label: 'Resultado final' },
  { key: 'closingMessage', label: 'Mensaje de cierre' },
]

export default function ExplanationEditor({ explanation, onChange }: Props) {
  function update(key: keyof PatientExplanation, value: string) {
    onChange({ ...explanation, [key]: value })
  }

  return (
    <div className="space-y-4">
      {SECTIONS.map(s => (
        <div key={s.key}>
          <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">{s.label}</label>
          <textarea rows={3} value={explanation[s.key]} onChange={e => update(s.key, e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-[#CBD5E1] rounded text-sm text-[#1C2B3A] bg-white focus:outline-none focus:ring-2 focus:ring-[#3A7D44] resize-y" />
        </div>
      ))}
    </div>
  )
}
