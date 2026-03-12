// ═══════════════════════════════════════════════════════
// src/components/Navbar.jsx
//
// STICKY NAV — now with animated active section pill.
//
// NEW: Active highlight
//   A gradient pill slides smoothly under whichever nav
//   link matches the currently visible section.
//   Uses Framer Motion layoutId="active-pill" so the pill
//   physically slides from link to link instead of jumping.
// ═══════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { personal } from '../data/personal.js'
import clsx from 'clsx'

const NAV_LINKS = [
  { label: 'Home',     href: '#hero',     id: 'hero'     },
  { label: 'About',    href: '#about',    id: 'about'    },
  { label: 'Skills',   href: '#skills',   id: 'skills'   },
  { label: 'Projects', href: '#projects', id: 'projects' },
  { label: 'Contact',  href: '#contact',  id: 'contact'  },
]

export default function Navbar({ isDark, toggleTheme }) {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [active,    setActive]    = useState('hero')

  // Glass effect on scroll
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  // Track active section via IntersectionObserver
  useEffect(() => {
    const ids = NAV_LINKS.map(l => l.id).concat(['resume'])
    const observer = new IntersectionObserver(
      entries => {
        // Find the entry with the greatest intersection ratio
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      // rootMargin shrinks the detection zone to the top 40% of viewport
      // so the active link switches earlier as you scroll
      { threshold: [0.1, 0.3, 0.5], rootMargin: '-10% 0px -50% 0px' }
    )
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? isDark
              ? 'bg-navy-900/80 backdrop-blur-xl border-b border-white/[0.06] py-3 shadow-xl'
              : 'bg-white/80 backdrop-blur-xl border-b border-black/[0.06] py-3 shadow-md'
            : 'py-5'
        )}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <a href="#hero" className="font-display font-extrabold text-lg tracking-tight gradient-text">
            {personal.nameShort}.
          </a>

          {/* ── Desktop links with sliding pill ─────────── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <a
                key={link.id}
                href={link.href}
                className={clsx(
                  'relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 z-10',
                  active === link.id
                    ? 'text-white'
                    : isDark
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-500 hover:text-slate-900'
                )}
              >
                {/* Animated pill slides behind active link.
                    layoutId makes Framer Motion morph it between links. */}
                {active === link.id && (
                  <motion.span
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-lg -z-10"
                    style={{
                      background: 'linear-gradient(135deg, rgba(99,179,237,0.25), rgba(167,139,250,0.25))',
                      border: '1px solid rgba(99,179,237,0.25)',
                      boxShadow: '0 0 12px rgba(99,179,237,0.15)',
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {link.label}
              </a>
            ))}

            {/* Resume CTA */}
            <a
              href="#resume"
              className="ml-2 px-5 py-2 rounded-full text-sm font-semibold text-white
                         bg-gradient-to-r from-cyan-400 to-violet-400
                         hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-400/20
                         transition-all duration-200"
            >
              Resume
            </a>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={clsx(
                'w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200',
                isDark
                  ? 'bg-white/[0.06] text-slate-400 hover:text-cyan-400 hover:bg-white/10'
                  : 'bg-black/[0.05] text-slate-500 hover:text-cyan-500 hover:bg-black/10'
              )}
            >
              <motion.div
                key={isDark ? 'moon' : 'sun'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </motion.div>
            </button>

            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
              className={clsx(
                'md:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                isDark
                  ? 'bg-white/[0.06] text-slate-300 hover:bg-white/10'
                  : 'bg-black/[0.05] text-slate-600 hover:bg-black/10'
              )}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={clsx(
              'fixed top-[68px] left-4 right-4 z-40 rounded-2xl p-4',
              'border flex flex-col gap-1',
              isDark
                ? 'mobile-menu-backdrop border-white/[0.08]'
                : 'bg-white/95 backdrop-blur-xl border-black/[0.08] shadow-xl'
            )}
          >
            {NAV_LINKS.map(link => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={clsx(
                  'px-4 py-3 rounded-xl text-sm font-medium transition-all',
                  active === link.id
                    ? 'text-cyan-400 bg-cyan-400/[0.08]'
                    : isDark
                      ? 'text-slate-300 hover:bg-white/[0.08] hover:text-white'
                      : 'text-slate-600 hover:bg-black/[0.05] hover:text-slate-900'
                )}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#resume"
              onClick={() => setMenuOpen(false)}
              className="mt-2 px-4 py-3 rounded-xl text-sm font-semibold text-white text-center
                         bg-gradient-to-r from-cyan-400 to-violet-400"
            >
              Resume ↗
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}