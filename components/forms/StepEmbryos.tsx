'use client'
import { useState } from 'react'
import { EmbryoEvolution, EmbryoStatus } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { StatusBadge } from '@/components/ui/Badge'

const DAYS: (keyof EmbryoEvolution)[] = ['day0', 'day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7']
const STATUS_OPTIONS: EmbryoStatus[] = ['criopreservado', 'transferido', 'detenido', 'no_viable', 'pendiente', 'NGS']
const STATUS_LABELS: Record<EmbryoStatus, string> = {
  criopreservado: 'Criopreservado', transferido: 'Transferido', detenido: 'Detenido',
  no_viable: 'No viable', pendiente: 'Pendiente', NGS: 'NGS'
}

interface Props { embryos: EmbryoEvolution[]; onChange: (e: EmbryoEvolution[]) => void }

export default function StepEmbryos({ embryos, onChange }: Props) {
  const [localEmbryo, setLocalEmbryo] = useState<EmbryoEvolution[]>(embryos)

  function add() {
    const next = [...localEmbryo, { embryoNumber: localEmbryo.length + 1 }]
    setLocalEmbryo(next)
    onChange(next)
  }

  function remove(index: number) {
    const next = localEmbryo.filter((_, i) => i !== index).map((e, i) => ({ ...e, embryoNumber: i + 1 }))
    setLocalEmbryo(next)
    onChange(next)
  }

  function update(index: number, patch: Partial<EmbryoEvolution>) {
    const next = localEmbryo.map((e, i) => i === index ? { ...e, ...patch } : e)
    setLocalEmbryo(next)
    onChange(next)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl text-[#1C2B3A]">Evolución embrionaria</h2>
        <Button size="sm" onClick={add}>+ Agregar embrión</Button>
      </div>

      {localEmbryo.length === 0 && (
        <p className="text-sm text-[#94A3B8] text-center py-8">No hay embriones registrados. Agregue al menos uno.</p>
      )}

      {localEmbryo.map((embryo, idx) => (
        <div key={idx} className="border border-[#E2E8F0] rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[#1C2B3A]">Embrión {embryo.embryoNumber}</span>
            <div className="flex items-center gap-2">
              {embryo.finalStatus && <StatusBadge status={embryo.finalStatus} />}
              <button onClick={() => remove(idx)}
                className="text-xs text-red-500 hover:text-red-700">Eliminar</button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {DAYS.map(day => (
              <Input key={day} label={`Día ${day.replace('day', '')}`} id={`${idx}-${day}`}
                value={(embryo[day] as string) ?? ''}
                onChange={e => update(idx, { [day]: e.target.value || undefined })}
                placeholder="—" />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#1C2B3A]">Estado final</label>
              <select value={embryo.finalStatus ?? ''}
                onChange={e => update(idx, { finalStatus: (e.target.value as EmbryoStatus) || undefined })}
                className="w-full px-3 py-2 border border-[#CBD5E1] rounded text-sm text-[#1C2B3A] bg-white focus:outline-none focus:ring-2 focus:ring-[#3A7D44]">
                <option value="">— Seleccionar —</option>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </div>
            <Input label="Calidad final" id={`${idx}-quality`}
              value={embryo.finalQuality ?? ''}
              onChange={e => update(idx, { finalQuality: e.target.value || undefined })}
              placeholder="Ej: AA, BB..." />
            <Input label="Notas" id={`${idx}-notes`}
              value={embryo.notes ?? ''}
              onChange={e => update(idx, { notes: e.target.value || undefined })}
              placeholder="Observaciones" />
          </div>
        </div>
      ))}
    </div>
  )
}
