import styles from './ArrivalCheckIn.module.css'
import ui from './ui.module.css'

const ARRIVAL_OPTIONS = [
  { id: 'Good', emoji: '😊', tone: 'toneSky' },
  { id: 'Hopeful', emoji: '🌱', tone: 'toneSage' },
  { id: 'Tired', emoji: '😴', tone: 'toneYellow' },
  { id: 'Low', emoji: '🌧️', tone: 'toneLavender' },
  { id: 'Overwhelmed', emoji: '😵', tone: 'toneRose' },
  { id: 'Hurt', emoji: '💔', tone: 'tonePeach' },
] as const

interface ArrivalCheckInProps {
  value: string | null
  onChange: (id: string) => void
}

export function ArrivalCheckIn({ value, onChange }: ArrivalCheckInProps) {
  return (
    <section className={ui.card}>
      <h3 className={ui.cardTitle}>How are you today?</h3>
      <div className={styles.pills}>
        {ARRIVAL_OPTIONS.map((option) => (
          <button
            key={option.id}
            className={
              option.id === value
                ? `${styles.pill} ${ui[option.tone]} ${styles.isActive}`
                : `${styles.pill} ${ui[option.tone]}`
            }
            type="button"
            aria-pressed={option.id === value}
            onClick={() => onChange(option.id)}
          >
            <span className={styles.emoji} aria-hidden="true">
              {option.emoji}
            </span>
            {option.id}
          </button>
        ))}
      </div>
    </section>
  )
}
