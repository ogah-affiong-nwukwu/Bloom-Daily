import { useState } from 'react'
import styles from './App.module.css'
import { AppNav } from './components/AppNav'
import { AuthModal } from './components/AuthModal'
import { DailyDashboard } from './components/DailyDashboard'
import { GardenView } from './components/GardenView'
import { GrowthView } from './components/GrowthView'
import { Header } from './components/Header'
import { JournalView } from './components/JournalView'
import { LandingView } from './components/LandingView'
import { OnboardingFlow } from './components/onboarding/OnboardingFlow'
import { ProfileView } from './components/ProfileView'
import { ToastHost } from './components/ToastHost'
import { clearSession, getSession } from './lib/auth'
import type { Session } from './lib/auth'
import type { AuthMode, TabId } from './types'

const FOOTER_YEAR = new Date().getFullYear()

type Screen = 'landing' | 'onboarding' | 'app'

export default function App() {
  const [screen, setScreen] = useState<Screen>(() => (getSession() ? 'app' : 'landing'))
  const [user, setUser] = useState<Session | null>(() => getSession())
  const [tab, setTab] = useState<TabId>('home')
  const [authMode, setAuthMode] = useState<AuthMode>('signin')
  const [authOpen, setAuthOpen] = useState(false)

  const openSignIn = () => {
    setAuthMode('signin')
    setAuthOpen(true)
  }

  const startOnboarding = () => {
    setAuthOpen(false)
    setScreen('onboarding')
  }

  const signOut = () => {
    clearSession()
    setUser(null)
    setScreen('landing')
  }

  if (screen === 'landing') {
    return (
      <>
        <Header onBeginDay={startOnboarding} onSignUp={startOnboarding} />
        <LandingView onBeginDay={startOnboarding} onSignIn={openSignIn} />
        <AuthModal
          key={authOpen ? authMode : 'closed'}
          open={authOpen}
          initialMode={authMode}
          onClose={() => setAuthOpen(false)}
          onSignedIn={(session) => {
            setUser(session)
            setAuthOpen(false)
            setScreen('app')
          }}
          onCreateAccount={startOnboarding}
        />
        <ToastHost />
      </>
    )
  }

  if (screen === 'onboarding') {
    return (
      <>
        <Header />
        <OnboardingFlow
          onComplete={(session) => {
            setUser(session)
            setScreen('app')
          }}
          onExit={() => setScreen('landing')}
        />
        <ToastHost />
      </>
    )
  }

  return (
    <>
      <AppNav user={user} active={tab} onChange={setTab} onSignOut={signOut} />
      <main className="container">
        <section
          id="home"
          className={tab === 'home' ? `${styles.view} ${styles.isActive}` : styles.view}
          role="tabpanel"
          aria-labelledby="tab-home"
        >
          <DailyDashboard user={user} onOpenJournal={() => setTab('journal')} />
        </section>
        <section
          id="growth"
          className={tab === 'growth' ? `${styles.view} ${styles.isActive}` : styles.view}
          role="tabpanel"
          aria-labelledby="tab-growth"
        >
          <GrowthView />
        </section>
        <section
          id="journal"
          className={tab === 'journal' ? `${styles.view} ${styles.isActive}` : styles.view}
          role="tabpanel"
          aria-labelledby="tab-journal"
        >
          <JournalView />
        </section>
        <section
          id="garden"
          className={tab === 'garden' ? `${styles.view} ${styles.isActive}` : styles.view}
          role="tabpanel"
          aria-labelledby="tab-garden"
        >
          <GardenView />
        </section>
        <section
          id="profile"
          className={tab === 'profile' ? `${styles.view} ${styles.isActive}` : styles.view}
          role="tabpanel"
          aria-labelledby="tab-profile"
        >
          <ProfileView user={user} onNameSaved={(name) => setUser((current) => (current ? { ...current, name } : current))} />
        </section>
      </main>
      <footer className={styles.footer}>
        <p>Bloom Daily · grow a little softer every day · {FOOTER_YEAR}</p>
      </footer>
      <ToastHost />
    </>
  )
}
