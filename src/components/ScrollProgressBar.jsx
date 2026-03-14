// src/components/ScrollProgressBar.jsx
// Uses Lenis scroll events when available, falls back to native scroll.

import { useEffect, useState } from 'react'
import { motion, useSpring }   from 'framer-motion'

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)

  const scaleX = useSpring(progress, {
    stiffness: 200,
    damping:   30,
    restDelta: 0.001,
  })

  useEffect(() => {
    const update = (scrollY) => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? scrollY / docHeight : 0)
    }

    // Use Lenis scroll event if available
    const lenis = window.__lenis
    if (lenis) {
      lenis.on('scroll', ({ scroll }) => update(scroll))
      return () => lenis.off('scroll')
    }

    // Fallback to native scroll
    const onScroll = () => update(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[200] h-[3px] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #d4a843, #a78bfa, #34d399)',
        boxShadow: '0 0 10px rgba(99,179,237,0.6)',
      }}
    />
  )
}