import { useState } from 'react'
import type { Session } from '../lib/auth'
import { loadArrival, saveArrival } from '../lib/arrival'
import { getGreeting } from '../lib/date'
import { getOnboarding } from '../lib/onboarding'
import { toast } from '../lib/toast'
import { AmbientPlayer } from './AmbientPlayer'
import { AnchorCards } from './AnchorCards'
import { ArrivalCheckIn } from './ArrivalCheckIn'
import { CalendarPreview } from './CalendarPreview'
import { GuidanceCard } from './GuidanceCard'
import { StickyNotes } from './StickyNotes'
import styles from './DailyDashboard.module.css'

interface DailyDashboardProps {
  user: Session | null
  onOpenJournal: () => void
}

export function DailyDashboard({ user, onOpenJournal }: DailyDashboardProps) {
  const profile = getOnboarding()
  const name = user?.name.split(' ')[0] || profile?.name.split(' ')[0] || 'friend'
  const rawSeason = profile?.season || 'growing'
  const season = rawSeason === "I'm not sure yet" ? 'becoming' : rawSeason.toLowerCase()

  const [arrival, setArrival] = useState<string | null>(() => loadArrival())

  const chooseArrival = (id: string) => {
    saveArrival(id)
    setArrival(id)
    toast('Noted — thank you for arriving honestly')
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h2 className={styles.greeting}>
          {getGreeting()}, {name}.
        </h2>
        <p className={styles.sub}>You’re in your {season} season.</p>
      </header>

      <AmbientPlayer label="Calm instrumental" />
      <div className={styles.columns}>
        <ArrivalCheckIn value={arrival} onChange={chooseArrival} />
        <GuidanceCard onOpenJournal={onOpenJournal} arrival={arrival} />
      </div>
      <AnchorCards />
      <StickyNotes />
      <CalendarPreview onOpenJournal={onOpenJournal} />
    </div>
  )
}
