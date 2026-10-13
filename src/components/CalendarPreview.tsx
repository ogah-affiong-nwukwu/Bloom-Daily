import { ArrowRightIcon } from './icons'
import styles from './CalendarPreview.module.css'

interface CalendarPreviewProps {
  onOpenJournal: () => void
}

const UPCOMING = [
  { day: 'Tomorrow', time: 'Dawn', title: 'Psalm 23 practice' },
  { day: 'Wednesday', time: 'Midday', title: 'Gentle journal' },
  { day: 'Sunday', time: 'Morning', title: 'Sabbath stillness' },
]

export function CalendarPreview({ onOpenJournal }: CalendarPreviewProps) {
  return (
    <section className={styles.calendar}>
      <div className={styles.head}>
        <h3 className={styles.title}>Your Guidance Calendar</h3>
        <span className={styles.hint}>Preview</span>
      </div>
      <div className={styles.row}>
        {UPCOMING.map((item) => (
          <div className={styles.item} key={`${item.day}-${item.time}`}>
            <span className={styles.day}>{item.day}</span>
            <span className={styles.itemTitle}>{item.title}</span>
            <span className={styles.time}>{item.time}</span>
          </div>
        ))}
      </div>
      <button className={styles.link} type="button" onClick={onOpenJournal}>
        View past studies
        <ArrowRightIcon />
      </button>
    </section>
  )
}
