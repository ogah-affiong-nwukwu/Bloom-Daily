import { getJSON, setJSON } from './storage'

const NOTES_KEY = 'bloom.notes'

export interface Notes {
  hold: string
  intention: string
  reminder: string
}

export const NOTE_DEFAULTS: Notes = {
  hold: 'You are doing better than you think.',
  intention: '',
  reminder: 'Softness is strength.',
}

export function loadNotes(): Notes {
  const stored = getJSON<Partial<Notes>>(NOTES_KEY, {})
  return { ...NOTE_DEFAULTS, ...stored }
}

export function saveNotes(notes: Notes): void {
  setJSON(NOTES_KEY, notes)
}

export function clearNotes(): void {
  localStorage.removeItem(NOTES_KEY)
}
