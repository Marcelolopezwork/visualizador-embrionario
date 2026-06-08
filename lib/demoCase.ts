import { EmbryoCase } from './types'

export function loadDemoCase(): EmbryoCase {
  return {
    patientName: 'Paciente Demo',
    patientAge: 40,
    doctorName: 'Médico Demo',
    procedureDate: '2025-11-17',
    procedureType: 'ICSI',
    oocytes: {
      totalOocytes: 10,
      decumulatedOocytes: 10,
      miiOocytes: 10,
      injectedOocytes: 10,
    },
    fertilization: {
      notFertilized: 3,
      onePN: 0,
      twoPN: 5,
      threePN: 1,
      cytolyzed: 1,
    },
    embryos: [
      { embryoNumber: 1, day0: 'NGS', day4: 'Morula', day5: 'Bl. Mid', day6: 'Bl. Hatched BB', finalStatus: 'criopreservado' },
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
      nextStep: 'NGS pendiente',
    },
  }
}
