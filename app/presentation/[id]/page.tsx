'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { EmbryoCase } from '@/lib/types'
import PresentationShell from '@/components/presentation/PresentationShell'
import { getCaseById } from '@/lib/supabaseClient'

export default function PresentationPage() {
  const params = useParams()
  const id = params?.id as string
  const [caseData, setCaseData] = useState<EmbryoCase | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (id === 'preview') {
        const stored = localStorage.getItem('currentCase')
        if (stored) setCaseData(JSON.parse(stored))
      } else {
        const row = await getCaseById(id)
        if (row) {
          setCaseData({
            id: row.id,
            patientName: row.patient_name,
            patientAge: row.patient_age,
            doctorName: row.doctor_name,
            procedureDate: row.procedure_date,
            procedureType: row.procedure_type,
            biologistName: row.biologist_name,
            oocytes: row.oocytes,
            fertilization: row.fertilization,
            embryos: row.embryos,
            finalResult: row.final_result,
            aiExplanation: row.ai_explanation,
            editedExplanation: row.edited_explanation,
          })
        }
      }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="min-h-screen bg-[#FAF7F4] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#3A7D44] border-t-transparent rounded-full animate-spin" /></div>
  if (!caseData) return <div className="min-h-screen bg-[#FAF7F4] flex items-center justify-center text-[#94A3B8]">Caso no encontrado.</div>

  return <PresentationShell caseData={caseData} />
}
