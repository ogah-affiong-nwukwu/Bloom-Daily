import styles from './LandingRefrain.module.css'
import ui from './ui.module.css'

export function LandingRefrain() {
  return (
    <section className={styles.refrain}>
      <div className="container">
        <div className={styles.divider} aria-hidden="true" />
        <p className={styles.statement}>
          You are not behind. You are <span className={ui.highlight}>becoming</span>.
        </p>
        <div className={styles.divider} aria-hidden="true" />
      </div>
    </section>
  )
}
