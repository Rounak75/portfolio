// ═══════════════════════════════════════════════════════
// src/components/LoadingScreen.jsx
//
// Smooth animated splash screen.
//
// Improvements over previous version:
//  • Staggered entrance — each element fades in separately
//  • Breathing glow ring — pulses softly around the avatar
//  • Shimmer sweep — light glides across the initials box
//  • Framer Motion progress bar — spring-eased, not CSS width
//  • Silky exit — whole screen dissolves + scales down slightly
//    instead of a hard upward slide
//  • Dots animation — three dots pulse in sequence below bar
// ═══════════════════════════════════════════════════════

import { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { personal } from '../data/personal.js'

// ✏️ Total visible time before exit begins (ms)
const DURATION = 2600

// ── Stagger container — children animate in sequence ──
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.13, delayChildren: 0.1 },
  },
}

// ── Each child fades up softly ─────────────────────────
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

export default function LoadingScreen({ onComplete }) {
  const [started,  setStarted]  = useState(false)
  const [progress, setProgress] = useState(0)
  const barControls = useAnimation()

  useEffect(() => {
    // Tiny delay so fonts load before content appears
    const t1 = setTimeout(() => setStarted(true), 80)

    // Animate Framer Motion bar 0 → 100 over DURATION
    const t2 = setTimeout(() => {
      barControls.start({
        scaleX: 1,
        transition: { duration: (DURATION - 400) / 1000, ease: [0.4, 0, 0.2, 1] },
      })
      setProgress(100)
    }, 200)

    // Trigger exit (AnimatePresence in App.jsx plays exit anim)
    const t3 = setTimeout(onComplete, DURATION)

    return () => [t1, t2, t3].forEach(clearTimeout)
  }, [onComplete, barControls])

  return (
    <motion.div
      key="loading-screen"
      initial={{ opacity: 1 }}
      // Exit: gentle scale-down fade — feels like the site "opens up"
      exit={{
        opacity: 0,
        scale: 1.04,
        filter: 'blur(6px)',
        transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
      }}
      className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden"
      style={{ background: '#080b14' }}
    >
      {/* ── Background orbs ───────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb orb-1" style={{ opacity: 0.1 }} />
        <div className="orb orb-2" style={{ opacity: 0.07 }} />
        <div className="orb orb-3" style={{ opacity: 0.05 }} />
      </div>

      {/* ── Breathing outer glow ring ─────────────────── */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 220, height: 220,
          background: 'radial-gradient(circle, rgba(99,179,237,0.08) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.8, ease: 'easeInOut', repeat: Infinity }}
      />

      {/* ── Staggered content ─────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={started ? 'show' : 'hidden'}
        className="relative z-10 flex flex-col items-center"
      >

        {/* Initials box */}
        <motion.div variants={itemVariants} className="relative mb-7">
          {/* The box itself */}
          <div
            style={{
              width: 96, height: 96,
              borderRadius: 24,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(99,179,237,0.12), rgba(167,139,250,0.12))',
              border: '1px solid rgba(99,179,237,0.28)',
              boxShadow: '0 0 40px rgba(99,179,237,0.18), 0 0 80px rgba(167,139,250,0.1)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            {/* Shimmer sweep across the box */}
            <motion.div
              style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)',
                transform: 'translateX(-100%)',
              }}
              animate={{ transform: ['translateX(-100%)', 'translateX(200%)'] }}
              transition={{ duration: 1.4, delay: 0.6, ease: 'easeInOut', repeat: Infinity, repeatDelay: 2 }}
            />

            {/* Initials text */}
            <span style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2.2rem',
              background: 'linear-gradient(135deg, #63b3ed, #a78bfa)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              position: 'relative', zIndex: 1,
            }}>
              {personal.initials}
            </span>
          </div>

          {/* Subtle outer border pulse */}
          <motion.div
            style={{
              position: 'absolute', inset: -4, borderRadius: 28,
              border: '1px solid rgba(99,179,237,0.2)', pointerEvents: 'none',
            }}
            animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.98, 1.02, 0.98] }}
            transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
          />
        </motion.div>

        {/* Name */}
        <motion.p
          variants={itemVariants}
          style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 700,
            fontSize: '1.2rem', color: '#fff',
            marginBottom: 4, letterSpacing: '-0.02em',
          }}
        >
          {personal.name}
        </motion.p>

        {/* Role */}
        <motion.p
          variants={itemVariants}
          style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#63b3ed', marginBottom: 36,
          }}
        >
          AI Developer · Portfolio
        </motion.p>

        {/* Progress bar */}
        <motion.div variants={itemVariants} style={{ width: 200 }}>
          {/* Track */}
          <div style={{ height: 2, borderRadius: 9999, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            {/* Fill — scaleX from 0→1, origin left */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={barControls}
              style={{
                height: '100%', borderRadius: 9999,
                background: 'linear-gradient(90deg, #63b3ed, #a78bfa, #34d399)',
                boxShadow: '0 0 12px rgba(99,179,237,0.6)',
                transformOrigin: 'left center',
              }}
            />
          </div>
        </motion.div>

        {/* Animated dots */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-1.5 mt-4"
        >
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              style={{
                width: 4, height: 4, borderRadius: '50%',
                background: 'rgba(99,179,237,0.5)',
                display: 'block',
              }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{
                duration: 1.2,
                delay: i * 0.2,
                ease: 'easeInOut',
                repeat: Infinity,
              }}
            />
          ))}
        </motion.div>

      </motion.div>
    </motion.div>
  )
}