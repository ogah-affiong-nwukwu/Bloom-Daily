import { useState } from 'react'
import { clearArrival } from '../lib/arrival'
import { updateSessionName } from '../lib/auth'
import type { Session } from '../lib/auth'
import { clearGarden } from '../lib/garden'
import { clearMilestones } from '../lib/milestones'
import { clearNotes } from '../lib/notes'
import { getOnboarding, saveOnboarding } from '../lib/onboarding'
import { clearReflections } from '../lib/reflections'
import { toast } from '../lib/toast'
import type { OnboardingProfile } from '../types'
import styles from './ProfileView.module.css'
import ui from './ui.module.css'

type SettingsTab = 'me' | 'settings' | 'privacy' | 'help'

const SEASONS = ['Growing', 'Building', 'Healing', 'Rebuilding', 'Discovering', 'Resting', 'Becoming']

const AREAS = [
  'Faith',
  'Career & Work',
  'Peace',
  'Discipline',
  'Self-Worth',
  'Purpose',
  'Confidence',
  'Relationships',
  'Emotional Resilience',
  'Personal Development',
]

const VOICES = [
  { id: 'Soft', desc: 'Gentle & Reassuring', preview: 'Be gentle with yourself today. You are doing better than you know.' },
  { id: 'Deep', desc: 'Thoughtful & Reflective', preview: 'What is this moment asking of you — and what would it look like to answer slowly?' },
  { id: 'Bold', desc: 'Confident & Motivating', preview: 'You were made for more than this. Rise, and take the next faithful step.' },
  { id: 'Direct', desc: 'Clear & Practical', preview: 'Name the one thing you can do today. Do that. Let the rest wait.' },
]

const CADENCES = ['Dawn & Morning Solitude', 'Midday Sanctuary', 'Evening Vespers', 'Gentle Freeform Flow']

interface ProfileViewProps {
  user: Session | null
  onNameSaved: (name: string) => void
}

function updateProfile(patch: Partial<OnboardingProfile>) {
  const current = getOnboarding()
  const base: OnboardingProfile = current ?? {
    name: '',
    email: '',
    areas: [],
    season: 'Growing',
    style: 'Soft',
    faith: 'Both / Guided Harmony',
    depth: 'Balanced Everyday',
    cadence: 'Gentle Freeform Flow',
    completedAt: new Date().toISOString(),
  }
  saveOnboarding({ ...base, ...patch })
}

export function ProfileView({ user, onNameSaved }: ProfileViewProps) {
  const profile = getOnboarding()
  const [tab, setTab] = useState<SettingsTab>('me')
  const [name, setName] = useState(user?.name ?? profile?.name ?? '')

  const saveName = () => {
    const trimmed = name.trim()
    if (!trimmed) {
      toast('Please enter a name first')
      return
    }
    updateSessionName(trimmed)
    updateProfile({ name: trimmed })
    onNameSaved(trimmed)
    toast('Name updated — it suits you')
  }

  const setSeason = (season: string) => {
    updateProfile({ season })
    toast(`${season} season — noted`)
  }

  const toggleArea = (area: string) => {
    const current = new Set(profile?.areas ?? [])
    if (current.has(area)) current.delete(area)
    else current.add(area)
    updateProfile({ areas: [...current] })
    toast('Growth areas updated')
  }

  const setVoice = (style: string) => {
    updateProfile({ style })
    toast(`${style} voice — noted`)
  }

  const setCadence = (cadence: string) => {
    updateProfile({ cadence })
    toast('Cadence updated')
  }

  const resetData = () => {
    clearReflections()
    clearNotes()
    clearMilestones()
    clearGarden()
    clearArrival()
    toast('Sanctuary data cleared — a fresh beginning')
  }

  return (
    <div className={styles.profile}>
      <header className={styles.header}>
        <p className={ui.eyebrow}>Profile & preferences</p>
        <h2 className={styles.title}>Make the sanctuary yours.</h2>
      </header>

      <div className={styles.tabs} role="tablist" aria-label="Settings sections">
        {(['me', 'settings', 'privacy', 'help'] as SettingsTab[]).map((option) => (
          <button
            key={option}
            className={tab === option ? `${styles.tab} ${styles.isActive}` : styles.tab}
            type="button"
            role="tab"
            aria-selected={tab === option}
            onClick={() => setTab(option)}
          >
            {option === 'me' ? 'Me' : option === 'settings' ? 'App Settings' : option === 'privacy' ? 'Privacy' : 'Help'}
          </button>
        ))}
      </div>

      {tab === 'me' && (
        <div className={styles.panel}>
          <section className={ui.card}>
            <h3 className={ui.cardTitle}>Your name</h3>
            <div className={styles.nameRow}>
              <input
                className={styles.nameInput}
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="What should we call you?"
                aria-label="Your name"
              />
              <button className={ui.btnPrimary} type="button" onClick={saveName}>
                Save
              </button>
            </div>
          </section>

          <section className={ui.card}>
            <h3 className={ui.cardTitle}>Current season</h3>
            <div className={styles.pillGrid}>
              {SEASONS.map((season) => (
                <button
                  key={season}
                  className={(profile?.season ?? 'Growing') === season ? `${styles.pill} ${styles.isActive}` : styles.pill}
                  type="button"
                  aria-pressed={(profile?.season ?? 'Growing') === season}
                  onClick={() => setSeason(season)}
                >
                  {season}
                </button>
              ))}
            </div>
          </section>

          <section className={ui.card}>
            <h3 className={ui.cardTitle}>Growth areas</h3>
            <div className={styles.pillGrid}>
              {AREAS.map((area) => {
                const active = (profile?.areas ?? []).includes(area)
                return (
                  <button
                    key={area}
                    className={active ? `${styles.pill} ${styles.isActive}` : styles.pill}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleArea(area)}
                  >
                    {area}
                  </button>
                )
              })}
            </div>
          </section>

          <section className={ui.card}>
            <h3 className={ui.cardTitle}>Encouragement voice</h3>
            <div className={styles.voiceGrid}>
              {VOICES.map((voice) => {
                const active = (profile?.style ?? 'Soft') === voice.id
                return (
                  <button
                    key={voice.id}
                    className={active ? `${styles.voice} ${styles.isActive}` : styles.voice}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setVoice(voice.id)}
                  >
                    <span className={styles.voiceName}>{voice.id}</span>
                    <span className={styles.voiceDesc}>{voice.desc}</span>
                    <span className={styles.voicePreview}>“{voice.preview}”</span>
                  </button>
                )
              })}
            </div>
          </section>
        </div>
      )}

      {tab === 'settings' && (
        <div className={styles.panel}>
          <section className={ui.card}>
            <h3 className={ui.cardTitle}>Sacred cadence</h3>
            <div className={styles.pillGrid}>
              {CADENCES.map((cadence) => (
                <button
                  key={cadence}
                  className={(profile?.cadence ?? 'Gentle Freeform Flow') === cadence ? `${styles.pill} ${styles.isActive}` : styles.pill}
                  type="button"
                  aria-pressed={(profile?.cadence ?? 'Gentle Freeform Flow') === cadence}
                  onClick={() => setCadence(cadence)}
                >
                  {cadence}
                </button>
              ))}
            </div>
          </section>

          <section className={ui.card}>
            <h3 className={ui.cardTitle}>Data</h3>
            <p className={styles.copy}>
              Everything lives on this device. You can clear your reflections, notes, milestones, and garden below.
            </p>
            <button className={`${ui.btnGhost} ${styles.danger}`} type="button" onClick={resetData}>
              Reset sanctuary data
            </button>
          </section>
        </div>
      )}

      {tab === 'privacy' && (
        <div className={styles.panel}>
          <section className={ui.card}>
            <h3 className={ui.cardTitle}>Private by default</h3>
            <ul className={styles.list}>
              <li>Your words and check-ins never leave your device.</li>
              <li>No scores, no leaderboards, no public profiles.</li>
              <li>Nothing is shared unless you choose to copy and share it yourself.</li>
            </ul>
          </section>
        </div>
      )}

      {tab === 'help' && (
        <div className={styles.panel}>
          <section className={ui.card}>
            <h3 className={ui.cardTitle}>Gentle help</h3>
            <ul className={styles.list}>
              <li>Miss a day? The streak simply pauses. Nothing is lost.</li>
              <li>Your season can change whenever you do — Profile → Current season.</li>
              <li>Want a fresh start? App Settings → Reset sanctuary data.</li>
            </ul>
          </section>
        </div>
      )}
    </div>
  )
}
