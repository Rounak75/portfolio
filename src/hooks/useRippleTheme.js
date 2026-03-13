import { useState, useCallback } from 'react'

export function useRippleTheme(initialDark = true) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : initialDark
  })

  const triggerRipple = useCallback(() => {
    // 1. Flip the class on <html> immediately — CSS transitions start right away
    const next = !document.documentElement.classList.contains('dark')
    document.documentElement.classList.toggle('dark',  next)
    document.documentElement.classList.toggle('light', !next)
    localStorage.setItem('theme', next ? 'dark' : 'light')

    // 2. Schedule the React state update in the next frame so it doesn't
    //    compete with the CSS transition paint on the same frame
    requestAnimationFrame(() => {
      setIsDark(next)
    })
  }, [])

  return { isDark, triggerRipple }
}