import { useState } from 'react'
import { toast } from '../lib/toast'
import { AmbientPlayer } from './AmbientPlayer'
import styles from './LandingExperience.module.css'
import ui from './ui.module.css'

interface MoodContent {
  id: string
  label: string
  title: string
  text: string
  quote: string
  source: string
}

const MOODS: MoodContent[] = [
  {
    id: 'tired',
    label: 'A little tired',
    title: 'For the tired ones',
    text: 'You do not need to perform your way through today. Begin with one gentle thing — water, a breath, a single honest sentence.',
    quote: '“Come to me, all you who are weary and burdened, and I will give you rest.”',
    source: 'Matthew 11:28',
  },
  {
    id: 'hopeful',
    label: 'A little hopeful',
    title: 'For the hopeful ones',
    text: 'Something new is forming quietly. Give it room, give it light, and do not rush it into bloom before its season.',
    quote: '“Behold, I am doing a new thing; now it springs forth.”',
    source: 'Isaiah 43:19',
  },
  {
    id: 'overwhelmed',
    label: 'A little overwhelmed',
    title: 'For the carrying-too-much ones',
    text: 'You were not made to hold it all at once. Set down what is not yours to carry, and keep only today’s small, faithful yes.',
    quote: '“Cast your burden on the Lord, and he will sustain you.”',
    source: 'Psalm 55:22',
  },
  {
    id: 'peaceful',
    label: 'A little peaceful',
    title: 'For the settled ones',
    text: 'Notice this: nothing is asking anything of you right now. Let the peace you feel become a place others can rest in.',
    quote: '“Be still, and know that I am God.”',
    source: 'Psalm 46:10',
  },
]

export function LandingExperience() {
  const [selected, setSelected] = useState(0)
  const mood = MOODS[selected]

  return (
    <section className={styles.experience}>
      <div className="container">
        <div className={styles.head}>
          <p className={ui.eyebrow}>The daily experience</p>
          <h2 className={styles.title}>
            Start where <span className={ui.highlight}>you are</span>.
          </h2>
          <p className={styles.sub}>Choose how you feel this morning — the ritual bends to meet you.</p>
        </div>

        <div className={styles.pills} role="tablist" aria-label="How do you feel this morning?">
          {MOODS.map((moodItem, index) => (
            <button
              key={moodItem.id}
              className={index === selected ? `${styles.pill} ${styles.isActive}` : styles.pill}
              type="button"
              role="tab"
              aria-selected={index === selected}
              onClick={() => setSelected(index)}
            >
              {moodItem.label}
            </button>
          ))}
        </div>

        <div className={styles.card} role="tabpanel">
          <div className={styles.reflection}>
            <h3 className={styles.reflectionTitle}>{mood.title}</h3>
            <p className={styles.reflectionText}>{mood.text}</p>
          </div>

          <figure className={styles.quoteBox}>
            <blockquote>{mood.quote}</blockquote>
            <figcaption>{mood.source}</figcaption>
          </figure>

          <AmbientPlayer label="Listen to this liturgy" tagline="“Be still, and know that I am God.” — Psalm 46:10" />

          <div className={styles.actions}>
            <button className={ui.btnPrimary} type="button" onClick={() => toast('Moment saved — it’s waiting in your journal')}>
              Save this moment
            </button>
            <button className={ui.btnGhost} type="button" onClick={() => toast('Shared gently — the words go with love')}>
              Share gently
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
