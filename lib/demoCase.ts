import { EmbryoCase } from './types'

export interface DemoCaseOption {
  id: string
  label: string
  description: string
  tag: string
  tagColor: string
  data: EmbryoCase
}

// Caso 1 — basado en informe real (ICSI, 40 años, 5 criopreservados, 0 transferidos, NGS pendiente)
const caso1: EmbryoCase = {
  patientName: 'Paciente A',
  patientAge: 40,
  doctorName: 'Dr. E. Canales',
  procedureDate: '2025-11-17',
  procedureType: 'ICSI',
  biologistName: 'Biol. L. Guzmán',
  oocytes: {
    totalOocytes: 10,
    decumulatedOocytes: 10,
    miiOocytes: 10,
    injectedOocytes: 10,
  },
  fertilization: {
    notFertilized: 3,
    twoPN: 5,
    threePN: 1,
    cytolyzed: 1,
  },
  embryos: [
    { embryoNumber: 1, day0: 'NGS', day4: 'Morula', day5: 'Bl. Mid', day6: 'Bl. Hat BB', finalStatus: 'criopreservado' },
    { embryoNumber: 2, day0: 'NGS', day4: 'Morula', day5: 'Bl. Mid', day6: 'Bl. Hatched', finalStatus: 'criopreservado' },
    { embryoNumber: 3, day0: 'NF', finalStatus: 'no_viable' },
    { embryoNumber: 4, day0: 'NF', finalStatus: 'no_viable' },
    { embryoNumber: 5, day0: 'NGS', day4: 'Bl. Early', day5: 'Bl. Full AB', day6: 'Bl. Hat AA', finalStatus: 'criopreservado' },
    { embryoNumber: 6, day0: 'NGS', day4: 'Morula', day5: 'Bl. Full AA', day6: 'Bl. Hat BB', finalStatus: 'criopreservado' },
    { embryoNumber: 7, day0: 'NGS', day4: 'Morula', day5: 'Bl. Full AB', day6: 'Bl. Hat AA', finalStatus: 'criopreservado' },
  ],
  finalResult: {
    transferredCount: 0,
    cryopreservedCount: 5,
    cryopreservationDay: 6,
    nextStep: 'NGS pendiente — análisis genético preimplantacional antes de la transferencia',
  },
}

// Caso 2 — ICSI, 35 años, transferencia en día 5 + criopreservación
const caso2: EmbryoCase = {
  patientName: 'Paciente B',
  patientAge: 35,
  doctorName: 'Dra. M. Torres',
  procedureDate: '2025-10-08',
  procedureType: 'ICSI',
  biologistName: 'Biol. R. Soto',
  oocytes: {
    totalOocytes: 14,
    decumulatedOocytes: 14,
    miiOocytes: 12,
    miOocytes: 1,
    atreticOocytes: 1,
    injectedOocytes: 12,
  },
  fertilization: {
    notFertilized: 2,
    onePN: 1,
    twoPN: 8,
    cytolyzed: 1,
  },
  embryos: [
    { embryoNumber: 1, day1: '2 cel', day2: '4 cel', day3: '8 cel', day4: 'Morula', day5: 'Bl. Full AA', finalStatus: 'transferido', finalQuality: 'AA' },
    { embryoNumber: 2, day1: '2 cel', day2: '4 cel', day3: '8 cel', day4: 'Morula', day5: 'Bl. Full AB', finalStatus: 'criopreservado', finalQuality: 'AB' },
    { embryoNumber: 3, day1: '2 cel', day2: '4 cel', day3: '7 cel', day4: 'Morula', day5: 'Bl. Mid', day6: 'Bl. Hat AB', finalStatus: 'criopreservado', finalQuality: 'AB' },
    { embryoNumber: 4, day1: '2 cel', day2: '4 cel', day3: '8 cel', day4: 'Morula', day5: 'Bl. Full BB', finalStatus: 'criopreservado', finalQuality: 'BB' },
    { embryoNumber: 5, day1: '2 cel', day2: '3 cel', day3: '5 cel', day4: 'comp', day5: 'Bl. Early', finalStatus: 'detenido' },
    { embryoNumber: 6, day1: '2 cel', day2: '4 cel', day3: '6 cel', day4: 'comp', day5: 'Bl. Early', finalStatus: 'detenido' },
    { embryoNumber: 7, day1: '2 cel', day2: '4 cel', day3: '6 cel', day4: 'Morula', day5: 'Bl. Mid', day6: 'Bl. Hat BB', finalStatus: 'criopreservado', finalQuality: 'BB' },
    { embryoNumber: 8, day1: '2 cel', day2: '3 cel', day3: 'NC', finalStatus: 'no_viable' },
  ],
  finalResult: {
    transferredCount: 1,
    cryopreservedCount: 4,
    cryopreservationDay: 5,
    nextStep: 'Transferencia realizada. Criopreservados disponibles para ciclos futuros.',
  },
}

// Caso 3 — FIV clásica, 38 años, resultado más reducido, 1 transferido
const caso3: EmbryoCase = {
  patientName: 'Paciente C',
  patientAge: 38,
  doctorName: 'Dr. A. Méndez',
  procedureDate: '2025-09-22',
  procedureType: 'FIV',
  biologistName: 'Biol. C. Ríos',
  oocytes: {
    totalOocytes: 8,
    decumulatedOocytes: 8,
    miiOocytes: 6,
    miOocytes: 1,
    vgOocytes: 1,
    injectedOocytes: 6,
  },
  fertilization: {
    notFertilized: 1,
    onePN: 1,
    twoPN: 4,
  },
  embryos: [
    { embryoNumber: 1, day1: '2 cel', day2: '4 cel', day3: '7 cel', day4: 'Morula', day5: 'Bl. Full AB', finalStatus: 'transferido', finalQuality: 'AB' },
    { embryoNumber: 2, day1: '2 cel', day2: '4 cel', day3: '8 cel', day4: 'Morula', day5: 'Bl. Full BB', finalStatus: 'criopreservado', finalQuality: 'BB' },
    { embryoNumber: 3, day1: '2 cel', day2: '3 cel', day3: '5 cel', day4: 'comp', finalStatus: 'detenido' },
    { embryoNumber: 4, day1: '2 cel', day2: '4 cel', day3: 'NC', finalStatus: 'no_viable' },
  ],
  finalResult: {
    transferredCount: 1,
    cryopreservedCount: 1,
    cryopreservationDay: 5,
    nextStep: 'Transferencia realizada en día 5. 1 embrión disponible para ciclo siguiente.',
  },
}

export const DEMO_CASES: DemoCaseOption[] = [
  {
    id: 'caso1',
    label: 'ICSI — 40 años, 5 criopreservados',
    description: '10 ovocitos · 5 fertilizados · 5 criopreservados · NGS pendiente',
    tag: 'Criopreservación total',
    tagColor: '#3A7D44',
    data: caso1,
  },
  {
    id: 'caso2',
    label: 'ICSI — 35 años, transferencia + criopreservación',
    description: '14 ovocitos · 8 fertilizados · 1 transferido · 4 criopreservados',
    tag: 'Transferencia + banco',
    tagColor: '#27AE74',
    data: caso2,
  },
  {
    id: 'caso3',
    label: 'FIV — 38 años, resultado reducido',
    description: '8 ovocitos · 4 fertilizados · 1 transferido · 1 criopreservado',
    tag: 'Resultado acotado',
    tagColor: '#C9A84C',
    data: caso3,
  },
]

export function loadDemoCase(id?: string): EmbryoCase {
  if (id) {
    const found = DEMO_CASES.find(d => d.id === id)
    if (found) return found.data
  }
  return caso1
}
