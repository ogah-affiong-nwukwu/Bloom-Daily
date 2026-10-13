import { useState } from 'react'
import { formatDate } from '../lib/date'
import { loadMilestones, MILESTONES, toggleMilestone } from '../lib/milestones'
import type { MilestoneStore } from '../lib/milestones'
import { getOnboarding } from '../lib/onboarding'
import { loadReflections } from '../lib/reflections'
import { toast } from '../lib/toast'
import styles from './GrowthView.module.css'
import ui from './ui.module.css'

const AREA_FALLBACKS = ['Faith', 'Career & Work', 'Discipline', 'Peace']
const AREA_STATUS = ['Tending', 'Sprouting', 'Blooming', 'Taking root']
const AREA_TONES = ['toneSage', 'tonePeach', 'toneYellow', 'toneLavender', 'toneRose', 'toneSky'] as const

type JourneyKind = 'Milestone' | 'Season' | 'Reflection'
type TimelineFilter = 'All' | 'Milestones' | 'Seasons'

const KIND_BY_FILTER: Record<TimelineFilter, JourneyKind | 'All'> = {
  All: 'All',
  Milestones: 'Milestone',
  Seasons: 'Season',
}

const KIND_TONE: Record<JourneyKind, string> = {
  Milestone: 'toneSage',
  Season: 'tonePeach',
  Reflection: 'toneLavender',
}

interface JourneyItem {
  id: string
  kind: JourneyKind
  title: string
  detail: string
  date: string
}

function buildTimeline(milestones: MilestoneStore): JourneyItem[] {
  const items: JourneyItem[] = []
  Object.entries(milestones).forEach(([id, state]) => {
    if (!state.done || !state.completedAt) return
    const meta = MILESTONES.find((milestone) => milestone.id === id)
    items.push({
      id: `milestone-${id}`,
      kind: 'Milestone',
      title: meta?.title ?? id,
      detail: meta?.desc ?? '',
      date: state.completedAt,
    })
  })
  const profile = getOnboarding()
  if (profile?.completedAt) {
    items.push({
      id: 'season-start',
      kind: 'Season',
      title: `You entered your ${profile.season || 'growing'} season`,
      detail: `Cadence: ${profile.cadence} · Encouragement: ${profile.style} voice`,
      date: profile.completedAt,
    })
  }
  loadReflections().forEach((reflection) => {
    const text = reflection.text.trim()
    if (!text) return
    items.push({
      id: `reflection-${reflection.id}`,
      kind: 'Reflection',
      title: text.split(/\s+/).slice(0, 7).join(' '),
      detail: text,
      date: reflection.createdAt,
    })
  })
  return items.sort((a, b) => b.date.localeCompare(a.date))
}

export function GrowthView() {
  const profile = getOnboarding()
  const areas = profile?.areas.length ? profile.areas : AREA_FALLBACKS

  const [milestones, setMilestones] = useState<MilestoneStore>(() => loadMilestones())
  const [filter, setFilter] = useState<TimelineFilter>('All')
  const [expanded, setExpanded] = useState<string | null>(null)

  const completed = MILESTONES.filter((milestone) => milestones[milestone.id]?.done).length

  const handleToggle = (id: string) => {
    const next = toggleMilestone(id)
    setMilestones(next)
    toast(next[id]?.done ? 'Milestone completed — the garden notices' : 'Milestone reopened')
  }

  const timeline = buildTimeline(milestones).filter(
    (item) => KIND_BY_FILTER[filter] === 'All' || item.kind === KIND_BY_FILTER[filter],
  )

  return (
    <div className={styles.growth}>
      <header className={styles.header}>
        <p className={ui.eyebrow}>Growth & journey</p>
        <h2 className={styles.title}>Am I actually changing?</h2>
        <p className={styles.intro}>
          Yes — quietly, in ways that don’t announce themselves. Growth here is tracked in seasons, small milestones,
          and the notes you leave for yourself along the way.
        </p>
      </header>

      <section className={`${ui.card} ${styles.explainer}`}>
        <h3 className={ui.cardTitle}>How growth works</h3>
        <div className={styles.explainerGrid}>
          <div className={`${styles.explainerItem} ${ui.toneSage}`}>
            <span className={styles.explainerTitle}>Seasons</span>
            <p>You move through seasons — Growing, Healing, Resting — not deadlines.</p>
          </div>
          <div className={`${styles.explainerItem} ${ui.tonePeach}`}>
            <span className={styles.explainerTitle}>Milestones</span>
            <p>Small, faithful markers of change. Each one noticed, never rushed.</p>
          </div>
          <div className={`${styles.explainerItem} ${ui.toneLavender}`}>
            <span className={styles.explainerTitle}>Sticky Notes</span>
            <p>Gentle reminders that keep you honest with the person you’re becoming.</p>
          </div>
        </div>
      </section>

      <section className={`${ui.card} ${styles.milestones}`}>
        <div className={styles.milestoneHead}>
          <h3 className={ui.cardTitle}>Season milestones</h3>
          <span className={styles.progressLabel}>
            {completed} / {MILESTONES.length} Completed
          </span>
        </div>
        <div className={styles.progressBar} aria-hidden="true">
          <div className={styles.progressFill} style={{ width: `${(completed / MILESTONES.length) * 100}%` }} />
        </div>
        <ul className={styles.milestoneList}>
          {MILESTONES.map((milestone) => {
            const state = milestones[milestone.id] ?? { done: false }
            return (
              <li className={state.done ? `${styles.milestone} ${styles.isDone}` : styles.milestone} key={milestone.id}>
                <button
                  className={styles.milestoneToggle}
                  type="button"
                  aria-pressed={state.done}
                  onClick={() => handleToggle(milestone.id)}
                >
                  <span className={styles.checkbox} aria-hidden="true">
                    {state.done ? '✓' : ''}
                  </span>
                  <span className={styles.milestoneBody}>
                    <span className={styles.milestoneTitle}>{milestone.title}</span>
                    <span className={styles.milestoneDesc}>{milestone.desc}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.areas}>
        <h3 className={styles.sectionTitle}>Areas of becoming</h3>
        <div className={styles.areaGrid}>
          {areas.map((area, index) => (
            <div className={`${styles.areaCard} ${ui[AREA_TONES[index % AREA_TONES.length]]}`} key={area}>
              <span className={styles.areaName}>{area}</span>
              <span className={styles.areaStatus}>{AREA_STATUS[index % AREA_STATUS.length]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.timeline}>
        <div className={styles.timelineHead}>
          <h3 className={styles.sectionTitle}>Journey memories</h3>
          <div className={styles.filters} role="tablist" aria-label="Timeline filter">
            {(['All', 'Milestones', 'Seasons'] as TimelineFilter[]).map((option) => (
              <button
                key={option}
                className={filter === option ? `${styles.filter} ${styles.isActive}` : styles.filter}
                type="button"
                role="tab"
                aria-selected={filter === option}
                onClick={() => setFilter(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        {timeline.length === 0 ? (
          <p className={styles.empty}>Nothing recorded yet — your journey will gather here, one gentle day at a time.</p>
        ) : (
          <ul className={styles.timelineList}>
            {timeline.map((item) => (
              <li className={styles.timelineItem} key={item.id}>
                <button
                  className={styles.timelineBtn}
                  type="button"
                  onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                >
                  <span className={`${styles.timelineKind} ${ui[KIND_TONE[item.kind]]}`}>{item.kind}</span>
                  <span className={styles.timelineTitle}>{item.title}</span>
                  <span className={styles.timelineDate}>{formatDate(item.date.slice(0, 10))}</span>
                </button>
                {expanded === item.id && <p className={styles.timelineDetail}>{item.detail}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
