import { EmbryoCase } from './types'

export interface ValidationWarning {
  field: string
  message: string
}

export function validateCase(c: EmbryoCase): ValidationWarning[] {
  const warnings: ValidationWarning[] = []
  const { oocytes, fertilization, embryos, finalResult } = c

  if (oocytes.injectedOocytes !== undefined && oocytes.injectedOocytes > oocytes.totalOocytes) {
    warnings.push({ field: 'injectedOocytes', message: 'Los ovocitos inyectados superan el total de ovocitos obtenidos.' })
  }
  if (oocytes.miiOocytes !== undefined && oocytes.miiOocytes > oocytes.totalOocytes) {
    warnings.push({ field: 'miiOocytes', message: 'Los ovocitos MII superan el total de ovocitos obtenidos.' })
  }

  const fertSum = (fertilization.notFertilized ?? 0) + (fertilization.onePN ?? 0) + (fertilization.twoPN ?? 0) +
    (fertilization.threePN ?? 0) + (fertilization.cytolyzed ?? 0) + (fertilization.fertilizationAtretic ?? 0)
  if (oocytes.injectedOocytes !== undefined && fertSum > oocytes.injectedOocytes) {
    warnings.push({ field: 'fertilization', message: 'La suma de resultados de fertilización supera los ovocitos inyectados.' })
  }

  const cryoEmbryo = embryos.filter(e => e.finalStatus === 'criopreservado').length
  if (finalResult.cryopreservedCount !== undefined && finalResult.cryopreservedCount !== cryoEmbryo) {
    warnings.push({ field: 'cryopreservedCount', message: `Se indicaron ${finalResult.cryopreservedCount} embriones criopreservados, pero se registraron ${cryoEmbryo} con ese estado.` })
  }

  const transferEmbryo = embryos.filter(e => e.finalStatus === 'transferido').length
  if (finalResult.transferredCount !== undefined && finalResult.transferredCount !== transferEmbryo) {
    warnings.push({ field: 'transferredCount', message: `Se indicaron ${finalResult.transferredCount} embriones transferidos, pero se registraron ${transferEmbryo} con ese estado.` })
  }

  return warnings
}
