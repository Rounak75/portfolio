// ═══════════════════════════════════════════════════════
// src/components/ScrollProgressBar.jsx
//
// A thin gradient bar fixed at the very top of the page.
// Fills left → right as the user scrolls down the page.
//
// ✏️ CUSTOMISE:
//   height  — change h-[3px] to h-[2px] or h-[4px]
//   colors  — change the from-cyan-400 to-violet-400 gradient
// ═══════════════════════════════════════════════════════

import { useEffect, useState } from 'react'
import { motion, useSpring }   from 'framer-motion'

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)

  // useSpring makes the bar animate smoothly instead of jumping
  // stiffness / damping control the springiness feel
  const scaleX = useSpring(progress, {
    stiffness: 200,
    damping:   30,
    restDelta: 0.001,
  })

  useEffect(() => {
    const onScroll = () => {
      const scrollTop    = window.scrollY
      const docHeight    = document.documentElement.scrollHeight - window.innerHeight
      // progress is 0 → 1 as user scrolls top → bottom
      const pct          = docHeight > 0 ? scrollTop / docHeight : 0
      setProgress(pct)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    // Fixed to very top of viewport, above everything (z-[200])
    <motion.div
      className="fixed top-0 left-0 right-0 z-[200] h-[3px] origin-left"
      style={{
        scaleX,
        // ✏️ Change gradient colors here
        background: 'linear-gradient(90deg, #63b3ed, #a78bfa, #34d399)',
        // Subtle glow under the bar
        boxShadow: '0 0 10px rgba(99,179,237,0.6)',
      }}
    />
  )
}