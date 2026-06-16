// This route is kept as a server-side fallback (used when JS is disabled or for testing).
// In production (Vercel), PDF parsing runs client-side via pdfjs-dist in the browser.
// Locally with poppler installed, this route also works via pdftotext.

import { NextRequest, NextResponse } from 'next/server'
import { parseLabReportText } from '@/lib/pdfParser'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Try pdftotext (available locally with brew install poppler)
  try {
    const { execSync } = await import('child_process')
    const { writeFileSync, unlinkSync } = await import('fs')
    const tmpPath = `/tmp/lab_${Date.now()}.pdf`
    writeFileSync(tmpPath, buffer)
    const text = execSync(`pdftotext "${tmpPath}" -`, { timeout: 10000 }).toString()
    unlinkSync(tmpPath)
    if (text.trim().length > 30) {
      return NextResponse.json({ success: true, data: parseLabReportText(text) })
    }
  } catch {
    // pdftotext not available (Vercel) — client should use browser-side parsing
  }

  return NextResponse.json({
    error: 'Server-side PDF parsing not available. Use client-side parsing.',
  }, { status: 503 })
}
