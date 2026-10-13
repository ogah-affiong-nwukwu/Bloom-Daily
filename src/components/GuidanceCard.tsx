import { useState } from 'react'
import { toast } from '../lib/toast'
import { CopyIcon, EditNoteIcon } from './icons'
import styles from './GuidanceCard.module.css'
import ui from './ui.module.css'

interface GuidanceCardProps {
  onOpenJournal: () => void
  arrival: string | null
}

type GuideMode = 'bible' | 'mindful'

const ARRIVAL_NOTES: Record<string, string> = {
  Good: 'A bright arrival — let the day unfold without hurry.',
  Hopeful: 'Nurture the hope — water it with one small step.',
  Tired: 'Rest is part of the ritual today. Begin small.',
  Low: 'You are allowed to be low here. Nothing to fix first.',
  Overwhelmed: 'One thing at a time. The morning bends to meet you.',
  Hurt: 'Be extra tender with yourself today.',
}

export function GuidanceCard({ onOpenJournal, arrival }: GuidanceCardProps) {
  const [mode, setMode] = useState<GuideMode>('bible')

  const share = () => {
    const text = 'Daily She · Today’s guidance — Psalm 46:10 “Be still, and know that I am God.”'
    void navigator.clipboard
      .writeText(text)
      .then(() => toast('Copied — share it gently'))
      .catch(() => toast('Couldn’t copy, but the words are yours'))
  }

  return (
    <section className={ui.card}>
      <div className={styles.head}>
        <h3 className={ui.cardTitle}>Today’s guidance</h3>
        <div className={styles.toggle} role="tablist" aria-label="Guidance mode">
          <button
            className={mode === 'bible' ? `${styles.toggleBtn} ${styles.isActive}` : styles.toggleBtn}
            type="button"
            role="tab"
            aria-selected={mode === 'bible'}
            onClick={() => setMode('bible')}
          >
            Bible Study
          </button>
          <button
            className={mode === 'mindful' ? `${styles.toggleBtn} ${styles.isActive}` : styles.toggleBtn}
            type="button"
            role="tab"
            aria-selected={mode === 'mindful'}
            onClick={() => setMode('mindful')}
          >
            Mindful
          </button>
        </div>
      </div>

      {arrival && <p className={styles.arrivalNote}>{ARRIVAL_NOTES[arrival]}</p>}

      {mode === 'bible' ? (
        <>
          <ul className={styles.studies}>
            <li className={styles.study}>
              <span className={styles.studyTitle}>Scripture & Word Study</span>
              <span className={styles.verse}>Psalm 46:10</span>
              <span className={styles.studyDesc}>
                “Be still, and know that I am God.” A slow read with three reflection questions.
              </span>
            </li>
          </ul>
          <details className={styles.langStudy}>
            <summary>Original language study</summary>
            <p>
              <em>raphah</em> (רָפָה) — to let go, to release, to become still. In Psalm 46:10 this is not a command
              to strain harder; it is an invitation to loosen your grip and let the quiet hold you.
            </p>
          </details>
        </>
      ) : (
        <ul className={styles.studies}>
          <li className={styles.study}>
            <span className={styles.studyTitle}>Breath & Body</span>
            <span className={styles.studyDesc}>
              Box breathing — inhale for 4, hold for 4, exhale for 4, hold for 4. Two gentle rounds.
            </span>
          </li>
          <li className={styles.study}>
            <span className={styles.studyTitle}>Presence Practice</span>
            <span className={styles.studyDesc}>
              Name five things you can see, four you can touch, three you can hear. Arrive slowly.
            </span>
          </li>
        </ul>
      )}

      <div className={styles.actions}>
        <button className={ui.btnGhost} type="button" onClick={onOpenJournal}>
          <EditNoteIcon />
          Open Journal
        </button>
        <button className={`${ui.btnGhost} ${styles.share}`} type="button" onClick={share}>
          <CopyIcon />
          Share
        </button>
      </div>
    </section>
  )
}
