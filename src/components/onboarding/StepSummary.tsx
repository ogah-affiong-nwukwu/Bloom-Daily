import type { OnboardingDraft } from '../../types'
import styles from './StepSummary.module.css'

interface StepSummaryProps {
  draft: OnboardingDraft
}

const STYLE_VOICE: Record<string, string> = {
  Soft: 'Soft Voice',
  Deep: 'Deep Voice',
  Bold: 'Bold Voice',
  Direct: 'Direct Voice',
}

const FOCUS_LABEL: Record<string, string> = {
  'Scripture & Faith': 'Faith',
  'Personal Mindfulness': 'Mindfulness',
  'Both / Guided Harmony': 'Guided Harmony',
}

export function StepSummary({ draft }: StepSummaryProps) {
  const badges = [
    { label: 'Season', value: draft.season || 'Uncharted' },
    { label: 'Encouragement', value: STYLE_VOICE[draft.style] ?? draft.style },
    { label: 'Focus', value: FOCUS_LABEL[draft.faith] ?? draft.faith },
    { label: 'Pillars', value: draft.areas.length > 0 ? `${draft.areas.length} Areas Selected` : 'Gentle Start' },
  ]

  return (
    <div>
      <p className={styles.greeting}>
        One last look before your sanctuary opens, {draft.name.trim() || 'friend'}.
      </p>
      <div className={styles.badges}>
        {badges.map((badge) => (
          <div className={styles.badge} key={badge.label}>
            <span className={styles.badgeLabel}>{badge.label}</span>
            <span className={styles.badgeValue}>{badge.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
