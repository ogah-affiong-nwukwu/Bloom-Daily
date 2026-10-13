import styles from './ModelComparison.module.css'
import ui from './ui.module.css'

const SANCTUM = [
  'Miss a day? The streak simply pauses — no shame, no scolding.',
  'Private by default — your words never leave your device.',
  'Unhurried — visit when you need a breath, not on a timer.',
]

const PERFORMANCE = [
  'Streaks that break loudly and demand perfection.',
  'Scores and leaderboards that turn rest into competition.',
  'Countdowns that turn a quiet moment into a deadline.',
]

export function ModelComparison() {
  return (
    <section className={styles.comparison}>
      <div className="container">
        <div className={styles.head}>
          <p className={ui.eyebrow}>Why it works</p>
          <h2 className={styles.title}>
            Practice that <span className={ui.highlight}>nurtures</span>, never punishes.
          </h2>
        </div>

        <div className={styles.cards}>
          <article className={`${styles.card} ${styles.sanctum}`}>
            <h3 className={styles.cardTitle}>The Sanctum Model</h3>
            <p className={styles.cardSub}>Guilt-free practice</p>
            <ul className={styles.list}>
              {SANCTUM.map((item) => (
                <li className={styles.keep} key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <article className={`${styles.card} ${styles.performance}`}>
            <h3 className={styles.cardTitle}>The Performance Model</h3>
            <p className={styles.cardSub}>Rigid metrics</p>
            <ul className={styles.list}>
              {PERFORMANCE.map((item) => (
                <li className={styles.drop} key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  )
}
