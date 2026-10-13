import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { CloseIcon } from './icons'
import styles from './Modal.module.css'
import ui from './ui.module.css'

interface ModalProps {
  open: boolean
  onClose: () => void
  labelledBy?: string
  children: ReactNode
}

export function Modal({ open, onClose, labelledBy, children }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
        <button
          className={`${ui.iconBtn} ${styles.close}`}
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <CloseIcon />
        </button>
        {children}
      </div>
    </div>
  )
}
