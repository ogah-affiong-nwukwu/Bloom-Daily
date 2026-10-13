import type { Dispatch } from 'react'
import type { OnboardingAction, OnboardingDraft } from '../../types'
import shared from './shared.module.css'
import styles from './StepSeason.module.css'

interface StepSeasonProps {
  draft: OnboardingDraft
  dispatch: Dispatch<OnboardingAction>
}

const SEASONS = ['Growing', 'Building', 'Healing', 'Rebuilding', 'Discovering', 'Resting', 'Becoming', "I'm not sure yet"]

export function StepSeason({ draft, dispatch }: StepSeasonProps) {
  return (
    <div>
      <div className={shared.optionGrid}>
        {SEASONS.map((season) => {
          const active = draft.season === season
          return (
            <button
              key={season}
              className={active ? `${shared.option} ${shared.isActive}` : shared.option}
              type="button"
              aria-pressed={active}
              onClick={() => dispatch({ type: 'set', key: 'season', value: season })}
            >
              <span className={shared.optionTitle}>{season}</span>
            </button>
          )
        })}
      </div>

      <figure className={styles.quote}>
        <blockquote className={styles.quoteText}>
          “There is a time for everything, and a season for every activity under the heavens.”
        </blockquote>
        <figcaption className={styles.quoteSource}>Ecclesiastes 3:1</figcaption>
      </figure>

      <button className={shared.skip} type="button" onClick={() => dispatch({ type: 'set', key: 'season', value: '' })}>
        Skip for now
      </button>
    </div>
  )
}
