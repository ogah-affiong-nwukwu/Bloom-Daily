import { ArrowRightIcon } from './icons'
import styles from './LandingCta.module.css'
import ui from './ui.module.css'

const YEAR = new Date().getFullYear()

interface LandingCtaProps {
  onBeginDay: () => void
}

export function LandingCta({ onBeginDay }: LandingCtaProps) {
  return (
    <>
      <section className={styles.cta}>
        <div className="container">
          <h2 className={styles.title}>Your quiet ritual is ready when you are.</h2>
          <p className={styles.sub}>One affirmation. Four breaths. Five quiet minutes. Begin whenever you bloom.</p>
          <button className={ui.btnPrimary} type="button" onClick={onBeginDay}>
            Begin your day
            <ArrowRightIcon />
          </button>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={`container ${styles.footerInner}`}>
          <p className={styles.copyright}>© {YEAR} Bloom Daily — grow a little softer every day</p>
          <nav className={styles.links} aria-label="Legal">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </nav>
        </div>
      </footer>
    </>
  )
}
