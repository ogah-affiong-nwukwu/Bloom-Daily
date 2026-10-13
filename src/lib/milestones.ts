import { getJSON, setJSON } from './storage'
import { nowISO } from './date'

const MILESTONES_KEY = 'bloom.milestones'

export interface MilestoneState {
  done: boolean
  completedAt?: string
}

export type MilestoneStore = Record<string, MilestoneState>

export interface Milestone {
  id: string
  title: string
  desc: string
}

export const MILESTONES: Milestone[] = [
  {
    id: 'stillness',
    title: '7 Days of Unhurried Stillness',
    desc: 'Seven days of showing up for five quiet minutes — no goals, no pressure.',
  },
  {
    id: 'arrival',
    title: 'Honest Arrival Check-in',
    desc: 'Name how you are arriving for a full week, without editing yourself.',
  },
  {
    id: 'sabbath',
    title: 'Quiet Sabbath Boundary',
    desc: 'Choose one window each week that belongs only to rest.',
  },
  {
    id: 'voice',
    title: 'Voice Reflection / Prayer',
    desc: 'Speak a reflection or prayer aloud — held only in your memory.',
  },
]

export function loadMilestones(): MilestoneStore {
  return getJSON<MilestoneStore>(MILESTONES_KEY, {})
}

export function toggleMilestone(id: string): MilestoneStore {
  const store = loadMilestones()
  const current = store[id] ?? { done: false }
  const next: MilestoneStore = {
    ...store,
    [id]: current.done ? { done: false } : { done: true, completedAt: nowISO() },
  }
  setJSON(MILESTONES_KEY, next)
  return next
}

export function clearMilestones(): void {
  localStorage.removeItem(MILESTONES_KEY)
}
