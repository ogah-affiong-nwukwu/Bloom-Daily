import { useTheme } from '../hooks/useTheme'
import type { Session } from '../lib/auth'
import { ArrowRightIcon, LeafIcon, LogoutIcon, MoonIcon, SunIcon } from './icons'
import styles from './Header.module.css'
import ui from './ui.module.css'

interface HeaderProps {
  user?: Session | null
  onSignOut?: () => void
  onBeginDay?: () => void
  onSignUp?: () => void
}

export function Header({ user, onSignOut, onBeginDay, onSignUp }: HeaderProps) {
  const [dark, toggleDark] = useTheme()
  const showActions = !user && Boolean(onBeginDay && onSignUp)

  return (
    <header className={styles.siteHeader}>
      <div className={`container ${styles.headerInner}`}>
        <a className={styles.brand} href="#" aria-label="Bloom Daily home">
          <LeafIcon className={ui.brandLeaf} />
          <span className={styles.brandName}>
            Bloom <em>Daily</em>
          </span>
        </a>
        <div className={styles.headerActions}>
          {user ? (
            <>
              <span className={styles.userChip}>
                <span className={styles.userAvatar} aria-hidden="true">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className={styles.userName}>{user.name.split(' ')[0]}</span>
              </span>
              <button className={ui.iconBtn} type="button" onClick={onSignOut} aria-label="Sign out" title="Sign out">
                <LogoutIcon />
              </button>
            </>
          ) : (
            showActions && (
              <>
                <button className={styles.headerLink} type="button" onClick={onSignUp}>
                  Sign up
                </button>
                <button className={`${ui.btnPrimary} ${styles.headerCta}`} type="button" onClick={onBeginDay}>
                  Begin your day
                  <ArrowRightIcon />
                </button>
              </>
            )
          )}
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
