'use client'
import { useState, useReducer } from 'react'
import { useRouter } from 'next/navigation'
import { EmbryoCase, EmbryoEvolution, OocyteData, FertilizationData, FinalResult, ProcedureType } from '@/lib/types'
import { loadDemoCase, DEMO_CASES, DemoCaseOption } from '@/lib/demoCase'
import { Button } from '@/components/ui/Button'
import { ConcebírLogo } from '@/components/ui/ConcebírLogo'
import PdfUploadButton from './PdfUploadButton'
import StepGeneralData from './StepGeneralData'
import StepOocytes from './StepOocytes'
import StepFertilization from './StepFertilization'
import StepEmbryos from './StepEmbryos'
import StepFinalResult from './StepFinalResult'
import ValidationSummary from './ValidationSummary'

const STEPS = ['Datos generales', 'Ovocitos', 'Fertilización', 'Embriones', 'Resultado final', 'Validación']

type FormAction =
  | { type: 'SET_GENERAL'; payload: Partial<EmbryoCase> }
  | { type: 'SET_OOCYTES'; payload: Partial<OocyteData> }
  | { type: 'SET_FERTILIZATION'; payload: Partial<FertilizationData> }
  | { type: 'SET_EMBRYOS'; payload: EmbryoEvolution[] }
  | { type: 'SET_FINAL_RESULT'; payload: Partial<FinalResult> }
  | { type: 'LOAD_DEMO'; id: string }
  | { type: 'LOAD_PDF'; payload: Partial<EmbryoCase> }

function formReducer(state: EmbryoCase, action: FormAction): EmbryoCase {
  switch (action.type) {
    case 'SET_GENERAL': return { ...state, ...action.payload }
    case 'SET_OOCYTES': return { ...state, oocytes: { ...state.oocytes, ...action.payload } }
    case 'SET_FERTILIZATION': return { ...state, fertilization: { ...state.fertilization, ...action.payload } }
    case 'SET_EMBRYOS': return { ...state, embryos: action.payload }
    case 'SET_FINAL_RESULT': return { ...state, finalResult: { ...state.finalResult, ...action.payload } }
    case 'LOAD_DEMO': return loadDemoCase(action.id)
    case 'LOAD_PDF': return { ...state, ...action.payload, oocytes: { ...state.oocytes, ...(action.payload.oocytes ?? {}) }, fertilization: { ...state.fertilization, ...(action.payload.fertilization ?? {}) }, finalResult: { ...state.finalResult, ...(action.payload.finalResult ?? {}) }, embryos: action.payload.embryos ?? state.embryos }
    default: return state
  }
}

const initialState: EmbryoCase = {
  patientName: '',
  procedureType: 'ICSI',
  oocytes: { totalOocytes: 0 },
  fertilization: {},
  embryos: [],
  finalResult: {},
}

function DemoSelector({ onSelect, onClose }: { onSelect: (id: string) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(28,43,58,0.45)' }}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#1C2B3A] text-xl leading-none">&times;</button>

        <h3 className="font-serif text-xl text-[#1C2B3A] mb-1">Cargar caso de demostración</h3>
        <p className="text-sm text-[#94A3B8] mb-5">
          Datos anonimizados basados en informes reales de laboratorio. Útil para mostrar la herramienta al cliente.
        </p>

        <div className="space-y-3">
          {DEMO_CASES.map((demo: DemoCaseOption) => (
            <button key={demo.id} onClick={() => onSelect(demo.id)}
              className="w-full text-left rounded-xl border border-[#E2E8F0] p-4 hover:border-[#3A7D44] hover:bg-[#F8FBFD] transition-all group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#1C2B3A] group-hover:text-[#3A7D44] transition-colors">
                    {demo.label}
                  </p>
                  <p className="text-xs text-[#94A3B8] mt-0.5">{demo.description}</p>
                </div>
                <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{ background: demo.tagColor + '18', color: demo.tagColor, border: `1px solid ${demo.tagColor}33` }}>
                  {demo.tag}
                </span>
              </div>
            </button>
          ))}
        </div>

        <p className="text-[10px] text-[#94A3B8] mt-4 text-center">
          Los nombres son ficticios. Los datos clínicos reflejan patrones reales de laboratorio.
        </p>
      </div>
    </div>
  )
}

export default function CaseFormShell() {
  const [step, setStep] = useState(0)
  const [state, dispatch] = useReducer(formReducer, initialState)
  const [showDemoSelector, setShowDemoSelector] = useState(false)
  const router = useRouter()

  function handleSelectDemo(id: string) {
    dispatch({ type: 'LOAD_DEMO', id })
    setShowDemoSelector(false)
    setStep(0)
  }

  function handleGenerate() {
    localStorage.setItem('currentCase', JSON.stringify(state))
    router.push('/presentation/preview')
  }

  return (
    <div className="min-h-screen bg-[#FAF7F4]">
      {showDemoSelector && (
        <DemoSelector onSelect={handleSelectDemo} onClose={() => setShowDemoSelector(false)} />
      )}

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <ConcebírLogo size={28} />
            <p className="text-xs text-[#94A3B8] mt-2">Paso {step + 1} de {STEPS.length}: {STEPS[step]}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowDemoSelector(true)}>
            Cargar caso demo
          </Button>
        </div>

        {/* PDF upload banner */}
        <div className="mb-6 bg-white rounded-xl border border-[#D6EBD9] px-5 py-4">
          <p className="text-sm font-medium text-[#1C2B3A] mb-2">Cargá el informe de laboratorio</p>
          <p className="text-xs text-[#94A3B8] mb-3">El sistema extrae automáticamente los datos del PDF y completa el formulario.</p>
          <PdfUploadButton onParsed={(data) => {
            dispatch({ type: 'LOAD_PDF', payload: data })
            setStep(0)
          }} />
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-[#3A7D44]' : 'bg-[#E2E8F0]'}`} />
          ))}
        </div>

        {/* Step content */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-8">
          {step === 0 && <StepGeneralData data={state} onChange={(p) => dispatch({ type: 'SET_GENERAL', payload: p })} />}
          {step === 1 && <StepOocytes data={state.oocytes} onChange={(p) => dispatch({ type: 'SET_OOCYTES', payload: p })} />}
          {step === 2 && <StepFertilization data={state.fertilization} onChange={(p) => dispatch({ type: 'SET_FERTILIZATION', payload: p })} />}
          {step === 3 && <StepEmbryos embryos={state.embryos} onChange={(e) => dispatch({ type: 'SET_EMBRYOS', payload: e })} />}
          {step === 4 && <StepFinalResult data={state.finalResult} onChange={(p) => dispatch({ type: 'SET_FINAL_RESULT', payload: p })} />}
          {step === 5 && <ValidationSummary caseData={state} onGenerate={handleGenerate} />}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button variant="ghost" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>
            Anterior
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}>
              Siguiente
            </Button>
          ) : (
            <Button onClick={handleGenerate} size="lg">
              Generar presentación
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
