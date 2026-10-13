import type { Dispatch } from 'react'
import type { OnboardingAction, OnboardingDraft } from '../../types'
import shared from './shared.module.css'

interface StepStyleProps {
  draft: OnboardingDraft
  dispatch: Dispatch<OnboardingAction>
}

const STYLES = [
  { id: 'Soft', desc: 'Gentle & Reassuring' },
  { id: 'Deep', desc: 'Thoughtful & Reflective' },
  { id: 'Bold', desc: 'Confident & Motivating' },
  { id: 'Direct', desc: 'Clear & Practical' },
]

const FAITH_OPTIONS = ['Scripture & Faith', 'Personal Mindfulness', 'Both / Guided Harmony']

const DEPTH_OPTIONS = ['Subtle & Weaved In', 'Balanced Everyday', 'Deeply Rooted Passages']

export function StepStyle({ draft, dispatch }: StepStyleProps) {
  return (
    <div>
      <div className={shared.optionGrid}>
        {STYLES.map((style) => {
          const active = draft.style === style.id
          return (
            <button
              key={style.id}
              className={active ? `${shared.option} ${shared.isActive}` : shared.option}
              type="button"
              aria-pressed={active}
              onClick={() => dispatch({ type: 'set', key: 'style', value: style.id })}
            >
              <span className={shared.optionTitle}>{style.id}</span>
              <span className={shared.optionDesc}>{style.desc}</span>
            </button>
          )
        })}
      </div>

      <p className={shared.sectionLabel}>Do you want Bible reflections in your daily journal?</p>
      <div className={shared.choiceGroup}>
        {FAITH_OPTIONS.map((faith) => {
          const active = draft.faith === faith
          return (
            <button
              key={faith}
              className={active ? `${shared.choice} ${shared.isActive}` : shared.choice}
              type="button"
              aria-pressed={active}
              onClick={() => dispatch({ type: 'set', key: 'faith', value: faith })}
            >
              <span className={shared.radio} aria-hidden="true" />
              {faith}
            </button>
          )
        })}
      </div>

      <p className={shared.sectionLabel}>Scripture depth</p>
      <div className={shared.segment}>
        {DEPTH_OPTIONS.map((depth) => {
          const active = draft.depth === depth
          return (
            <button
              key={depth}
              className={active ? `${shared.segmentBtn} ${shared.isActive}` : shared.segmentBtn}
              type="button"
              aria-pressed={active}
              onClick={() => dispatch({ type: 'set', key: 'depth', value: depth })}
            >
              {depth}
            </button>
          )
        })}
      </div>
    </div>
  )
}
