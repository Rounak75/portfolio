import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Menu, X, Home, User, Zap, Code2, FileText, Phone } from 'lucide-react'
import { personal } from '../data/personal.js'
import clsx from 'clsx'

const NAV_LINKS = [
  { label: 'Home',     href: '#hero',     id: 'hero',     icon: Home     },
  { label: 'About',    href: '#about',    id: 'about',    icon: User     },
  { label: 'Skills',   href: '#skills',   id: 'skills',   icon: Zap      },
  { label: 'Projects', href: '#projects', id: 'projects', icon: Code2    },
  { label: 'Resume',   href: '#resume',   id: 'resume',   icon: FileText },
  { label: 'Contact',  href: '#contact',  id: 'contact',  icon: Phone    },
]

export default function Navbar({ isDark, triggerRipple }) {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [active,    setActive]    = useState('hero')

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  useEffect(() => {
    const ids = NAV_LINKS.map(l => l.id)
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { threshold: [0.1, 0.3, 0.5], rootMargin: '-10% 0px -50% 0px' }
    )
    ids.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      {/* ── Top navbar ───────────────────────────────── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? isDark
              ? 'bg-black/80 backdrop-blur-xl border-b border-white/[0.06] py-3 shadow-xl'
              : 'bg-[#FDFAF5]/90 backdrop-blur-xl border-b border-amber-200/60 py-3 shadow-sm shadow-amber-100/50'
            : 'py-5'
        )}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <a href="#hero" className={clsx(
            'font-display font-extrabold text-lg tracking-tight gradient-text px-2 py-0.5 rounded-lg transition-colors duration-300',
            isDark ? 'bg-transparent' : 'bg-stone-900'
        )}>
  {personal.nameShort}.
</a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <a key={link.id} href={link.href}
                className={clsx(
                  'relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 z-10',
                  active === link.id
                    ? 'text-white'
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900'
                )}
              >
                {active === link.id && (
                  <motion.span
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-lg -z-10"
                    style={{
                      background: 'linear-gradient(135deg, rgba(212,168,67,0.25), rgba(240,192,96,0.25))',
                      border: '1px solid rgba(212,168,67,0.25)',
                      boxShadow: '0 0 12px rgba(212,168,67,0.2)',
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={triggerRipple}
              aria-label="Toggle theme"
              className={clsx(
                'w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200',
                isDark
                  ? 'bg-white/[0.06] text-slate-400 hover:text-yellow-500 hover:bg-white/10'
                  : 'bg-black/[0.05] text-slate-500 hover:text-yellow-500 hover:bg-black/10'
              )}
            >
              <motion.div
                key={isDark ? 'sun' : 'moon'}
                initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0,   opacity: 1, scale: 1   }}
                transition={{ duration: 0.25 }}
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </motion.div>
            </button>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
              className={clsx(
                'md:hidden relative w-10 h-10 rounded-xl flex items-center justify-center transition-all z-[60]',
                isDark ? 'bg-white/[0.06] text-slate-300 hover:bg-white/10' : 'bg-black/[0.05] text-slate-600 hover:bg-black/10'
              )}
            >
              <AnimatePresence mode="wait">
                {menuOpen
                  ? <motion.div key="x"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}><X    size={18} /></motion.div>
                  : <motion.div key="menu" initial={{ rotate:  90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate:-90, opacity: 0 }} transition={{ duration: 0.18 }}><Menu size={18} /></motion.div>
                }
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile drawer backdrop ────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeMenu}
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile slide-in drawer ────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 32, mass: 0.9 }}
            className={clsx(
              'fixed top-0 right-0 bottom-0 z-50 w-72 md:hidden flex flex-col',
              isDark
                ? 'bg-black border-l border-white/[0.08]'
                : 'bg-[#FDFAF5] border-l border-amber-200/60 shadow-2xl shadow-amber-100/30'
            )}
          >
            {/* Drawer header */}
            <div className={clsx(
              'flex items-center justify-between px-6 py-5 border-b',
              isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'
            )}>
              <span className={clsx(
                'font-display font-extrabold text-lg gradient-text px-2 py-0.5 rounded-lg transition-colors duration-300',
                !isDark && 'bg-stone-900'
              )}>
              {personal.nameShort}.
              </span>
              <button
                onClick={closeMenu}
                className={clsx(
                  'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                  isDark ? 'bg-white/[0.06] text-slate-400 hover:bg-white/10' : 'bg-black/[0.05] text-slate-500 hover:bg-black/10'
                )}
              >
                <X size={16} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
              {NAV_LINKS.map((link, i) => {
                const Icon = link.icon
                const isActive = active === link.id
                return (
                  <motion.a
                    key={link.id}
                    href={link.href}
                    onClick={closeMenu}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={clsx(
                      'flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'text-yellow-500 bg-yellow-500/[0.1] border border-yellow-500/20'
                        : isDark
                          ? 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                          : 'text-slate-600 hover:bg-black/[0.04] hover:text-slate-900'
                    )}
                  >
                    <Icon size={16} className={isActive ? 'text-yellow-500' : isDark ? 'text-slate-500' : 'text-slate-400'} />
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="drawer-active-dot"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400"
                      />
                    )}
                  </motion.a>
                )
              })}
            </nav>

            {/* Drawer footer */}
            <div className={clsx('px-4 pb-8 pt-4 border-t', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]')}>
              <p className={clsx('text-xs font-mono mb-3 px-2', isDark ? 'text-slate-600' : 'text-slate-400')}>
                {personal.email}
              </p>
              <a
                href={personal.socials.email}
                onClick={closeMenu}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                           text-sm font-semibold text-white
                           bg-gradient-to-r from-yellow-600 to-yellow-400
                           hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-200"
              >
                Get in Touch ↗
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}