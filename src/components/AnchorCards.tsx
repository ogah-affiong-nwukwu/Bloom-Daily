import styles from './AnchorCards.module.css'
import ui from './ui.module.css'

const ANCHORS = [
  {
    tag: 'Affirmation',
    title: 'You are allowed to arrive exactly as you are.',
    note: 'Nothing to prove. Nothing to fix first.',
    tone: 'toneSage',
  },
  {
    tag: 'Scripture',
    title: '“There is a time for everything, and a season for every activity under the heavens.”',
    note: 'Ecclesiastes 3:1',
    tone: 'tonePeach',
  },
  {
    tag: 'Breath',
    title: 'Inhale for four — hold for four — exhale for four — hold for four.',
    note: 'Two gentle rounds, whenever you drift.',
    tone: 'toneSky',
  },
]

export function AnchorCards() {
  return (
    <section className={styles.anchors}>
      <h3 className={styles.title}>Gentle anchors for today</h3>
      <div className={styles.grid}>
        {ANCHORS.map((anchor) => (
          <article className={`${styles.card} ${ui[anchor.tone]}`} key={anchor.tag}>
            <span className={styles.tag}>{anchor.tag}</span>
            <p className={styles.cardTitle}>{anchor.title}</p>
            <span className={styles.note}>{anchor.note}</span>
          </article>
        ))}
      </div>
    </section>
  )
}
