import { useReducer, useState } from 'react'
import { createAccount } from '../../lib/auth'
import type { Session } from '../../lib/auth'
import { saveOnboarding } from '../../lib/onboarding'
import { toast } from '../../lib/toast'
import type { OnboardingAction, OnboardingDraft, OnboardingProfile } from '../../types'
import { ArrowRightIcon } from '../icons'
import ui from '../ui.module.css'
import { StepAreas } from './StepAreas'
import { StepCadence } from './StepCadence'
import { StepIdentity } from './StepIdentity'
import { StepSeason } from './StepSeason'
import { StepStyle } from './StepStyle'
import { StepSummary } from './StepSummary'
import styles from './OnboardingFlow.module.css'

interface OnboardingFlowProps {
  onComplete: (session: Session) => void
  onExit: () => void
}

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/

const STEPS = [
  { badge: 'A gentle beginning', headline: 'What should we call you?' },
  { badge: 'Areas of intentional growth', headline: 'What are you working on within yourself?' },
  { badge: 'Current horizon', headline: 'What season are you in right now?' },
  { badge: 'Your encouragement style', headline: 'How do you want to be encouraged?' },
  { badge: 'Sacred cadence', headline: 'When does your spirit feel most receptive?' },
  { badge: 'Sanctuary ready', headline: 'Your sanctuary is prepared.' },
]

const INITIAL_DRAFT: OnboardingDraft = {
  name: '',
  email: '',
  password: '',
  areas: [],
  season: '',
  style: 'Soft',
  faith: 'Both / Guided Harmony',
  depth: 'Balanced Everyday',
  cadence: 'Gentle Freeform Flow',
}

function draftReducer(draft: OnboardingDraft, action: OnboardingAction): OnboardingDraft {
  if (action.type === 'toggleArea') {
    const areas = draft.areas.includes(action.value)
      ? draft.areas.filter((area) => area !== action.value)
      : [...draft.areas, action.value]
    return { ...draft, areas }
  }
  if (action.type === 'clearAreas') {
    return { ...draft, areas: [] }
  }
  return { ...draft, [action.key]: action.value }
}

export function OnboardingFlow({ onComplete, onExit }: OnboardingFlowProps) {
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [draft, dispatch] = useReducer(draftReducer, INITIAL_DRAFT)
  const meta = STEPS[step]

  const validateIdentity = () => {
    if (!draft.name.trim()) return 'Please tell us what to call you.'
    if (!EMAIL_PATTERN.test(draft.email)) return 'Please enter a valid email address.'
    if (draft.password.length < 6) return 'Choose a password of at least 6 characters.'
    return ''
  }

  const next = () => {
    setError('')
    if (step === 0) {
      const message = validateIdentity()
      if (message) {
        setError(message)
        return
      }
    }
    if (step < STEPS.length - 1) {
      setStep(step + 1)
      return
    }
    const result = createAccount(draft.name, draft.email, draft.password, true)
    if (!result.ok) {
      setError(result.error)
      setStep(0)
      return
    }
    const profile: OnboardingProfile = {
      name: draft.name.trim(),
      email: draft.email.trim().toLowerCase(),
      areas: draft.areas,
      season: draft.season,
      style: draft.style,
      faith: draft.faith,
      depth: draft.depth,
      cadence: draft.cadence,
      completedAt: new Date().toISOString(),
    }
    saveOnboarding(profile)
    toast('Welcome to your sanctuary')
    onComplete(result.session)
  }

  const back = () => {
    setError('')
    if (step === 0) onExit()
    else setStep(step - 1)
  }

  return (
    <main className={styles.flow}>
      <div className={styles.shell}>
        <div className={styles.topbar}>
          <button className={styles.back} type="button" onClick={back}>
            {step === 0 ? 'Exit' : 'Back'}
          </button>
          <span className={styles.counter}>
            Step {step + 1} of {STEPS.length}
          </span>
        </div>
        <div className={styles.progress} aria-hidden="true">
          <div className={styles.progressFill} style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
        <p className={ui.eyebrow}>{meta.badge}</p>
        <h1 className={styles.headline}>{meta.headline}</h1>

        <div className={styles.stage}>
          {step === 0 && <StepIdentity draft={draft} dispatch={dispatch} />}
          {step === 1 && <StepAreas draft={draft} dispatch={dispatch} />}
          {step === 2 && <StepSeason draft={draft} dispatch={dispatch} />}
          {step === 3 && <StepStyle draft={draft} dispatch={dispatch} />}
          {step === 4 && <StepCadence draft={draft} dispatch={dispatch} />}
          {step === 5 && <StepSummary draft={draft} />}
        </div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <div className={styles.nav}>
          {step < STEPS.length - 1 ? (
            <button className={ui.btnPrimary} type="button" onClick={next}>
              Next
              <ArrowRightIcon />
            </button>
          ) : (
            <button className={ui.btnPrimary} type="button" onClick={next}>
              Time to Bloom
              <ArrowRightIcon />
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
