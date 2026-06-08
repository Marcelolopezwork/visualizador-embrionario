import { EmbryoCase } from './types'

export interface PresentationScene {
  sceneId: string
  label: string
}

export const SCENE_IDS = [
  'cover',
  'oocytes',
  'mature-oocytes',
  'injected',
  'fertilization',
  'timeline',
  'final-result',
  'closing',
] as const

export type SceneId = typeof SCENE_IDS[number]

export function mapCaseToScenes(data: EmbryoCase): PresentationScene[] {
  return [
    { sceneId: 'cover', label: 'Portada' },
    { sceneId: 'oocytes', label: 'Ovocitos obtenidos' },
    { sceneId: 'mature-oocytes', label: 'Ovocitos maduros' },
    { sceneId: 'injected', label: 'Ovocitos inyectados' },
    { sceneId: 'fertilization', label: 'Fertilización' },
    { sceneId: 'timeline', label: 'Evolución embrionaria' },
    { sceneId: 'final-result', label: 'Resultado final' },
    { sceneId: 'closing', label: 'Cierre' },
  ]
}
