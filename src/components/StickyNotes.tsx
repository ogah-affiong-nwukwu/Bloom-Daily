import { useState } from 'react'
import { loadNotes, saveNotes } from '../lib/notes'
import type { Notes } from '../lib/notes'
import { toast } from '../lib/toast'
import { CopyIcon } from './icons'
import styles from './StickyNotes.module.css'

const CONFIG = [
  { key: 'hold', label: 'A note to hold onto', tone: 'yellow', placeholder: 'Write something to carry today…' },
  { key: 'intention', label: 'Intention for today', tone: 'pink', placeholder: 'One small intention…' },
  { key: 'reminder', label: 'Gentle reminder', tone: 'mint', placeholder: 'A kind word to yourself…' },
] as const

export function StickyNotes() {
  const [notes, setNotes] = useState<Notes>(() => loadNotes())

  const update = (key: keyof Notes, value: string) => {
    const next = { ...notes, [key]: value }
    setNotes(next)
    saveNotes(next)
  }

  const shareNote = (label: string, value: string) => {
    const text = `${label} — ${value || 'an empty note, waiting for words'}`
    void navigator.clipboard
      .writeText(text)
      .then(() => toast('Note copied — share it gently'))
      .catch(() => toast('Couldn’t copy the note'))
  }

  return (
    <section className={styles.notes}>
      <h3 className={styles.title}>Notes to yourself</h3>
      <div className={styles.grid}>
        {CONFIG.map((note, index) => (
          <div className={`${styles.note} ${styles[note.tone]}`} key={note.key}>
            <span className={styles.pin} aria-hidden="true" />
            <span className={styles.noteLabel}>{note.label}</span>
            <textarea
              className={styles.noteInput}
              rows={4}
              value={notes[note.key]}
              onChange={(event) => update(note.key, event.target.value)}
              placeholder={note.placeholder}
              aria-label={note.label}
              style={{ transform: `rotate(${(index - 1) * 1.2}deg)` }}
            />
            <div className={styles.noteFooter}>
              <button
                className={styles.shareBtn}
                type="button"
                onClick={() => shareNote(note.label, notes[note.key])}
                aria-label={`Share ${note.label}`}
              >
                <CopyIcon />
              </button>
              <span className={styles.signature}>— softly, Daily She</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
