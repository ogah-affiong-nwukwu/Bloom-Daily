import { useState } from 'react'
import type { Dispatch } from 'react'
import type { OnboardingAction, OnboardingDraft } from '../../types'
import { EyeIcon, EyeOffIcon } from '../icons'
import shared from './shared.module.css'
import styles from './StepIdentity.module.css'

interface StepIdentityProps {
  draft: OnboardingDraft
  dispatch: Dispatch<OnboardingAction>
}

export function StepIdentity({ draft, dispatch }: StepIdentityProps) {
  const [showPassword, setShowPassword] = useState(false)
  const setField = (key: 'name' | 'email' | 'password', value: string) => dispatch({ type: 'set', key, value })

  return (
    <div className={styles.step}>
      <div className={shared.fields}>
        <div className={shared.field}>
          <label htmlFor="ob-name">Preferred name or initial</label>
          <input
            id="ob-name"
            type="text"
            value={draft.name}
            onChange={(event) => setField('name', event.target.value)}
            placeholder="e.g. Affy"
            autoComplete="name"
            autoFocus
          />
        </div>
        <div className={shared.field}>
          <label htmlFor="ob-email">Email address</label>
          <input
            id="ob-email"
            type="email"
            value={draft.email}
            onChange={(event) => setField('email', event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <div className={shared.field}>
          <label htmlFor="ob-password">Create sanctuary password</label>
          <div className={shared.passwordWrap}>
            <input
              id="ob-password"
              type={showPassword ? 'text' : 'password'}
              value={draft.password}
              onChange={(event) => setField('password', event.target.value)}
              placeholder="At least 6 characters"
              autoComplete="new-password"
            />
            <button
              className={shared.passwordToggle}
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          <span className={shared.hint}>Secured with Supabase Auth</span>
        </div>
      </div>

      <div className={styles.preview}>
        <span className={styles.previewLabel}>Live preview</span>
        <p className={styles.previewText}>
          “Good morning, {draft.name.trim() || 'friend'}. Take a steady breath; this day is met with grace.”
        </p>
      </div>
    </div>
  )
}
