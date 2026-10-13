import { useState } from 'react'
import { toast } from '../lib/toast'
import { ArrowRightIcon } from './icons'
import styles from './SeasonsCarousel.module.css'
import ui from './ui.module.css'

interface Season {
  num: string
  name: string
  tag: string
  overview: string
  statement: string
}

const SEASONS: Season[] = [
  {
    num: '01',
    name: 'Wintering',
    tag: 'Permission to rest',
    overview:
      'A season for soft light and slower mornings. Light the candle, keep the water warm, and let stillness be its own kind of progress.',
    statement: 'Rest is not a reward — it is the ground everything grows from.',
  },
  {
    num: '02',
    name: 'Thawing',
    tag: 'Gently reawakening',
    overview:
      'The first small signs of movement. You begin to notice what stirs again, and you greet it without demanding that it hurry.',
    statement: 'Coming back to life is allowed to be slow.',
  },
  {
    num: '03',
    name: 'Awakening',
    tag: 'New energy arrives',
    overview:
      'Mornings grow lighter and ideas return. This is the season for planting intentions — one small seed at a time.',
    statement: 'You are allowed to begin again, as many times as you need.',
  },
  {
    num: '04',
    name: 'Blooming',
    tag: 'Full color, soft heart',
    overview:
      'You are in your element. Share what is blooming, but keep a little of the garden just for you.',
    statement: 'You do not have to shrink to make room for others.',
  },
  {
    num: '05',
    name: 'Sustaining',
    tag: 'Tending what is alive',
    overview:
      'A season of watering and weeding. The work is quiet and unglamorous — and it is what keeps everything alive.',
    statement: 'What you tend today is what survives the season after.',
  },
  {
    num: '06',
    name: 'Harvesting',
    tag: 'Gathering grace',
    overview:
      'The fruit of earlier seasons shows itself. Gather it with gratitude, and let some of it be shared.',
    statement: 'You built more than you remember building.',
  },
  {
    num: '07',
    name: 'Shedding',
    tag: 'Letting go with care',
    overview:
      'Not everything is meant to travel with you. This season teaches the gentle art of release.',
    statement: 'Letting go is not losing — it is making room.',
  },
  {
    num: '08',
    name: 'Returning',
    tag: 'Coming home to yourself',
    overview:
      'The circle closes softly. You return to yourself carrying everything the seasons have taught you.',
    statement: 'You were never lost — you were becoming.',
  },
]

export function SeasonsCarousel() {
  const [selected, setSelected] = useState(0)
  const season = SEASONS[selected]

  return (
    <section className={styles.seasons}>
      <div className="container">
        <div className={styles.head}>
          <p className={ui.eyebrow}>The seasons</p>
          <h2 className={styles.title}>
            Every season has <span className={ui.highlight}>a practice</span>.
          </h2>
        </div>

        <div className={styles.tabs} role="tablist" aria-label="Seasons">
          {SEASONS.map((seasonItem, index) => (
            <button
              key={seasonItem.num}
              className={index === selected ? `${styles.tab} ${styles.isActive}` : styles.tab}
              type="button"
              role="tab"
              aria-selected={index === selected}
              onClick={() => setSelected(index)}
            >
              <span className={styles.num}>{seasonItem.num}</span>
              <span className={styles.name}>{seasonItem.name}</span>
            </button>
          ))}
        </div>

        <div className={styles.panel} role="tabpanel">
          <div className={styles.overview}>
            <p className={styles.tag}>
              {season.name} — {season.tag}
            </p>
            <h3 className={styles.panelTitle}>{season.name}</h3>
            <p className={styles.text}>{season.overview}</p>
          </div>
          <div className={styles.statementWrap}>
            <p className={styles.statement}>“{season.statement}”</p>
            <button
              className={ui.btnPrimary}
              type="button"
              onClick={() => toast(`${season.name} — noted. Bloom at your own pace.`)}
            >
              This feels like me
              <ArrowRightIcon />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
