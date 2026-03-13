import { useState, useCallback } from 'react'

export function useRippleTheme(initialDark = true) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : initialDark
  })

  const triggerRipple = useCallback(() => {
    setIsDark(d => {
      const next = !d
      document.documentElement.classList.toggle('dark',  next)
      document.documentElement.classList.toggle('light', !next)
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }, [])

  return { isDark, triggerRipple }
}