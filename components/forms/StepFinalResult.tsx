'use client'
import { FinalResult } from '@/lib/types'
import { Input } from '@/components/ui/Input'

interface Props { data: FinalResult; onChange: (p: Partial<FinalResult>) => void }

export default function StepFinalResult({ data, onChange }: Props) {
  return (
    <div className="space-y-5">
      <h2 className="font-serif text-xl text-[#1C2B3A]">Resultado final</h2>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Embriones transferidos" id="transferredCount" type="number" min={0}
          value={data.transferredCount ?? ''} onChange={e => onChange({ transferredCount: e.target.value ? Number(e.target.value) : undefined })} placeholder="0" />
        <Input label="Embriones criopreservados" id="cryopreservedCount" type="number" min={0}
          value={data.cryopreservedCount ?? ''} onChange={e => onChange({ cryopreservedCount: e.target.value ? Number(e.target.value) : undefined })} placeholder="0" />
        <Input label="Día de criopreservación" id="cryopreservationDay" type="number" min={0}
          value={data.cryopreservationDay ?? ''} onChange={e => onChange({ cryopreservationDay: e.target.value ? Number(e.target.value) : undefined })} placeholder="Ej: 5" />
        <div className="flex flex-col gap-1">
          <label htmlFor="nextStep" className="text-sm font-medium text-[#1C2B3A]">Siguiente paso</label>
          <input id="nextStep" value={data.nextStep ?? ''} onChange={e => onChange({ nextStep: e.target.value || undefined })}
            placeholder="Ej: NGS pendiente, transferencia programada..."
            className="w-full px-3 py-2 border border-[#CBD5E1] rounded text-sm text-[#1C2B3A] bg-white focus:outline-none focus:ring-2 focus:ring-[#3A7D44]" />
        </div>
        <div className="col-span-2 flex flex-col gap-1">
          <label htmlFor="customMsg" className="text-sm font-medium text-[#1C2B3A]">Mensaje personalizado (opcional)</label>
          <textarea id="customMsg" rows={3} value={data.customNextStepMessage ?? ''} onChange={e => onChange({ customNextStepMessage: e.target.value || undefined })}
            placeholder="Texto adicional para la paciente..."
            className="w-full px-3 py-2 border border-[#CBD5E1] rounded text-sm text-[#1C2B3A] bg-white focus:outline-none focus:ring-2 focus:ring-[#3A7D44] resize-none" />
        </div>
      </div>
    </div>
  )
}
