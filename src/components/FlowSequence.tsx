import { BreathIcon, EditNoteIcon, HeartIcon, LeafIcon } from './icons'
import styles from './FlowSequence.module.css'
import ui from './ui.module.css'

const STEPS = [
  {
    num: '01',
    duration: '1 min',
    title: 'Open the day',
    description: 'A single hand-picked affirmation to carry with you.',
    Icon: LeafIcon,
  },
  {
    num: '02',
    duration: '4 min',
    title: 'Breathe with intention',
    description: 'A guided 4-4-4 breathing space to slow your rhythm.',
    Icon: BreathIcon,
  },
  {
    num: '03',
    duration: '2 min',
    title: 'Name how you feel',
    description: 'A gentle mood check-in — no scores, no judgement.',
    Icon: HeartIcon,
  },
  {
    num: '04',
    duration: '5 min',
    title: 'Write or speak',
    description: 'A short reflection, saved only on your device.',
    Icon: EditNoteIcon,
  },
]

export function FlowSequence() {
  return (
    <section className={styles.flow}>
      <div className="container">
        <div className={styles.head}>
          <p className={ui.eyebrow}>The architecture</p>
          <h2 className={styles.title}>
            Twelve quiet minutes, <span className={ui.highlight}>four soft steps</span>.
          </h2>
        </div>

        <div className={styles.steps}>
          {STEPS.map(({ num, duration, title, description, Icon }) => (
            <article className={styles.card} key={num}>
              <div className={styles.top}>
                <span className={styles.num}>{num}</span>
                <span className={styles.duration}>{duration}</span>
              </div>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardText}>{description}</p>
              <span className={styles.badge} aria-hidden="true">
                <Icon />
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
