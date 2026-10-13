import { getJSON, setJSON } from './storage'

export interface Account {
  name: string
  email: string
  password: string
}

export interface Session {
  name: string
  email: string
  remember: boolean
}

export type AuthResult = { ok: true; session: Session } | { ok: false; error: string }

const ACCOUNTS_KEY = 'bloom.accounts'
const SESSION_KEY = 'bloom.session'
const RESET_KEY = 'bloom.reset'

const normalizeEmail = (email: string) => email.trim().toLowerCase()

export function getSession(): Session | null {
  const local = getJSON<Session | null>(SESSION_KEY, null)
  if (local) return local
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

function persistSession(session: Session): void {
  if (session.remember) {
    setJSON(SESSION_KEY, session)
  } else {
    localStorage.removeItem(SESSION_KEY)
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
    } catch {
      void 0
    }
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    void 0
  }
}

export function updateSessionName(name: string): void {
  const session = getSession()
  if (!session) return
  persistSession({ ...session, name: name.trim() || session.name })
}

export function createAccount(name: string, email: string, password: string, remember: boolean): AuthResult {
  const normalized = normalizeEmail(email)
  const accounts = getJSON<Record<string, Account>>(ACCOUNTS_KEY, {})
  if (accounts[normalized]) {
    return { ok: false, error: 'An account with this email already exists. Try signing in instead.' }
  }
  const account: Account = { name: name.trim(), email: normalized, password }
  accounts[normalized] = account
  setJSON(ACCOUNTS_KEY, accounts)
  const session: Session = { name: account.name, email: normalized, remember }
  persistSession(session)
  return { ok: true, session }
}

export function signIn(email: string, password: string, remember: boolean): AuthResult {
  const normalized = normalizeEmail(email)
  const accounts = getJSON<Record<string, Account>>(ACCOUNTS_KEY, {})
  const account = accounts[normalized]
  if (!account) {
    return { ok: false, error: 'No account found with this email. Create one first.' }
  }
  if (account.password !== password) {
    return { ok: false, error: 'That password doesn’t match. Try again.' }
  }
  const session: Session = { name: account.name, email: normalized, remember }
  persistSession(session)
  return { ok: true, session }
}

export interface ResetTicket {
  email: string
  token: string
}

export type ResetRequestResult = { ok: true; ticket: ResetTicket } | { ok: false; error: string }
export type ResetResult = { ok: true; email: string } | { ok: false; error: string }

export function requestPasswordReset(email: string): ResetRequestResult {
  const normalized = normalizeEmail(email)
  const accounts = getJSON<Record<string, Account>>(ACCOUNTS_KEY, {})
  if (!accounts[normalized]) {
    return { ok: false, error: 'No account found with this email. Create one first.' }
  }
  const token = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
  const ticket: ResetTicket = { email: normalized, token }
  setJSON(RESET_KEY, ticket)
  return { ok: true, ticket }
}

export function applyPasswordReset(token: string, password: string): ResetResult {
  const ticket = getJSON<ResetTicket | null>(RESET_KEY, null)
  if (!ticket || ticket.token !== token) {
    return { ok: false, error: 'This reset link is no longer valid. Request a new one.' }
  }
  const accounts = getJSON<Record<string, Account>>(ACCOUNTS_KEY, {})
  const account = accounts[ticket.email]
  if (!account) {
    return { ok: false, error: 'No account found with this email.' }
  }
  account.password = password
  accounts[ticket.email] = account
  setJSON(ACCOUNTS_KEY, accounts)
  localStorage.removeItem(RESET_KEY)
  return { ok: true, email: ticket.email }
}
