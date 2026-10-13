import type { Dispatch } from 'react'
import type { OnboardingAction, OnboardingDraft } from '../../types'
import shared from './shared.module.css'

interface StepAreasProps {
  draft: OnboardingDraft
  dispatch: Dispatch<OnboardingAction>
}

const AREAS = [
  'Confidence',
  'Purpose',
  'Faith',
  'Career & Work',
  'Relationships',
  'Self-Worth',
  'Peace',
  'Discipline',
  'Emotional Resilience',
  'Personal Development',
]

export function StepAreas({ draft, dispatch }: StepAreasProps) {
  return (
    <div>
      <div className={shared.optionGrid}>
        {AREAS.map((area) => {
          const active = draft.areas.includes(area)
          return (
            <button
              key={area}
              className={active ? `${shared.option} ${shared.isActive}` : shared.option}
              type="button"
              aria-pressed={active}
              onClick={() => dispatch({ type: 'toggleArea', value: area })}
            >
              <span className={shared.optionTitle}>{area}</span>
            </button>
          )
        })}
      </div>
      <p className={shared.counter}>{draft.areas.length} of 10 chosen</p>
      <button className={shared.skip} type="button" onClick={() => dispatch({ type: 'clearAreas' })}>
        Select later, just give me a gentle start
      </button>
    </div>
  )
}
