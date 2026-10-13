import { useState } from 'react'
import { useTheme } from '../hooks/useTheme'
import type { Session } from '../lib/auth'
import type { TabId } from '../types'
import {
  ChevronDownIcon,
  EditNoteIcon,
  FlameIcon,
  LeafIcon,
  LogoutIcon,
  MoonIcon,
  SproutIcon,
  SunIcon,
  UserIcon,
} from './icons'
import styles from './AppNav.module.css'
import ui from './ui.module.css'

interface AppNavProps {
  user: Session | null
  active: TabId
  onChange: (tab: TabId) => void
  onSignOut: () => void
}

const TABS: { id: TabId; label: string; Icon: typeof LeafIcon }[] = [
  { id: 'home', label: 'Home', Icon: LeafIcon },
  { id: 'growth', label: 'Growth', Icon: FlameIcon },
  { id: 'journal', label: 'Journal', Icon: EditNoteIcon },
  { id: 'garden', label: 'Garden', Icon: SproutIcon },
  { id: 'profile', label: 'Profile', Icon: UserIcon },
]

export function AppNav({ user, active, onChange, onSignOut }: AppNavProps) {
  const [dark, toggleDark] = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        <a className={styles.brand} href="#" aria-label="Bloom Daily home">
          <LeafIcon className={ui.brandLeaf} />
          <span className={styles.brandName}>
            Bloom <em>Daily</em>
          </span>
        </a>

        <nav className={styles.capsule} role="tablist" aria-label="Sections">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={id === active ? `${styles.tab} ${styles.isActive}` : styles.tab}
              type="button"
              role="tab"
              aria-selected={id === active}
              onClick={() => onChange(id)}
            >
              <Icon />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.actions}>
          <div className={styles.profileGroup}>
            <button
              className={styles.avatar}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Account menu"
              aria-expanded={menuOpen}
            >
              {user?.name.charAt(0).toUpperCase() ?? 'B'}
            </button>
            <button
              className={styles.profilePill}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Profile menu"
              aria-expanded={menuOpen}
            >
              <span className={styles.statusDot} aria-hidden="true" />
              <span className={styles.profileName}>{user?.name.split(' ')[0] ?? 'Bloom'}</span>
              <span className={styles.profileLabel}>Profile</span>
              <ChevronDownIcon />
            </button>
            {menuOpen && (
              <div className={styles.menu} role="menu">
                <p className={styles.menuName}>{user?.name}</p>
                <p className={styles.menuEmail}>{user?.email}</p>
                <button className={styles.menuBtn} type="button" onClick={onSignOut}>
                  <LogoutIcon />
                  Sign out
                </button>
              </div>
            )}
          </div>
          <button
            className={`${ui.iconBtn} ${styles.themeToggle}`}
            type="button"
            onClick={toggleDark}
            aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
            title="Toggle theme"
          >
            <MoonIcon className={styles.iconMoon} />
            <SunIcon className={styles.iconSun} />
          </button>
        </div>
      </div>
    </header>
  )
}
