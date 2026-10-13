import { useState } from 'react'
import type { FormEvent } from 'react'
import { applyPasswordReset, requestPasswordReset, signIn } from '../lib/auth'
import type { ResetTicket, Session } from '../lib/auth'
import { toast } from '../lib/toast'
import type { AuthMode } from '../types'
import { EyeIcon, EyeOffIcon, LeafIcon } from './icons'
import { Modal } from './Modal'
import styles from './AuthModal.module.css'
import ui from './ui.module.css'

interface AuthModalProps {
  open: boolean
  initialMode: AuthMode
  onClose: () => void
  onSignedIn: (session: Session) => void
  onCreateAccount?: () => void
}

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/

const COPY: Record<AuthMode, { title: string; sub: string; submit: string }> = {
  signin: {
    title: 'Welcome back',
    sub: 'Sign in to return to your quiet daily ritual.',
    submit: 'Sign in',
  },
  forgot: {
    title: 'Reset your password',
    sub: 'Enter your email and we’ll send a link to choose a new password.',
    submit: 'Send reset link',
  },
  reset: {
    title: 'Choose a new password',
    sub: 'Your reset link is verified — pick something gentle but secure.',
    submit: 'Update password',
  },
}

export function AuthModal({ open, initialMode, onClose, onSignedIn, onCreateAccount }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [ticket, setTicket] = useState<ResetTicket | null>(null)

  const goTo = (next: AuthMode) => {
    setError('')
    setPassword('')
    setConfirm('')
    setShowPassword(false)
    setMode(next)
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (mode === 'signin') {
      if (!EMAIL_PATTERN.test(email)) {
        setError('Please enter a valid email address.')
        return
      }
      if (password.length < 6) {
        setError('Choose a password of at least 6 characters.')
        return
      }
      const result = signIn(email, password, remember)
      if (!result.ok) {
        setError(result.error)
        return
      }
      toast('Welcome back')
      onSignedIn(result.session)
      return
    }

    if (mode === 'forgot') {
      if (!EMAIL_PATTERN.test(email)) {
        setError('Please enter a valid email address.')
        return
      }
      const result = requestPasswordReset(email)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setTicket(result.ticket)
      toast('Password reset link sent')
      return
    }

    if (!ticket) {
      setError('This reset link is no longer valid. Request a new one.')
      return
    }
    if (password.length < 6) {
      setError('Choose a password of at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Those passwords don’t match.')
      return
    }
    const result = applyPasswordReset(ticket.token, password)
    if (!result.ok) {
      setError(result.error)
      return
    }
    toast('Password updated — please sign in')
    setTicket(null)
    goTo('signin')
  }

  const copy = COPY[mode]
  const showSentPanel = mode === 'forgot' && ticket !== null
  const title = showSentPanel ? 'Check your inbox' : copy.title
  const sub = showSentPanel ? `We’ve sent a password reset link to ${ticket?.email}.` : copy.sub

  return (
    <Modal open={open} onClose={onClose} labelledBy="auth-modal-title">
      <div className={styles.brand}>
        <LeafIcon className={ui.brandLeaf} />
        <span>Bloom Daily</span>
      </div>
      <h2 id="auth-modal-title" className={styles.title}>
        {title}
      </h2>
      <p className={styles.sub}>{sub}</p>

      {showSentPanel ? (
        <div className={styles.sent}>
          <p className={styles.sentNote}>
            For this demo no real email is sent — use the simulated link below to choose a new password.
          </p>
          <button className={`${ui.btnPrimary} ${styles.submit}`} type="button" onClick={() => goTo('reset')}>
            Open reset link
          </button>
          <button className={styles.backLink} type="button" onClick={() => goTo('signin')}>
            Back to sign in
          </button>
        </div>
      ) : (
        <form className={styles.form} onSubmit={submit} noValidate>
          {(mode === 'signin' || mode === 'forgot') && (
            <div className={styles.field}>
              <label htmlFor="auth-email">Email address</label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                autoFocus
              />
            </div>
          )}

          {(mode === 'signin' || mode === 'reset') && (
            <div className={styles.field}>
              <label htmlFor="auth-password">{mode === 'reset' ? 'New password' : 'Password'}</label>
              <div className={styles.passwordWrap}>
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  autoFocus={mode === 'reset'}
                />
                <button
                  className={styles.passwordToggle}
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
          )}

          {mode === 'reset' && (
            <div className={styles.field}>
              <label htmlFor="auth-confirm">Confirm new password</label>
              <input
                id="auth-confirm"
                type={showPassword ? 'text' : 'password'}
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                placeholder="Repeat your new password"
                autoComplete="new-password"
              />
            </div>
          )}

          {mode === 'signin' && (
            <div className={styles.forgotRow}>
              <button className={styles.forgot} type="button" onClick={() => goTo('forgot')}>
                Forgot password?
              </button>
            </div>
          )}

          {mode === 'signin' && (
            <label className={styles.rememberRow}>
              <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
              <span>Remember me</span>
              <span className={styles.rememberHint}>Keep me signed in on this device</span>
            </label>
          )}

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <button className={`${ui.btnPrimary} ${styles.submit}`} type="submit">
            {copy.submit}
          </button>
        </form>
      )}

      {mode === 'signin' && !showSentPanel && (
        <p className={styles.switch}>
          New to Bloom Daily?{' '}
          <button type="button" onClick={onCreateAccount}>
            Create an account
          </button>
        </p>
      )}
    </Modal>
  )
}
