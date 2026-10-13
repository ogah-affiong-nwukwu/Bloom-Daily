import { useState } from 'react'
import { loadTends, stageFor, tendSeed } from '../lib/garden'
import { getOnboarding } from '../lib/onboarding'
import { toast } from '../lib/toast'
import { SproutIcon } from './icons'
import styles from './GardenView.module.css'
import ui from './ui.module.css'

const AREA_FALLBACKS = ['Peace', 'Faith', 'Self-Worth', 'Discipline']
const AREA_TONES = ['toneSage', 'toneSky', 'tonePeach', 'toneYellow', 'toneRose', 'toneLavender'] as const

const PROMPTS: Record<string, string> = {
  Peace: 'Where in your day can you let one thing be unfinished, and still be at peace?',
  Faith: 'What would it look like to trust the timing of this season, just for today?',
  'Self-Worth': 'Write one true, kind sentence about yourself — and let it stand.',
  Discipline: 'Which single small yes would you like to keep faithfully this week?',
  'Career & Work': 'What does faithfulness at your work look like without hurry or comparison?',
  Purpose: 'What small thing today already points toward the life you are building?',
  Relationships: 'Who can you offer a gentle, unhurried moment of attention today?',
  Confidence: 'Name one thing you already know how to do — and how it carried you before.',
  'Emotional Resilience': 'What has helped you weather hard days before? It still counts.',
  'Personal Development': 'What is one small practice you are becoming, not performing?',
}

export function GardenView() {
  const profile = getOnboarding()
  const areas = profile?.areas.length ? profile.areas : AREA_FALLBACKS
  const [tends, setTends] = useState<Record<string, number>>(() => loadTends())
  const [selected, setSelected] = useState<string | null>(null)

  const tend = (area: string) => {
    setTends(tendSeed(area))
    toast(`${area} tended — it is growing.`)
  }

  return (
    <div className={styles.garden}>
      <header className={styles.header}>
        <p className={ui.eyebrow}>The growth garden</p>
        <h2 className={styles.title}>Sanctuary Meadow</h2>
        <p className={styles.intro}>
          Every time you show up — a check-in, a reflection, a tended seed — something here grows. Nothing is
          rushed; everything is noticed.
        </p>
      </header>

      <div className={styles.meadow}>
        {areas.map((area, index) => {
          const count = tends[area] ?? 0
          const isSelected = selected === area
          return (
            <article
              className={
                isSelected
                  ? `${styles.plant} ${styles.isSelected} ${ui[AREA_TONES[index % AREA_TONES.length]]}`
                  : `${styles.plant} ${ui[AREA_TONES[index % AREA_TONES.length]]}`
              }
              key={area}
            >
              <button
                className={styles.plantMain}
                type="button"
                aria-expanded={isSelected}
                onClick={() => setSelected(isSelected ? null : area)}
              >
                <span className={styles.sprout} aria-hidden="true">
                  <SproutIcon />
                </span>
                <span className={styles.plantName}>{area}</span>
                <span className={styles.stage}>{stageFor(count)}</span>
                <span className={styles.tended}>
                  Tended {count} {count === 1 ? 'time' : 'times'}
                </span>
                <span className={styles.dots} aria-hidden="true">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={i < count ? `${styles.dot} ${styles.filled}` : styles.dot} />
                  ))}
                </span>
              </button>
              {isSelected && (
                <div className={styles.detail}>
                  <p className={styles.prompt}>{PROMPTS[area] ?? 'What does growing here look like today?'}</p>
                  <button className={ui.btnPrimary} type="button" onClick={() => tend(area)}>
                    Tend this seed
                  </button>
                </div>
              )}
            </article>
          )
        })}
      </div>

      <section className={styles.footer}>
        <p className={styles.footerText}>
          Growth isn’t linear. Some seeds rest underground for seasons — and that is still growing.
        </p>
        <span className={styles.footerSign}>— the garden, patiently</span>
      </section>
    </div>
  )
}
