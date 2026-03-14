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

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
// ADD this line after the existing imports
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

// ── Section entrance directions ───────────────────────
// Each section slides in from a different direction,
// giving the page a sense of physical depth as you scroll.
//
// ✏️ Customise: change x/y values or set both to 0 for a
//    pure fade with no movement.

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

const SECTION_VARIANTS = {
  hidden: (custom) => ({
    opacity: 0,
    x: isMobile ? 0 : (custom?.x ?? 0),
    y: custom?.y ?? 40,
    ...(isMobile ? {} : { filter: 'blur(4px)' }),
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: isMobile ? 0.4 : 0.65, ease: [0.22, 1, 0.36, 1] },
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
      // once: true — plays once, doesn't reverse when scrolling back up
      viewport={{ once: true, amount: 0.08 }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {

  // ── Theme ─────────────────────────────────────────
  const { isDark, triggerRipple } = useRippleTheme(true)

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
      
      {/* Background orbs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

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