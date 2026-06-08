'use client'
import { EmbryoCase, ProcedureType } from '@/lib/types'
import { Input } from '@/components/ui/Input'

const procedureTypes: { value: ProcedureType; label: string }[] = [
  { value: 'ICSI', label: 'ICSI' },
  { value: 'FIV', label: 'FIV' },
  { value: 'CRIO_OVOCITOS', label: 'Criopreservación de ovocitos' },
]

interface Props {
  data: EmbryoCase
  onChange: (patch: Partial<EmbryoCase>) => void
}

export default function StepGeneralData({ data, onChange }: Props) {
  return (
    <div className="space-y-5">
      <h2 className="font-serif text-xl text-[#1C2B3A]">Datos generales del caso</h2>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Nombre de la paciente *" id="patientName" value={data.patientName} onChange={e => onChange({ patientName: e.target.value })} placeholder="Nombre completo" />
        <Input label="Edad" id="patientAge" type="number" value={data.patientAge ?? ''} onChange={e => onChange({ patientAge: e.target.value ? Number(e.target.value) : undefined })} placeholder="Años" />
        <Input label="Nombre del médico" id="doctorName" value={data.doctorName ?? ''} onChange={e => onChange({ doctorName: e.target.value })} placeholder="Dr./Dra." />
        <Input label="Fecha del procedimiento" id="procedureDate" type="date" value={data.procedureDate ?? ''} onChange={e => onChange({ procedureDate: e.target.value })} />
        <div className="flex flex-col gap-1">
          <label htmlFor="procedureType" className="text-sm font-medium text-[#1C2B3A]">Tipo de procedimiento *</label>
          <select id="procedureType" value={data.procedureType} onChange={e => onChange({ procedureType: e.target.value as ProcedureType })}
            className="w-full px-3 py-2 border border-[#CBD5E1] rounded text-sm text-[#1C2B3A] bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A7F]">
            {procedureTypes.map(pt => <option key={pt.value} value={pt.value}>{pt.label}</option>)}
          </select>
        </div>
        <Input label="Biólogo/a responsable" id="biologistName" value={data.biologistName ?? ''} onChange={e => onChange({ biologistName: e.target.value })} placeholder="Opcional" />
      </div>
    </div>
  )
}
