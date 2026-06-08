export type ProcedureType = 'ICSI' | 'FIV' | 'CRIO_OVOCITOS'

export type EmbryoStatus =
  'criopreservado' | 'transferido' | 'detenido' |
  'no_viable' | 'pendiente' | 'NGS'

export interface EmbryoCase {
  id?: string
  patientName: string
  patientAge?: number
  doctorName?: string
  procedureDate?: string
  procedureType: ProcedureType
  biologistName?: string
  oocytes: OocyteData
  fertilization: FertilizationData
  embryos: EmbryoEvolution[]
  finalResult: FinalResult
  aiExplanation?: PatientExplanation
  editedExplanation?: PatientExplanation
}

export interface OocyteData {
  totalOocytes: number
  decumulatedOocytes?: number
  vgOocytes?: number
  miOocytes?: number
  miiOocytes?: number
  atreticOocytes?: number
  injectedOocytes?: number
}

export interface FertilizationData {
  notFertilized?: number
  onePN?: number
  twoPN?: number
  threePN?: number
  cytolyzed?: number
  fertilizationAtretic?: number
}

export interface EmbryoEvolution {
  embryoNumber: number
  day0?: string
  day1?: string
  day2?: string
  day3?: string
  day4?: string
  day5?: string
  day6?: string
  day7?: string
  finalStatus?: EmbryoStatus
  finalQuality?: string
  notes?: string
}

export interface FinalResult {
  transferredCount?: number
  cryopreservedCount?: number
  cryopreservationDay?: number
  nextStep?: string
  customNextStepMessage?: string
}

export interface PatientExplanation {
  generalSummary: string
  fertilizationExplanation: string
  embryoEvolutionExplanation: string
  finalResultExplanation: string
  closingMessage: string
}

export type Scene = {
  id: string
  title: string
  data: EmbryoCase
}
