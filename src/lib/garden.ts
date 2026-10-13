import { getJSON, setJSON } from './storage'

const GARDEN_KEY = 'bloom.garden'

export const GARDEN_STAGES = ['Beginning Seed', 'Rooting Sprout', 'Growing Stem', 'Soft Leaves', 'In Full Bloom']

export function loadTends(): Record<string, number> {
  return getJSON<Record<string, number>>(GARDEN_KEY, {})
}

export function tendSeed(area: string): Record<string, number> {
  const tends = loadTends()
  const next = { ...tends, [area]: (tends[area] ?? 0) + 1 }
  setJSON(GARDEN_KEY, next)
  return next
}

export function stageFor(count: number): string {
  return GARDEN_STAGES[Math.min(count, GARDEN_STAGES.length - 1)]
}

export function clearGarden(): void {
  localStorage.removeItem(GARDEN_KEY)
}
