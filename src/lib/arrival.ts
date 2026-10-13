import { getJSON, setJSON } from './storage'
import { todayISO } from './date'

const ARRIVAL_KEY = 'bloom.arrival'

export function loadArrival(): string | null {
  const stored = getJSON<Record<string, string>>(ARRIVAL_KEY, {})
  return stored[todayISO()] ?? null
}

export function saveArrival(id: string): void {
  const stored = getJSON<Record<string, string>>(ARRIVAL_KEY, {})
  stored[todayISO()] = id
  setJSON(ARRIVAL_KEY, stored)
}

export function clearArrival(): void {
  localStorage.removeItem(ARRIVAL_KEY)
}
