// ═══════════════════════════════════════════════════════
// src/components/CustomCursor.jsx
//
// Premium gold cursor — desktop only.
// Features:
//  • Small gold dot that follows cursor exactly
//  • Larger ring that trails with spring physics
//  • Ring expands + gold fill on hoverable elements
//  • Burst animation on click
//  • Hides on mobile (pointer: coarse devices)
// ═══════════════════════════════════════════════════════

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'

// Only show on devices with a fine pointer (mouse), not touch
const hasFineCursor =
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine)').matches

const SPRING_DOT  = { stiffness: 800, damping: 35, mass: 0.3 }
const SPRING_RING = { stiffness: 180, damping: 22, mass: 0.8 }

export default function CustomCursor() {
  // Never render on touch devices
  if (!hasFineCursor) return null

  return <CursorInner />
}

function CursorInner() {
  const [visible,  setVisible]  = useState(false)
  const [hovering, setHovering] = useState(false)  // over a clickable
  const [clicking, setClicking] = useState(false)  // mouse down
  const [bursts,   setBursts]   = useState([])     // click burst particles

  // Raw mouse position — dot snaps here instantly
  const rawX = useMotionValue(-100)
  const rawY = useMotionValue(-100)

  // Spring-smoothed position — ring lags behind
  const ringX = useSpring(rawX, SPRING_RING)
  const ringY = useSpring(rawY, SPRING_RING)

  // Dot follows exactly (faster spring)
  const dotX = useSpring(rawX, SPRING_DOT)
  const dotY = useSpring(rawY, SPRING_DOT)

  const burstId = useRef(0)

  const onMouseMove = useCallback(e => {
    rawX.set(e.clientX)
    rawY.set(e.clientY)
    if (!visible) setVisible(true)

    // Check if hovering over an interactive element
    const el = document.elementFromPoint(e.clientX, e.clientY)
    const isHoverable = el?.closest(
      'a, button, [role="button"], input, textarea, select, label, [tabindex]'
    )
    setHovering(!!isHoverable)
  }, [rawX, rawY, visible])

  const onMouseLeave = useCallback(() => setVisible(false), [])

  const onMouseDown = useCallback(e => {
    setClicking(true)
    // Spawn 6 burst particles at click position
    const id = ++burstId.current
    const particles = Array.from({ length: 6 }, (_, i) => ({
      id: `${id}-${i}`,
      x: e.clientX,
      y: e.clientY,
      angle: (i / 6) * 360,
    }))
    setBursts(prev => [...prev, ...particles])
    // Clean up after animation
    setTimeout(() => {
      setBursts(prev => prev.filter(p => !p.id.startsWith(`${id}-`)))
    }, 600)
  }, [])

  const onMouseUp = useCallback(() => setClicking(false), [])

  useEffect(() => {
    window.addEventListener('mousemove',  onMouseMove,  { passive: true })
    window.addEventListener('mouseleave', onMouseLeave, { passive: true })
    window.addEventListener('mousedown',  onMouseDown,  { passive: true })
    window.addEventListener('mouseup',    onMouseUp,    { passive: true })
    return () => {
      window.removeEventListener('mousemove',  onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('mousedown',  onMouseDown)
      window.removeEventListener('mouseup',    onMouseUp)
    }
  }, [onMouseMove, onMouseLeave, onMouseDown, onMouseUp])

  return (
    <>
      {/* ── Trailing ring ──────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        animate={{
          opacity: visible ? 1 : 0,
          width:   hovering ? 40 : 28,
          height:  hovering ? 40 : 28,
          backgroundColor: hovering
            ? 'rgba(212,168,67,0.15)'
            : 'rgba(212,168,67,0)',
          borderColor: hovering
            ? 'rgba(212,168,67,0.9)'
            : 'rgba(212,168,67,0.55)',
          scale: clicking ? 0.85 : 1,
        }}
        transition={{
          opacity:         { duration: 0.2 },
          width:           { type: 'spring', stiffness: 300, damping: 24 },
          height:          { type: 'spring', stiffness: 300, damping: 24 },
          backgroundColor: { duration: 0.2 },
          borderColor:     { duration: 0.15 },
          scale:           { type: 'spring', stiffness: 600, damping: 20 },
        }}
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          borderRadius: '50%',
          border: '1.5px solid rgba(212,168,67,0.55)',
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />

      {/* ── Gold dot ───────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #f0c060, #d4a843)',
          boxShadow: '0 0 8px rgba(212,168,67,0.8)',
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 10000,
        }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: clicking ? 0.5 : hovering ? 1.4 : 1,
        }}
        transition={{
          opacity: { duration: 0.2 },
          scale:   { type: 'spring', stiffness: 600, damping: 20 },
        }}
      />

      {/* ── Click burst particles ───────────────────── */}
      <AnimatePresence>
        {bursts.map(p => (
          <motion.div
            key={p.id}
            className="fixed pointer-events-none z-[9998]"
            style={{
              left: p.x,
              top:  p.y,
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: '#d4a843',
              translateX: '-50%',
              translateY: '-50%',
            }}
            initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            animate={{
              opacity: 0,
              scale: 0,
              x: Math.cos((p.angle * Math.PI) / 180) * 28,
              y: Math.sin((p.angle * Math.PI) / 180) * 28,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </>
  )
}