import { useEffect, useState } from 'react'
import { TOAST_EVENT } from '../lib/toast'
import styles from './ToastHost.module.css'

export function ToastHost() {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let timer = 0
    const onToast = (event: Event) => {
      setMessage((event as CustomEvent<string>).detail)
      setVisible(true)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setVisible(false), 2200)
    }
    window.addEventListener(TOAST_EVENT, onToast)
    return () => {
      window.removeEventListener(TOAST_EVENT, onToast)
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <div className={visible ? `${styles.toast} ${styles.show}` : styles.toast} role="status">
      {message}
    </div>
  )
}
