import type { Dispatch } from 'react'
import type { OnboardingAction, OnboardingDraft } from '../../types'
import shared from './shared.module.css'

interface StepCadenceProps {
  draft: OnboardingDraft
  dispatch: Dispatch<OnboardingAction>
}

const CADENCES = [
  { id: 'Dawn & Morning Solitude', time: '6:00 AM – 9:00 AM' },
  { id: 'Midday Sanctuary', time: '12:00 PM – 2:00 PM' },
  { id: 'Evening Vespers', time: '8:00 PM – 10:00 PM' },
  { id: 'Gentle Freeform Flow', time: 'Whenever Your Spirit Calls' },
]

export function StepCadence({ draft, dispatch }: StepCadenceProps) {
  return (
    <div className={shared.optionGrid}>
      {CADENCES.map((cadence) => {
        const active = draft.cadence === cadence.id
        return (
          <button
            key={cadence.id}
            className={active ? `${shared.option} ${shared.isActive}` : shared.option}
            type="button"
            aria-pressed={active}
            onClick={() => dispatch({ type: 'set', key: 'cadence', value: cadence.id })}
          >
            <span className={shared.optionTitle}>{cadence.id}</span>
            <span className={shared.optionDesc}>{cadence.time}</span>
          </button>
        )
      })}
    </div>
  )
}
