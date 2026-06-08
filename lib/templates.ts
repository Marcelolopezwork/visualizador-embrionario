import { EmbryoCase, PatientExplanation } from './types'

export function generateTemplateExplanation(data: EmbryoCase, tone: string): PatientExplanation {
  const { oocytes, fertilization, embryos, finalResult } = data
  const twoPN = fertilization.twoPN ?? 0
  const total = oocytes.totalOocytes
  const mii = oocytes.miiOocytes ?? total
  const injected = oocytes.injectedOocytes ?? mii
  const cryo = finalResult.cryopreservedCount ?? 0
  const transferred = finalResult.transferredCount ?? 0
  const stopped = embryos.filter(e => e.finalStatus === 'detenido' || e.finalStatus === 'no_viable').length

  const warm = tone === 'Cálido y empático'
  const medical = tone === 'Médico pero entendible'

  return {
    generalSummary: warm
      ? `Este resumen refleja el camino que recorrieron tus ovocitos y embriones durante el procedimiento. Cada etapa fue cuidadosamente monitoreada por el equipo de laboratorio.`
      : medical
      ? `El presente informe describe la evolución del procedimiento de reproducción asistida, desde la obtención de ovocitos hasta el resultado final en laboratorio.`
      : `A continuación se describe de forma clara lo que ocurrió durante el procedimiento, paso a paso.`,

    fertilizationExplanation: `Se obtuvieron ${total} ovocitos, de los cuales ${mii} se encontraban en etapa MII (maduros y aptos para el procedimiento). Se realizó el procedimiento sobre ${injected} ovocitos. Luego de la fecundación, ${twoPN} presentaron fecundación adecuada (dos pronúcleos), lo cual es el resultado esperado para continuar con el desarrollo embrionario.`,

    embryoEvolutionExplanation: `Los embriones fueron observados diariamente en el laboratorio. ${embryos.length} embriones comenzaron su desarrollo. ${stopped > 0 ? `${stopped} embrión${stopped > 1 ? 'es' : ''} no continuó su desarrollo durante la evolución.` : ''} Los embriones que lograron alcanzar las etapas esperadas fueron evaluados para definir el siguiente paso.`,

    finalResultExplanation: transferred > 0
      ? `Se realizó la transferencia de ${transferred} embrión${transferred > 1 ? 'es' : ''}.${cryo > 0 ? ` Además, ${cryo} embrión${cryo > 1 ? 'es fueron' : ' fue'} criopreservado${cryo > 1 ? 's' : ''} para uso futuro.` : ''}`
      : cryo > 0
      ? `${cryo} embrión${cryo > 1 ? 'es fueron' : ' fue'} criopreservado${cryo > 1 ? 's' : ''}, lo que significa que se conservan en condiciones óptimas para ser utilizados en el momento indicado por el equipo médico.`
      : `El equipo médico definirá los siguientes pasos en función de los resultados obtenidos.`,

    closingMessage: warm
      ? `Este resumen visual busca acompañarte en la comprensión de tu proceso. Cada paso realizado por el equipo de laboratorio estuvo orientado al mejor cuidado posible de tus embriones. El equipo médico continuará acompañándote en los pasos que siguen.`
      : `Este resumen visual busca ayudarte a comprender de forma más clara cómo evolucionó tu proceso. El equipo médico continuará acompañándote en los siguientes pasos.`,
  }
}
