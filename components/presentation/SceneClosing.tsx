'use client'
import { useState } from 'react'
import { EmbryoCase } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import AssistantPanel from '@/components/assistant/AssistantPanel'

interface Props { data: EmbryoCase }

export default function SceneClosing({ data }: Props) {
  const explanation = data.editedExplanation || data.aiExplanation
  const [showAssistant, setShowAssistant] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-8">
      <h2 className="font-serif text-3xl text-[#1C2B3A] mb-3 text-center">Un mensaje para ti</h2>
      <div className="w-12 h-px bg-[#C9A84C] mb-8" />

      <div className="max-w-2xl text-center space-y-6">
        {explanation ? (
          <>
            <p className="text-lg text-[#1C2B3A] leading-relaxed">{explanation.closingMessage}</p>
            <div className="space-y-4 text-left bg-[#FAF7F4] rounded-lg p-6">
              <div>
                <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">Resumen general</p>
                <p className="text-sm text-[#1C2B3A]">{explanation.generalSummary}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">Fertilización</p>
                <p className="text-sm text-[#1C2B3A]">{explanation.fertilizationExplanation}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">Evolución embrionaria</p>
                <p className="text-sm text-[#1C2B3A]">{explanation.embryoEvolutionExplanation}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">Resultado</p>
                <p className="text-sm text-[#1C2B3A]">{explanation.finalResultExplanation}</p>
              </div>
            </div>
          </>
        ) : (
          <p className="text-[#94A3B8]">
            Este resumen visual busca ayudarte a comprender de forma más clara cómo evolucionó tu proceso. El equipo médico continuará acompañándote en los siguientes pasos.
          </p>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-800 text-left print:hidden">
          <strong>Aviso:</strong> Este texto es una ayuda comunicacional para el médico. Debe ser revisado y validado por el especialista antes de mostrarse a la paciente.
        </div>

        {!showAssistant && (
          <Button variant="secondary" size="sm" onClick={() => setShowAssistant(true)} className="print:hidden">
            Generar explicación para la paciente
          </Button>
        )}
        {showAssistant && <AssistantPanel data={data} />}
      </div>
    </div>
  )
}
