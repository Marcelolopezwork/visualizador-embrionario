'use client'
import { useState } from 'react'
import { EmbryoCase } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import SceneCover from './SceneCover'
import SceneOocytes from './SceneOocytes'
import SceneMatureOocytes from './SceneMatureOocytes'
import SceneInjected from './SceneInjected'
import SceneFertilization from './SceneFertilization'
import SceneFunnel from './SceneFunnel'
import SceneTimeline from './SceneTimeline'
import SceneFinalResult from './SceneFinalResult'
import SceneClosing from './SceneClosing'
import { AnimatePresence, motion } from 'framer-motion'

interface Props { caseData: EmbryoCase }

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

export default function PresentationShell({ caseData }: Props) {
  const [current, setCurrent] = useState(0)
  const total = SCENES.length
  const SceneComponent = SCENES[current].component

  function handleExport() {
    // Save case to localStorage so the print page can read it
    localStorage.setItem('currentCase', JSON.stringify(caseData))
    window.open('/presentation/print', '_blank')
  }

  return (
    <div className="min-h-screen bg-[#FAF7F4] flex flex-col">
      {/* Top nav */}
      <div className="print:hidden fixed top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-b border-[#E2E8F0] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[#1C2B3A]">{SCENES[current].label}</span>
          <span className="text-xs text-[#94A3B8]">{current + 1} / {total}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setCurrent(0)}>Reiniciar</Button>
          <Button variant="secondary" size="sm" onClick={handleExport}>
            Exportar / Imprimir PDF
          </Button>
        </div>
      </div>

      {/* Scene */}
      <div className="flex-1 pt-16 pb-20">
        <AnimatePresence mode="wait">
          <motion.div key={current}
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.32 }}
            className="h-full">
            <SceneComponent data={caseData} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div className="print:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-[#E2E8F0] px-6 py-4 flex items-center justify-between">
        <div className="flex gap-1.5">
          {SCENES.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-[#3A7D44]' : 'bg-[#CBD5E1] hover:bg-[#94A3B8]'}`} />
          ))}
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm"
            onClick={() => setCurrent(c => Math.max(0, c - 1))}
            disabled={current === 0}>
            Anterior
          </Button>
          <Button size="sm"
            onClick={() => setCurrent(c => Math.min(total - 1, c + 1))}
            disabled={current === total - 1}>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
