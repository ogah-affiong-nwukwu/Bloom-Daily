import { getJSON, setJSON } from './storage'
import type { OnboardingProfile } from '../types'

const ONBOARDING_KEY = 'bloom.onboarding'

export function getOnboarding(): OnboardingProfile | null {
  return getJSON<OnboardingProfile | null>(ONBOARDING_KEY, null)
}

export function saveOnboarding(profile: OnboardingProfile): void {
  setJSON(ONBOARDING_KEY, profile)
}

export function clearOnboarding(): void {
  localStorage.removeItem(ONBOARDING_KEY)
}
