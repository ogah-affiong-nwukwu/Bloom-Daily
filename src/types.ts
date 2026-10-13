export type TabId = 'home' | 'growth' | 'journal' | 'garden' | 'profile'

export type AuthMode = 'signin' | 'forgot' | 'reset'

export interface OnboardingProfile {
  name: string
  email: string
  areas: string[]
  season: string
  style: string
  faith: string
  depth: string
  cadence: string
  completedAt: string
}

export interface OnboardingDraft {
  name: string
  email: string
  password: string
  areas: string[]
  season: string
  style: string
  faith: string
  depth: string
  cadence: string
}

export type OnboardingAction =
  | { type: 'set'; key: 'name' | 'email' | 'password' | 'season' | 'style' | 'faith' | 'depth' | 'cadence'; value: string }
  | { type: 'toggleArea'; value: string }
  | { type: 'clearAreas' }
