import { useEffect, useState } from 'react'

const THEME_KEY = 'bloom.theme'

export function useTheme(): [boolean, () => void] {
  const [dark, setDark] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_KEY)
    return saved === null ? window.matchMedia('(prefers-color-scheme: dark)').matches : saved === 'dark'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark-theme', dark)
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')
    document
      .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
      ?.setAttribute('content', dark ? '#0E1712' : '#FAF8F5')
  }, [dark])

  return [dark, () => setDark((current) => !current)]
}
