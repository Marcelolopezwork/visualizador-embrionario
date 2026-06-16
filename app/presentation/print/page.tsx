'use client'
import { useEffect, useState } from 'react'
import { EmbryoCase } from '@/lib/types'
import SceneCover from '@/components/presentation/SceneCover'
import SceneOocytes from '@/components/presentation/SceneOocytes'
import SceneMatureOocytes from '@/components/presentation/SceneMatureOocytes'
import SceneInjected from '@/components/presentation/SceneInjected'
import SceneFertilization from '@/components/presentation/SceneFertilization'
import SceneFunnel from '@/components/presentation/SceneFunnel'
import SceneTimeline from '@/components/presentation/SceneTimeline'
import SceneFinalResult from '@/components/presentation/SceneFinalResult'
import SceneClosing from '@/components/presentation/SceneClosing'

const SCENES: { component: React.ComponentType<{ data: EmbryoCase }>; label: string }[] = [
  { component: SceneCover,         label: 'Portada' },
  { component: SceneOocytes,       label: 'Ovocitos obtenidos' },
  { component: SceneMatureOocytes, label: 'Ovocitos maduros' },
  { component: SceneInjected,      label: 'Ovocitos inyectados' },
  { component: SceneFertilization, label: 'Fertilización' },
  { component: SceneFunnel,        label: 'Resumen del recorrido' },
  { component: SceneTimeline,      label: 'Evolución día a día' },
  { component: SceneFinalResult,   label: 'Resultado final' },
  { component: SceneClosing,       label: 'Explicación para la paciente' },
]

export default function PrintPage() {
  const [caseData, setCaseData] = useState<EmbryoCase | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('currentCase')
    if (stored) setCaseData(JSON.parse(stored))
  }, [])

  if (!caseData) return (
    <div className="min-h-screen flex items-center justify-center text-[#94A3B8]">
      Cargando presentación...
    </div>
  )

  return (
    <div className="bg-[#FAF7F4]">
      {/* Print controls — hidden when printing */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b border-[#E2E8F0] px-6 py-3 flex items-center justify-between">
        <div>
          <p className="font-medium text-[#1C2B3A] text-sm">Vista de impresión completa</p>
          <p className="text-xs text-[#94A3B8]">{caseData.patientName} · {caseData.procedureType}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => window.close()}
            className="px-3 py-1.5 text-sm text-[#94A3B8] hover:text-[#1C2B3A] transition-colors">
            Cerrar
          </button>
          <button onClick={() => window.print()}
            className="px-4 py-1.5 text-sm font-medium text-white rounded transition-colors"
            style={{ background: '#3A7D44' }}>
            Imprimir / Guardar PDF
          </button>
        </div>
      </div>

      {/* All scenes stacked — each on its own page */}
      {SCENES.map(({ component: Scene, label }, i) => (
        <div key={label}
          className="print-page relative bg-[#FAF7F4]"
          style={{
            minHeight: '100vh',
            pageBreakAfter: i < SCENES.length - 1 ? 'always' : 'auto',
            breakAfter: i < SCENES.length - 1 ? 'page' : 'auto',
          }}>

          {/* Page label — visible on screen, hidden when printing */}
          <div className="print:hidden absolute top-3 left-6 z-10">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-[#CBD5E1]">
              {i + 1} / {SCENES.length} — {label}
            </span>
          </div>

          {/* Scene content */}
          <div style={{ minHeight: '100vh' }}>
            <Scene data={caseData} />
          </div>

          {/* Footer on each page */}
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-between px-8 print:flex hidden">
            <span style={{ fontSize: 9, color: '#94A3B8' }}>
              Evolución Embrionaria — {caseData.patientName}
            </span>
            <span style={{ fontSize: 9, color: '#CBD5E1' }}>
              {i + 1} / {SCENES.length}
            </span>
          </div>
        </div>
      ))}

      <style>{`
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { background: #FAF7F4 !important; margin: 0; }
          .print\\:hidden { display: none !important; }
          .print-page {
            page-break-after: always;
            break-after: page;
            min-height: 100vh;
          }
          .print-page:last-child {
            page-break-after: avoid;
            break-after: avoid;
          }
          @page {
            size: A4 landscape;
            margin: 0;
          }
        }
      `}</style>
    </div>
  )
}
