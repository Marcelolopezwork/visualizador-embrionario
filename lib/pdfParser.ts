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
  // pdfjs per-item: oocyte value appears on the line right after its label.
  // MI/VG/Atres are excluded: the adjacent semen column contaminates their values
  // (e.g. "MI\n1\n" where "1" is semen motility, not MI oocytes).
  const totalOocytes = numberAfterLabel(nonEmpty, /^Total$/) ?? 0
  const decumulatedOocytes = numberAfterLabel(nonEmpty, /^D[eé]cumulados$|^Desacumulados$/) || undefined
  const miiOocytes = numberAfterLabel(nonEmpty, /^MII$/) || undefined
  const miOocytes: number | undefined = undefined   // skipped — semen column interferes
  const vgOocytes: number | undefined = undefined   // skipped — semen column interferes
  const atreticOocytes: number | undefined = undefined
  const injMatch = text.match(/Ovocitos inyectados[\s\n]+(\d+)/)
  const injectedOocytes = injMatch
    ? parseInt(injMatch[1], 10)
    : numberAfterLabel(nonEmpty, /^Ovocitos inyectados$/)

  // ── Fertilization ───────────────────────────────────────────────
  // pdfjs per-item: ALL labels appear first as a block, then values follow in same order.
  // e.g.: "No fecundado\n1 PN\n2 PN\n3 PN\nCitolizados\nAtrésicos\n3\n2\n9"
  // Detect this by checking if "1 PN" immediately follows "No fecundado".
  // Fallback: old interleaved format from pdftotext.
  const FERT_LABEL_PATS = [
    /^No fecundado$/, /^1 PN$/, /^2 PN$/, /^3 PN$/, /^Citolizados$/, /^Atr[eé]sicos$/i,
  ]
  let notFertilized: number | undefined
  let onePN: number | undefined
  let twoPN: number | undefined
  let threePN: number | undefined
  let cytolyzed: number | undefined

  const nfIdx = nonEmpty.findIndex(l => /^No fecundado$/.test(l))
  if (nfIdx >= 0) {
    const allLabelsFirst = /^1 PN$/.test(nonEmpty[nfIdx + 1] ?? '')
    if (allLabelsFirst) {
      // Count consecutive fert labels starting at nfIdx
      let labelEnd = nfIdx
      for (const pat of FERT_LABEL_PATS) {
        if (pat.test(nonEmpty[labelEnd] ?? '')) labelEnd++
        else break
      }
      // Collect values right after the label block
      const fertVals: Array<number | undefined> = Array(6).fill(undefined)
      let vi = 0
      for (let j = labelEnd; j < Math.min(labelEnd + 10, nonEmpty.length) && vi < 6; j++) {
        const n = parseInt(nonEmpty[j], 10)
        if (!isNaN(n) && String(n) === nonEmpty[j]) fertVals[vi++] = n
        else if (vi > 0 && nonEmpty[j].length > 3) break
      }
      ;[notFertilized, onePN, twoPN, threePN, cytolyzed] = fertVals
    } else {
      // pdftotext interleaved format: NF value follows "No fecundado\n1 PN\n"
      const noFertMatch = text.match(/No fecundado\n1 PN\n(\d+)/)
      notFertilized = noFertMatch ? parseInt(noFertMatch[1], 10) : undefined
      const twoPNMatch = text.match(/2 PN\n(\d+)/)
      twoPN = twoPNMatch ? parseInt(twoPNMatch[1], 10) : undefined
      const threePNMatch = text.match(/3 PN\n(\d+)/)
      threePN = threePNMatch ? parseInt(threePNMatch[1], 10) : undefined
      const citoMatch = text.match(/Citolizados\n(\d+)/)
      cytolyzed = citoMatch ? parseInt(citoMatch[1], 10) : undefined
    }
  }

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
    // Labels appear in this order: Transferido, Día Transferencia, Criopreservado, Día Crio.
    // Values follow (on page 2) in the same order: [transferred, día_trans, cryo, día_crio]
    // e.g. [0, 0, 3, 6] — cryo is at index 2, not index 1.
    const scanFrom = Math.min(xferLabelIdx, cryoLabelIdx) + 1
    const resultNums: number[] = []
    for (let i = scanFrom; i < Math.min(scanFrom + 25, nonEmpty.length); i++) {
      const n = parseInt(nonEmpty[i], 10)
      if (!isNaN(n) && String(n) === nonEmpty[i] && n < 1000) {
        resultNums.push(n)
        if (resultNums.length >= 4) break
      }
    }
    transferredCount = resultNums[0]
    cryopreservedCount = resultNums[2]   // skip Día Transferencia value at [1]
    cryopreservationDay = resultNums[3]
    // Fallback if fewer than 3 numbers found (e.g. when one value is missing)
    if (cryopreservedCount === undefined && resultNums[1] !== undefined) {
      cryopreservedCount = resultNums[1]
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
