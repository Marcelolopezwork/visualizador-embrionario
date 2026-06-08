import { EmbryoCase, PatientExplanation } from './types'
import { generateTemplateExplanation } from './templates'

export async function generateExplanation(data: EmbryoCase, tone: string): Promise<PatientExplanation> {
  try {
    const res = await fetch('/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseData: data, tone }),
    })
    if (!res.ok) throw new Error('API error')
    const json = await res.json()
    return json as PatientExplanation
  } catch {
    return generateTemplateExplanation(data, tone)
  }
}
