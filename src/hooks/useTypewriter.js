// ═══════════════════════════════════════════════════════
// src/hooks/useTypewriter.js
//
// A reusable hook that types out strings one character
// at a time, then deletes them, then moves to the next.
//
// Usage:
//   const text = useTypewriter(['AI Developer', 'Python Dev'])
//
// ✏️ CUSTOMISE via the options parameter:
//   typeSpeed   — ms per character typed    (default 80)
//   deleteSpeed — ms per character deleted  (default 45)
//   pauseTime   — ms to pause after typing  (default 1800)
// ═══════════════════════════════════════════════════════

import { useState, useEffect, useRef } from 'react'

export function useTypewriter(
  words = [],
  {
    typeSpeed   = 80,
    deleteSpeed = 45,
    pauseTime   = 1800,
  } = {}
) {
  const [displayed, setDisplayed] = useState('')   // text currently shown
  const [wordIndex, setWordIndex] = useState(0)     // which word we're on
  const [isDeleting, setIsDeleting] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (!words.length) return

    const currentWord = words[wordIndex % words.length]

    const tick = () => {
      if (!isDeleting) {
        // ── TYPING phase ────────────────────────────────
        const next = currentWord.slice(0, displayed.length + 1)
        setDisplayed(next)

        if (next === currentWord) {
          // Finished typing → pause, then start deleting
          timeoutRef.current = setTimeout(() => setIsDeleting(true), pauseTime)
        } else {
          timeoutRef.current = setTimeout(tick, typeSpeed)
        }
      } else {
        // ── DELETING phase ───────────────────────────────
        const next = displayed.slice(0, -1)
        setDisplayed(next)

        if (next === '') {
          // Finished deleting → move to next word
          setIsDeleting(false)
          setWordIndex(i => i + 1)
        } else {
          timeoutRef.current = setTimeout(tick, deleteSpeed)
        }
      }
    }

    timeoutRef.current = setTimeout(tick, isDeleting ? deleteSpeed : typeSpeed)

    // Cleanup on re-render
    return () => clearTimeout(timeoutRef.current)
  }, [displayed, isDeleting, wordIndex, words, typeSpeed, deleteSpeed, pauseTime])

  return displayed
}