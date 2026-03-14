// ═══════════════════════════════════════════════════════
// src/App.jsx
//
// Features:
//  ✅ LoadingScreen     — animated splash on first load
//  ✅ ScrollProgressBar — gradient bar tracks scroll
//  ✅ CommandPalette    — Cmd+K spotlight search
//  ✅ Section transitions — each section enters from a
//     unique direction for visual variety
// ═══════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
// FIX 1: Added useScroll — was missing, causing ParallaxOrbs to crash
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { useLenis } from './hooks/useLenis.js'
import { useRippleTheme } from './hooks/useRippleTheme.js'

import Navbar    from './components/Navbar.jsx'
import Hero      from './components/Hero.jsx'
import About     from './components/About.jsx'
import Skills    from './components/Skills.jsx'
import Projects  from './components/Projects.jsx'
import Resume    from './components/Resume.jsx'
import Contact   from './components/Contact.jsx'
import Footer    from './components/Footer.jsx'

import LoadingScreen     from './components/LoadingScreen.jsx'
import ScrollProgressBar from './components/ScrollProgressBar.jsx'
import CommandPalette    from './components/CommandPalette.jsx'
import CustomCursor      from './components/CustomCursor.jsx'

// ── Parallax orbs at different Z depths ───────────────
function ParallaxOrbs() {
  const { scrollYProgress } = useScroll()
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%',  '-25%'])
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%',  '-45%'])
  const y3 = useTransform(scrollYProgress, [0, 1], ['0%',  '-15%'])
  const x2 = useTransform(scrollYProgress, [0, 1], ['0%',  '8%'])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <motion.div className="orb orb-1" style={{ y: y1 }} />
      <motion.div className="orb orb-2" style={{ y: y2, x: x2 }} />
      <motion.div className="orb orb-3" style={{ y: y3 }} />
    </div>
  )
}

// ── Section entrance directions ───────────────────────
// FIX 2: Removed duplicate isMobile/isMobileApp — kept one
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

const SECTION_VARIANTS = {
  hidden: (custom) => ({
    opacity: 0,
    x: isMobile ? 0 : (custom?.x ?? 0),
    y: custom?.y ?? 40,
    z: -40,
    scale: 0.97,
    ...(isMobile ? {} : { filter: 'blur(3px)' }),
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    z: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: isMobile ? 0.4 : 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

// Wrapper that applies the entrance animation to a section
function SectionReveal({ children, custom }) {
  return (
    <motion.div
      variants={SECTION_VARIANTS}
      custom={custom}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {

  // ── Theme ─────────────────────────────────────────
  const { isDark, triggerRipple } = useRippleTheme(true)

  // FIX 3: useLenis moved inside App() — hooks must be inside a component
  useLenis()

  // ── Loading screen ────────────────────────────────
  const [loading, setLoading] = useState(true)

  return (
    <div className={`min-h-screen transition-colors duration-500
        ${isDark ? 'bg-black text-slate-100' : 'bg-[#FDFAF5] text-stone-900'}`}
    >

      {/* Loading screen — AnimatePresence here triggers exit anim */}
      <AnimatePresence mode="wait">
        {loading && (
          <LoadingScreen key="loading" onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      {/* Scroll progress bar — after loading */}
      {!loading && <ScrollProgressBar />}

      {/* Command palette — always mounted, opens on Cmd+K */}
      <CommandPalette isDark={isDark} onToggleTheme={triggerRipple} />

      {/* Custom gold cursor — desktop only, auto-hides on touch devices */}
      <CustomCursor />

      {/* Background orbs — with parallax depth */}
      <ParallaxOrbs />

      {/* Noise texture */}
      <div className="noise-overlay" />

      {/* Main content */}
      <div className="relative z-10">
        <Navbar isDark={isDark} triggerRipple={triggerRipple} />

        <main>
          {/* Hero — no entrance delay, it's the first thing seen */}
          <Hero isDark={isDark} />

          {/* About — slides in from the left */}
          <SectionReveal custom={{ x: -50, y: 0 }}>
            <About isDark={isDark} />
          </SectionReveal>

          {/* Skills — slides in from the right */}
          <SectionReveal custom={{ x: 50, y: 0 }}>
            <Skills isDark={isDark} />
          </SectionReveal>

          {/* Projects — fades up from below */}
          <SectionReveal custom={{ x: 0, y: 50 }}>
            <Projects isDark={isDark} />
          </SectionReveal>

          {/* Resume — slides in from the left */}
          <SectionReveal custom={{ x: -50, y: 0 }}>
            <Resume isDark={isDark} />
          </SectionReveal>

          {/* Contact — fades up from below */}
          <SectionReveal custom={{ x: 0, y: 50 }}>
            <Contact isDark={isDark} />
          </SectionReveal>
        </main>

        <Footer isDark={isDark} />
      </div>
    </div>
  )
}