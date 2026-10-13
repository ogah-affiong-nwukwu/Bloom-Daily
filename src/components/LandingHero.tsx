import { ArrowRightIcon } from './icons'
import styles from './LandingHero.module.css'
import ui from './ui.module.css'

interface LandingHeroProps {
  onBeginDay: () => void
  onSignIn: () => void
}

export function LandingHero({ onBeginDay, onSignIn }: LandingHeroProps) {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.copy}>
            <p className={ui.eyebrow}>Become her · one day at a time</p>
            <h1 className={styles.title}>
              Grow a little <span className={ui.highlight}>softer</span> every day.
            </h1>
            <p className={styles.lede}>
              Bloom Daily is a quiet corner for daily affirmations, mindful breathing, and gentle reflection — a small
              ritual that helps you meet each day with a little more grace and love.
            </p>
            <div className={styles.actions}>
              <button className={ui.btnPrimary} type="button" onClick={onBeginDay}>
                Begin your day
                <ArrowRightIcon />
              </button>
              <button className={styles.signin} type="button" onClick={onSignIn}>
                Already have an account? <strong>Sign in</strong>
              </button>
            </div>
          </div>
          <div className={styles.visual}>
            <div className={styles.card}>
              <div className={styles.orb} aria-hidden="true" />
              <p className={styles.tag}>Morning reflection</p>
              <h2 className={styles.cardTitle}>Today’s quiet moment</h2>
              <blockquote className={styles.cardQuote}>
                “Let the morning meet you where you are — unhurried, unearned, enough.”
              </blockquote>
              <span className={styles.time}>Today · 6:48 AM</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
