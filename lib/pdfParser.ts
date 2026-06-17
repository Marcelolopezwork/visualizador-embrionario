import { EmbryoCase, EmbryoEvolution, EmbryoStatus } from './types'

/**
 * Parses pdftotext output from a FileMaker/Concebir ICSI lab report.
 * The PDF lays out columns horizontally; pdftotext reads them top-to-bottom
 * so embryo data is scattered across lines, not row-by-row.
 */
export function parseLabReportText(raw: string): Partial<EmbryoCase> {
  const lines = raw.split('\n').map(l => l.trim())
  const nonEmpty = lines.filter(Boolean)
  const text = nonEmpty.join('\n')

  // ── Procedure type ──────────────────────────────────────────────
  const procedureType: EmbryoCase['procedureType'] =
    /ICSI/i.test(text) ? 'ICSI' :
    /FIV/i.test(text) ? 'FIV' :
    /CRI[OO]/i.test(text) ? 'CRIO_OVOCITOS' : 'ICSI'

  // ── Patient name ────────────────────────────────────────────────
  // Line 5: "Paciente", Line 6: "YOVANNA CCORA MENDOZA"
  const patientName = lineAfterLabel(nonEmpty, /^Paciente$/i)

  // ── Age ─────────────────────────────────────────────────────────
  const ageMatch = text.match(/(\d+)\s*años/)
  const patientAge = ageMatch ? parseInt(ageMatch[1], 10) : undefined

  // ── Date ────────────────────────────────────────────────────────
  const dateMatch = text.match(/Fecha Procedimiento\s+(\d{1,2}\/\d{1,2}\/\d{4})/)
  const procedureDate = dateMatch ? toISO(dateMatch[1]) : undefined

  // ── Doctor ──────────────────────────────────────────────────────
  // "Medico" label then two lines: "Edwin Victor Canales\nRimachi"
  const medicoIdx = nonEmpty.findIndex(l => /^M[eé]dico$/i.test(l))
  // Skip adjacent-column labels and age-only lines to reach doctor's name
  const doctorFull = medicoIdx >= 0
    ? (() => {
        for (let i = medicoIdx + 1; i < Math.min(medicoIdx + 6, nonEmpty.length); i++) {
          const l = nonEmpty[i]
          if (l && l.length > 2 && !/^\d+\s*(años)?$/.test(l) && !ADJACENT_LABELS.test(l)) return l.trim()
        }
        return undefined
      })()
    : undefined
  const doctorName = doctorFull

  // ── Biologist ───────────────────────────────────────────────────
  // "Luis Guzman Masias\nBiologo"
  const bioIdx = nonEmpty.findIndex(l => /^Bi[oó]logo$/i.test(l))
  const biologistName = bioIdx > 0 ? nonEmpty[bioIdx - 1]?.trim() : undefined

  // ── Oocytes ─────────────────────────────────────────────────────
  // With per-item pdfjs output, each label and its value are adjacent lines.
  // Use numberAfterLabel which scans ahead skipping non-digit tokens.
  const totalOocytes = numberAfterLabel(nonEmpty, /^Total$/) ?? 0
  const decumulatedOocytes = numberAfterLabel(nonEmpty, /^D[eé]cumulados$|^Desacumulados$/) || undefined
  const miiOocytes = numberAfterLabel(nonEmpty, /^MII$/) || undefined
  const miOocytes = numberAfterLabel(nonEmpty, /^MI$/) || undefined
  const vgOocytes = numberAfterLabel(nonEmpty, /^VG$/) || undefined
  const atreticOocytes = numberAfterLabel(nonEmpty, /^Atres\.$/) || undefined
  const injMatch = text.match(/Ovocitos inyectados[\s\n]+(\d+)/)
  const injectedOocytes = injMatch
    ? parseInt(injMatch[1], 10)
    : numberAfterLabel(nonEmpty, /^Ovocitos inyectados$/)

  // ── Fertilization ───────────────────────────────────────────────
  // "No fecundado\n1 PN\n3\n\n2 PN\n5\n\n50\n\nSemen...\n\n3 PN\n1\nCitolizados\n1"
  // The "50" is motility — citolizados appears after Semen Fresco section
  // In this PDF layout: "No fecundado\n1 PN\n3" — the '3' is actually notFertilized count
  // pdftotext reads column headers then values: NF_label, 1PN_label, NF_value
  // Fertilization: labels appear together then values follow in the same order.
  // Works for both pdftotext (column-separated) and pdfjs per-item output.
  const noFertMatch = text.match(/No fecundado\s*\n(?:1 PN\s*\n)?(\d+)/)
  const notFertilized = noFertMatch ? parseInt(noFertMatch[1], 10) : undefined

  const onePNMatch = text.match(/1 PN\s*\n(\d+)\s*\n(?:\n|2 PN)/)
  const onePN = onePNMatch ? parseInt(onePNMatch[1], 10) : undefined

  const twoPNMatch = text.match(/2 PN\s*\n(\d+)/)
  const twoPN = twoPNMatch ? parseInt(twoPNMatch[1], 10) : undefined

  const threePNMatch = text.match(/3 PN\s*\n(\d+)/)
  const threePN = threePNMatch ? parseInt(threePNMatch[1], 10) : undefined

  const citoMatch = text.match(/Citolizados\s*\n(\d+)/)
  const cytolyzed = citoMatch ? parseInt(citoMatch[1], 10) : undefined

  // ── Embryo table ────────────────────────────────────────────────
  // After "OUT" the embryo data appears as:
  // embryo_number\nday0_value /\nday4_value /\n...\nSTATUS_LETTER
  // We find the section between "OUT" and "mn:"
  const embryos = extractEmbryos(text)

  // ── Final result ─────────────────────────────────────────────────
  // In the two-column PDF, "Transferido" (left) and "Criopreservado" (right) share a row.
  // Per-item output (Y→X sorted) gives: Transferido, Criopreservado, 0, 5, Día..., Día Crio., 6
  // Since both labels appear before their values, we collect numbers after both labels
  // and assign them left-to-right (Transferido gets 1st number, Criopreservado gets 2nd).
  const xferLabelIdx = nonEmpty.findIndex(l => /^Transferido$/.test(l))
  const cryoLabelIdx = nonEmpty.findIndex(l => /^Criopreservado$/.test(l))

  let transferredCount: number | undefined
  let cryopreservedCount: number | undefined
  let cryopreservationDay: number | undefined

  if (xferLabelIdx >= 0 && cryoLabelIdx >= 0) {
    // Collect the first 3 numbers after the earlier of the two labels
    const scanFrom = Math.min(xferLabelIdx, cryoLabelIdx) + 1
    const resultNums: number[] = []
    for (let i = scanFrom; i < Math.min(scanFrom + 15, nonEmpty.length); i++) {
      const n = parseInt(nonEmpty[i], 10)
      if (!isNaN(n) && String(n) === nonEmpty[i] && n < 1000) {
        resultNums.push(n)
        if (resultNums.length >= 3) break
      }
    }
    // Left column (Transferido) appears first in X, so its value is resultNums[0]
    // Right column (Criopreservado) value is resultNums[1]; cryoDay is resultNums[2]
    if (xferLabelIdx < cryoLabelIdx) {
      transferredCount = resultNums[0]
      cryopreservedCount = resultNums[1]
      cryopreservationDay = resultNums[2]
    } else {
      cryopreservedCount = resultNums[0]
      transferredCount = resultNums[1]
      cryopreservationDay = resultNums[2]
    }
  } else {
    transferredCount = xferLabelIdx >= 0 ? numberAfterLabel(nonEmpty, /^Transferido$/) : undefined
    cryopreservedCount = cryoLabelIdx >= 0 ? numberAfterLabel(nonEmpty, /^Criopreservado$/) : undefined
    cryopreservationDay = numberAfterLabel(nonEmpty, /^D[ií]a Crio\.$/)
  }

  return {
    patientName: patientName || undefined,
    patientAge,
    doctorName: doctorFull || undefined,
    biologistName,
    procedureDate,
    procedureType,
    oocytes: {
      totalOocytes,
      decumulatedOocytes,
      vgOocytes,
      miOocytes,
      miiOocytes,
      atreticOocytes,
      injectedOocytes,
    },
    fertilization: { notFertilized, onePN, twoPN, threePN, cytolyzed },
    embryos,
    finalResult: { transferredCount, cryopreservedCount, cryopreservationDay },
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

// Labels that appear adjacent (right-column) in the two-column PDF layout.
// When pdfjs outputs items one-per-line sorted by Y, these appear right after
// a left-column label — we skip them to reach the actual value.
const ADJACENT_LABELS = /^(Esposo|C[oó]nyuge|Pareja|M[eé]dico|Bi[oó]logo|Bi[oó]loga|Fecha\b|Total\b|MII\b|MI\b|VG\b|Atres\.|Decumulados|Desacumulados|OUT\b|Inducci[oó]n|Punci[oó]n|Transferencia|Criopreservado|Citolizados|No fecundado|[123] PN|Semen|NGS|NF)$/i

function lineAfterLabel(lines: string[], pattern: RegExp): string | undefined {
  const idx = lines.findIndex(l => pattern.test(l))
  if (idx < 0) return undefined
  // Skip adjacent-column labels and pure-digit lines to reach the actual value
  for (let i = idx + 1; i < Math.min(idx + 6, lines.length); i++) {
    const l = lines[i]
    if (l && l.length > 2 && !/^\d+$/.test(l) && !ADJACENT_LABELS.test(l)) return l.trim()
  }
  return undefined
}

function numberAfterLabel(lines: string[], pattern: RegExp): number | undefined {
  const idx = lines.findIndex(l => pattern.test(l))
  if (idx < 0) return undefined
  // Search further — labels are grouped together before their values in this PDF format
  for (let i = idx + 1; i < Math.min(idx + 12, lines.length); i++) {
    const n = parseInt(lines[i], 10)
    if (!isNaN(n) && n < 1000 && String(n) === lines[i].trim()) return n
  }
  return undefined
}

const STATUS_MAP: Record<string, EmbryoStatus> = {
  C: 'criopreservado',
  T: 'transferido',
  D: 'detenido',
  NF: 'no_viable',
}

function extractEmbryos(text: string): EmbryoEvolution[] {
  // Find section between OUT and "mn:" legend
  const start = text.indexOf('OUT')
  const end = text.indexOf('mn: multinucleado')
  if (start < 0) return []

  const section = end > start ? text.slice(start + 3, end) : text.slice(start + 3, start + 1500)
  const tokens = section.split('\n').map(l => l.trim()).filter(Boolean)

  // Tokens are interleaved: emb#, val/, val/, ..., STATUS_LETTER, emb#, ...
  // Group them into embryo chunks: starts at a single-digit number
  const embryos: EmbryoEvolution[] = []
  let current: string[] = []
  let currentNum = 0

  const flush = () => {
    if (!currentNum || current.length === 0) return
    const embryo: EmbryoEvolution = { embryoNumber: currentNum }
    const parts = current
      .map(t => t.replace(/\/$/, '').trim())
      .filter(Boolean)

    // Detect status
    const lastUpper = parts[parts.length - 1]?.toUpperCase()
    if (lastUpper && STATUS_MAP[lastUpper]) {
      embryo.finalStatus = STATUS_MAP[lastUpper]
      parts.pop()
    }

    // Assign values to days by content type
    let blastCount = 0
    for (const val of parts) {
      const up = val.toUpperCase()
      if (up === 'NGS' || up === 'NF') {
        embryo.day0 = val
        if (up === 'NF' && !embryo.finalStatus) embryo.finalStatus = 'no_viable'
      } else if (up.includes('MORULA') || up === 'COMP') {
        embryo.day4 = val
      } else if (up.startsWith('BL.') || up.startsWith('BL ') || up.includes('BLAST')) {
        blastCount++
        if (blastCount === 1) embryo.day5 = val
        else if (blastCount === 2) embryo.day6 = val
        else embryo.day7 = val
      } else if (/^\d+\s*CEL/i.test(val)) {
        if (!embryo.day1) embryo.day1 = val
        else if (!embryo.day2) embryo.day2 = val
        else if (!embryo.day3) embryo.day3 = val
      }
    }

    embryos.push(embryo)
  }

  for (const token of tokens) {
    const n = parseInt(token, 10)
    // A bare single/double digit on its own line = new embryo number
    if (!isNaN(n) && n >= 1 && n <= 20 && String(n) === token) {
      flush()
      current = []
      currentNum = n
    } else {
      current.push(token)
    }
  }
  flush()

  return embryos
}

function toISO(date: string): string {
  const parts = date.split('/')
  if (parts.length === 3) {
    const [d, m, y] = parts
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
  }
  return date
}
