import { getJSON, setJSON } from './storage'

const REFLECTIONS_KEY = 'bloom.reflections'
const LEGACY_KEY = 'bloom.entries'

export interface Insight {
  paragraph: string
  verse: string
  verseRef: string
  affirmation: string
  grounding: string
}

export interface Reflection {
  id: string
  text: string
  tags: string[]
  createdAt: string
  prompt?: string
  insight?: Insight | null
}

function migrateLegacy(): Reflection[] {
  const legacy = getJSON<Record<string, unknown>>(LEGACY_KEY, {})
  const list = Object.entries(legacy)
    .map(([date, value]) => {
      const raw =
        typeof value === 'string'
          ? ({ text: value, tags: [] } as Partial<Reflection>)
          : (value as Partial<Reflection>)
      return {
        id: `legacy-${date}`,
        text: raw.text ?? '',
        tags: raw.tags ?? [],
        createdAt: raw.createdAt ?? `${date}T12:00:00`,
        prompt: raw.prompt,
        insight: raw.insight ?? null,
      }
    })
    .filter((entry) => entry.text.trim())
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function loadReflections(): Reflection[] {
  const stored = getJSON<Reflection[] | null>(REFLECTIONS_KEY, null)
  if (stored) return stored
  const migrated = migrateLegacy()
  if (migrated.length > 0) {
    setJSON(REFLECTIONS_KEY, migrated)
    localStorage.removeItem(LEGACY_KEY)
  }
  return migrated
}

export function saveReflections(list: Reflection[]): void {
  setJSON(REFLECTIONS_KEY, list)
}

export function clearReflections(): void {
  localStorage.removeItem(REFLECTIONS_KEY)
}

interface InsightTemplate {
  test: RegExp
  verse: string
  verseRef: string
  affirmation: string
  grounding: string
  paragraph: (open: string) => string
}

const INSIGHT_TEMPLATES: InsightTemplate[] = [
  {
    test: /(tired|exhaust|weary|rest|sleep)/,
    verse: '“Come to me, all you who are weary and burdened, and I will give you rest.”',
    verseRef: 'Matthew 11:28',
    affirmation: 'Rest is not a reward you must earn — it is the ground everything grows from.',
    grounding: 'Grounding: Matthew 11:28–30',
    paragraph: (open) =>
      `${open}You do not need to perform your way through today. Weariness is not a failure; it is a quiet signal that you have been faithful for a long while. Let this reflection be enough for now — the rest of the day is allowed to be smaller than you planned.`,
  },
  {
    test: /(hope|hopeful|future|dream)/,
    verse: '“For I know the plans I have for you… plans to give you hope and a future.”',
    verseRef: 'Jeremiah 29:11',
    affirmation: 'What is forming in you is worth waiting for.',
    grounding: 'Grounding: Jeremiah 29:11–13',
    paragraph: (open) =>
      `${open}Hope is not pretending everything is fine — it is choosing to notice what is still alive. You are allowed to tend the small green things, even while other ground lies fallow.`,
  },
  {
    test: /(anxious|worry|fear|overwhelmed|stress)/,
    verse: '“Cast all your anxiety on him because he cares for you.”',
    verseRef: '1 Peter 5:7',
    affirmation: 'You are held more carefully than you know.',
    grounding: 'Grounding: Philippians 4:6–7',
    paragraph: (open) =>
      `${open}Anxiety makes everything feel urgent, but few things truly are. You do not have to solve the whole week tonight. One faithful, quiet step is enough — and you are allowed to hand the rest over.`,
  },
  {
    test: /(grateful|thankful|thanks|gratitude)/,
    verse: '“Give thanks in all circumstances; for this is God’s will for you.”',
    verseRef: '1 Thessalonians 5:18',
    affirmation: 'What you notice, you nourish.',
    grounding: 'Grounding: Psalm 107:1',
    paragraph: (open) =>
      `${open}Gratitude like this does not ignore what is hard — it simply refuses to let the hard things have the only say. Naming small mercies is a quiet act of resistance, and you are doing it.`,
  },
]

const DEFAULT_TEMPLATE: Omit<InsightTemplate, 'test'> = {
  verse: '“The Lord will fight for you; you need only to be still.”',
  verseRef: 'Exodus 14:14',
  affirmation: 'You are allowed to be a work in progress — quietly, faithfully, beautifully.',
  grounding: 'Grounding: Jeremiah 17:7–8',
  paragraph: (open) =>
    `${open}Mixed feelings are not a contradiction — they are a whole heart speaking. You do not need to sort every thought before it is welcome here. Stay honest, stay soft, and let the next small step reveal itself in its own time.`,
}

export function generateInsight(reflection: Reflection): Insight {
  const t = `${reflection.text} ${reflection.tags.join(' ')}`.toLowerCase()
  const snippet = reflection.text.trim().split(/\s+/).slice(0, 10).join(' ')
  const open = snippet ? `Your words — “${snippet}” — are honest, and honesty is holy ground. ` : ''
  const match = INSIGHT_TEMPLATES.find((template) => template.test.test(t))
  const template = match ?? DEFAULT_TEMPLATE
  return {
    paragraph: template.paragraph(open),
    verse: template.verse,
    verseRef: template.verseRef,
    affirmation: template.affirmation,
    grounding: template.grounding,
  }
}
