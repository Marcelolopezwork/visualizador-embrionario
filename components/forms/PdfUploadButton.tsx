'use client'
import { useRef, useState } from 'react'
import { EmbryoCase } from '@/lib/types'
import { parseLabReportText } from '@/lib/pdfParser'

interface Props {
  onParsed: (data: Partial<EmbryoCase>) => void
}

// Extract text from PDF in the browser using pdfjs-dist.
// Items are sorted by vertical position (top→bottom, left→right)
// to match pdftotext's reading order, which our parser expects.
async function extractTextFromPDFBrowser(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise

  let text = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const viewport = page.getViewport({ scale: 1 })
    const content = await page.getTextContent()

    type RawItem = { str: string; transform: number[] }
    type LineItem = { str: string; x: number; y: number }

    const items: LineItem[] = content.items
      .filter((it): it is RawItem => 'str' in it && !!(it as RawItem).str.trim())
      .map((it) => ({
        str: it.str.trim(),
        x: it.transform[4],
        y: viewport.height - it.transform[5], // flip: PDF y=0 is bottom
      }))

    // Group into lines: items within 6px vertically → same line
    const LINE_THRESHOLD = 6
    const lines: LineItem[][] = []
    for (const item of items.sort((a, b) => a.y - b.y)) {
      const last = lines[lines.length - 1]
      if (last && Math.abs(item.y - last[0].y) < LINE_THRESHOLD) {
        last.push(item)
      } else {
        lines.push([item])
      }
    }

    // Output each item on its own line (sorted Y then X).
    // Joining same-row items with spaces merges two-column headers (e.g. "Paciente Esposo"),
    // which breaks the label-based parser. One item per line keeps tokens isolated.
    for (const line of lines) {
      line.sort((a, b) => a.x - b.x)
      for (const item of line) {
        text += item.str + '\n'
      }
    }
  }
  return text
}

export default function PdfUploadButton({ onParsed }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      setError('El archivo debe ser un PDF.')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Extract text in the browser — works on Vercel and locally
      const text = await extractTextFromPDFBrowser(file)

      if (!text || text.trim().length < 30) {
        setError('No se pudo extraer texto del PDF. Verificá que no sea un PDF escaneado.')
        return
      }

      const parsed = parseLabReportText(text)
      onParsed(parsed)
      setSuccess(true)
    } catch (err) {
      console.error(err)
      setError('Error al procesar el PDF. Intentá de nuevo.')
    } finally {
      setLoading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFile}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 rounded border text-sm font-medium transition-all disabled:opacity-50"
        style={{ border: '1.5px dashed #3A7D44', color: '#3A7D44', background: '#F4FAF5' }}>
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-[#3A7D44] border-t-transparent rounded-full animate-spin" />
            Procesando informe...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1v9M4 6l4-5 4 5" stroke="#3A7D44" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke="#3A7D44" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Cargar informe PDF de laboratorio
          </>
        )}
      </button>

      {success && (
        <p className="text-xs text-green-700">✓ Datos extraídos. Revisá y corregí si es necesario.</p>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
