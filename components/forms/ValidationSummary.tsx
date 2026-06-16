'use client'
import { EmbryoCase } from '@/lib/types'
import { validateCase } from '@/lib/validation'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'

interface Props { caseData: EmbryoCase; onGenerate: () => void }

export default function ValidationSummary({ caseData, onGenerate }: Props) {
  const warnings = validateCase(caseData)

  return (
    <div className="space-y-5">
      <h2 className="font-serif text-xl text-[#1C2B3A]">Revisión antes de generar</h2>
      <p className="text-sm text-[#94A3B8]">Las advertencias son informativas. El médico puede continuar independientemente.</p>

      {warnings.length === 0 ? (
        <Alert variant="success" title="Sin advertencias">
          Los datos ingresados son consistentes. Puede generar la presentación.
        </Alert>
      ) : (
        <div className="space-y-2">
          {warnings.map((w, i) => (
            <Alert key={i} variant="warning" title="Advertencia">
              {w.message}
            </Alert>
          ))}
        </div>
      )}

      <div className="pt-4 border-t border-[#E2E8F0]">
        <h3 className="font-medium text-[#1C2B3A] mb-3 text-sm">Resumen del caso</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-[#94A3B8]">Paciente:</span><span className="text-[#1C2B3A]">{caseData.patientName || '—'}</span>
          <span className="text-[#94A3B8]">Procedimiento:</span><span className="text-[#1C2B3A]">{caseData.procedureType}</span>
          <span className="text-[#94A3B8]">Total ovocitos:</span><span className="text-[#1C2B3A]">{caseData.oocytes.totalOocytes}</span>
          <span className="text-[#94A3B8]">Embriones:</span><span className="text-[#1C2B3A]">{caseData.embryos.length}</span>
        </div>
      </div>

      <Button size="lg" className="w-full" onClick={onGenerate}>
        Generar presentación
      </Button>
    </div>
  )
}
