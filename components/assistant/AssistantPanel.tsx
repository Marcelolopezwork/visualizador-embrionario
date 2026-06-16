'use client'
import { useState } from 'react'
import { EmbryoCase, PatientExplanation } from '@/lib/types'
import { generateExplanation } from '@/lib/ai'
import { Button } from '@/components/ui/Button'
import ToneSelector from './ToneSelector'
import ExplanationEditor from './ExplanationEditor'

interface Props { data: EmbryoCase }

export default function AssistantPanel({ data }: Props) {
  const [tone, setTone] = useState('Cálido y empático')
  const [explanation, setExplanation] = useState<PatientExplanation | null>(data.editedExplanation ?? data.aiExplanation ?? null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    try {
      const result = await generateExplanation(data, tone)
      setExplanation(result)
    } catch {
      setError('No se pudo generar la explicación. Se usará una plantilla.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="text-left space-y-4 w-full">
      <div>
        <p className="text-sm font-medium text-[#1C2B3A] mb-2">Tono de comunicación</p>
        <ToneSelector value={tone} onChange={setTone} />
      </div>

      <Button onClick={handleGenerate} disabled={loading} variant="primary">
        {loading ? 'Generando...' : explanation ? 'Regenerar explicación' : 'Generar explicación'}
      </Button>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
          <div className="w-4 h-4 border-2 border-[#3A7D44] border-t-transparent rounded-full animate-spin" />
          Generando texto para la paciente...
        </div>
      )}

      {error && <p className="text-sm text-amber-700">{error}</p>}

      {explanation && (
        <div>
          <p className="text-sm font-medium text-[#1C2B3A] mb-2">Editar texto</p>
          <ExplanationEditor explanation={explanation} onChange={setExplanation} />
        </div>
      )}
    </div>
  )
}
