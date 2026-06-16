import { NextRequest, NextResponse } from 'next/server'
import { generateTemplateExplanation } from '@/lib/templates'
import { EmbryoCase } from '@/lib/types'

export async function POST(req: NextRequest) {
  const { caseData, tone } = await req.json() as { caseData: EmbryoCase; tone: string }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(generateTemplateExplanation(caseData, tone))
  }

  try {
    const OpenAI = (await import('openai')).default
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const prompt = `Actúa como un asistente de comunicación médica especializado en fertilidad y reproducción asistida. Tu tarea es transformar datos técnicos de un informe de evolución embrionaria en una explicación clara, cercana y prudente para una paciente.

Reglas:
- No inventes datos.
- No prometas embarazo.
- No uses lenguaje alarmista.
- No reemplaces al médico.
- No des diagnóstico.
- Explica solo lo que los datos permiten decir.
- Usa lenguaje humano y comprensible.
- Mantén un tono sereno, profesional y empático.
- Si un dato no está disponible, omítelo.
- Evita tecnicismos o explícalos de forma sencilla.
- No menciones porcentajes de éxito salvo que estén explícitamente proporcionados.
- Termina recordando que el equipo médico explicará los siguientes pasos.
- Usa lenguaje prudente: nunca 'falló', 'murió', 'malo'. Usa en cambio: 'no continuó su desarrollo', 'no presentó fecundación adecuada', 'se detuvo durante la evolución'.

Datos del caso: ${JSON.stringify(caseData)}
Tono solicitado: ${tone}

Genera exactamente en este formato JSON (sin markdown, solo el objeto JSON):
{
  "generalSummary": "...",
  "fertilizationExplanation": "...",
  "embryoEvolutionExplanation": "...",
  "finalResultExplanation": "...",
  "closingMessage": "..."
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    })

    const text = completion.choices[0]?.message?.content ?? ''
    const json = JSON.parse(text)
    return NextResponse.json(json)
  } catch (err) {
    console.error(err)
    return NextResponse.json(generateTemplateExplanation(caseData, tone))
  }
}
