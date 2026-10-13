import { FlowSequence } from './FlowSequence'
import { LandingCta } from './LandingCta'
import { LandingExperience } from './LandingExperience'
import { LandingHero } from './LandingHero'
import { LandingRefrain } from './LandingRefrain'
import { ModelComparison } from './ModelComparison'
import { SeasonsCarousel } from './SeasonsCarousel'
import styles from './LandingView.module.css'

interface LandingViewProps {
  onBeginDay: () => void
  onSignIn: () => void
}

export function LandingView({ onBeginDay, onSignIn }: LandingViewProps) {
  return (
    <main className={styles.landing}>
      <LandingHero onBeginDay={onBeginDay} onSignIn={onSignIn} />
      <LandingRefrain />
      <LandingExperience />
      <SeasonsCarousel />
      <FlowSequence />
      <ModelComparison />
      <LandingCta onBeginDay={onBeginDay} />
    </main>
  )
}
