export const TOAST_EVENT = 'bloom-toast'

export function toast(message: string): void {
  window.dispatchEvent(new CustomEvent<string>(TOAST_EVENT, { detail: message }))
}
