import { useState } from 'react'
import { nowISO } from '../lib/date'
import { getOnboarding } from '../lib/onboarding'
import { generateInsight, loadReflections, saveReflections } from '../lib/reflections'
import type { Reflection } from '../lib/reflections'
import { toast } from '../lib/toast'
import { BookIcon, EditNoteIcon, SearchIcon, TrashIcon } from './icons'
import styles from './JournalView.module.css'
import ui from './ui.module.css'

const PROMPTS = [
  'Just write',
  'What am I feeling today?',
  'What do I need right now?',
  'What am I learning about myself?',
  'What am I proud of?',
  'What feels difficult?',
]

const TAG_EMOJI: Record<string, string> = {
  Peace: '🌱',
  Hope: '🌅',
  Trust: '🤍',
  Gratitude: '🙏',
  Patience: '🕯️',
  'Letting go': '🍂',
}

const TAG_TONE: Record<string, string> = {
  Peace: 'toneSage',
  Hope: 'toneSky',
  Trust: 'toneLavender',
  Gratitude: 'toneYellow',
  Patience: 'toneRose',
  'Letting go': 'tonePeach',
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso)
  const day = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  const time = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  return `${day} · ${time}`
}

type Mode = 'memories' | 'write'

export function JournalView() {
  const [mode, setMode] = useState<Mode>('memories')
  const [reflections, setReflections] = useState<Reflection[]>(() => loadReflections())
  const [text, setText] = useState('')
  const [promptChoice, setPromptChoice] = useState('Just write')
  const [query, setQuery] = useState('')

  const profile = getOnboarding()
  const season = profile?.season && profile.season !== "I'm not sure yet" ? profile.season : 'Becoming'

  const saveReflection = () => {
    if (!text.trim()) {
      toast('Write a few honest words first')
      return
    }
    const entry: Reflection = {
      id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      text: text.trim(),
      tags: [],
      createdAt: nowISO(),
      prompt: promptChoice === 'Just write' ? undefined : promptChoice,
    }
    const next = [entry, ...reflections]
    setReflections(next)
    saveReflections(next)
    setText('')
    setPromptChoice('Just write')
    setMode('memories')
    toast('Reflection saved')
  }

  const cancel = () => {
    setText('')
    setPromptChoice('Just write')
    setMode('memories')
  }

  const remove = (id: string) => {
    const next = reflections.filter((entry) => entry.id !== id)
    setReflections(next)
    saveReflections(next)
    toast('Entry deleted')
  }

  const drawInsight = (id: string) => {
    const next = reflections.map((entry) =>
      entry.id === id ? { ...entry, insight: generateInsight(entry) } : entry,
    )
    setReflections(next)
    saveReflections(next)
  }

  const visible = reflections.filter((entry) =>
    `${entry.text} ${entry.prompt ?? ''}`.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className={styles.journal}>
      <header className={styles.header}>
        <p className={styles.privateTag}>Private & Unhurried</p>
        <div className={styles.headerRow}>
          <div className={styles.heading}>
            <h2 className={styles.title}>What’s on your mind?</h2>
            <p className={styles.sub}>
              Your space to reflect honestly without performance. Everything stays stored securely in your browser.
            </p>
          </div>
          <div className={styles.modeToggle} role="tablist" aria-label="Journal mode">
            <button
              className={mode === 'write' ? `${styles.modeBtn} ${styles.isActive}` : styles.modeBtn}
              type="button"
              role="tab"
              aria-selected={mode === 'write'}
              onClick={() => setMode('write')}
            >
              <EditNoteIcon />
              Write reflection
            </button>
            <button
              className={mode === 'memories' ? `${styles.modeBtn} ${styles.isActive}` : styles.modeBtn}
              type="button"
              role="tab"
              aria-selected={mode === 'memories'}
              onClick={() => setMode('memories')}
            >
              <BookIcon />
              Memories
            </button>
          </div>
        </div>
      </header>

      {mode === 'write' ? (
        <section className={`${ui.card} ${styles.composer}`}>
          <div className={styles.composerTop}>
            <span className={styles.seasonLabel}>Writing in {season}</span>
            <button className={styles.cancel} type="button" onClick={cancel}>
              Cancel
            </button>
          </div>

          <div className={styles.promptSection}>
            <span className={styles.promptLabel}>Choose a prompt or write freely:</span>
            <div className={styles.promptChips} role="group" aria-label="Choose a prompt">
              {PROMPTS.map((promptItem) => (
                <button
                  key={promptItem}
                  className={promptChoice === promptItem ? `${styles.chip} ${styles.isActive}` : styles.chip}
                  type="button"
                  aria-pressed={promptChoice === promptItem}
                  onClick={() => setPromptChoice(promptItem)}
                >
                  {promptItem}
                </button>
              ))}
            </div>
          </div>

          <textarea
            className={styles.input}
            rows={12}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Start with whatever is honest..."
            autoFocus
          />

          <div className={styles.composerBottom}>
            <span className={styles.secureHint}>Saved securely in your browser</span>
            <button className={ui.btnPrimary} type="button" onClick={saveReflection}>
              Save reflection
            </button>
          </div>
        </section>
      ) : (
        <>
          <div className={styles.search} role="search">
            <SearchIcon />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search your reflections..."
              aria-label="Search your reflections"
            />
          </div>

          {visible.length === 0 ? (
            <p className={styles.emptyNote}>No reflections yet — your gentle words will bloom here.</p>
          ) : (
            <div className={styles.feed}>
              {visible.map((entry) => (
                <article className={styles.card} key={entry.id}>
                  <header className={styles.cardHead}>
                    <span className={styles.timestamp}>{formatTimestamp(entry.createdAt)}</span>
                    <div className={styles.moodTags}>
                      {entry.tags.map((tag) => (
                        <span className={`${styles.moodTag} ${ui[TAG_TONE[tag] ?? 'tonePeach']}`} key={tag}>
                          <span aria-hidden="true">{TAG_EMOJI[tag] ?? '·'}</span>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button className={styles.trash} type="button" onClick={() => remove(entry.id)} aria-label="Delete entry">
                      <TrashIcon />
                    </button>
                  </header>

                  {entry.prompt && <blockquote className={styles.promptQuote}>{entry.prompt}</blockquote>}
                  <p className={styles.text}>{entry.text}</p>

                  {entry.insight ? (
                    <div className={styles.insight}>
                      <p className={styles.insightTitle}>✨ Contemplative Insight</p>
                      <p className={styles.insightParagraph}>{entry.insight.paragraph}</p>
                      <div className={styles.verseCard}>
                        <blockquote>{entry.insight.verse}</blockquote>
                        <span>{entry.insight.verseRef}</span>
                      </div>
                      <div className={styles.affirmation}>{entry.insight.affirmation}</div>
                      <footer className={styles.insightFooter}>{entry.insight.grounding}</footer>
                    </div>
                  ) : (
                    <button className={styles.drawBtn} type="button" onClick={() => drawInsight(entry.id)}>
                      ✨ Draw out reflection insights
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
