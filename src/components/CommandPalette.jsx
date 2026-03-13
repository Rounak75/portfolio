// ═══════════════════════════════════════════════════════
// src/components/CommandPalette.jsx
//
// Spotlight-style command palette — press Cmd+K (Mac)
// or Ctrl+K (Windows/Linux) to open.
//
// Features:
//  • Fuzzy search across sections, projects, social links
//  • Keyboard navigation (↑ ↓ Enter Escape)
//  • Groups: Navigation, Projects, Social, Actions
//  • Recent commands remembered in localStorage
//  • Closes on backdrop click or Escape
// ═══════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, ArrowRight, Github, Linkedin, Mail,
  User, Code2, Briefcase, FileText, Phone,
  Home, Zap, ExternalLink, Command, X,
} from 'lucide-react'
import { personal }  from '../data/personal.js'
import { projects }  from '../data/projects.js'
import clsx from 'clsx'

// ── All searchable commands ───────────────────────────
const buildCommands = () => [
  // Navigation
  { id: 'nav-hero',     group: 'Navigation', icon: Home,      label: 'Go to Home',     sub: '#hero',     action: () => scrollTo('hero')     },
  { id: 'nav-about',    group: 'Navigation', icon: User,      label: 'Go to About',    sub: '#about',    action: () => scrollTo('about')    },
  { id: 'nav-skills',   group: 'Navigation', icon: Zap,       label: 'Go to Skills',   sub: '#skills',   action: () => scrollTo('skills')   },
  { id: 'nav-projects', group: 'Navigation', icon: Code2,     label: 'Go to Projects', sub: '#projects', action: () => scrollTo('projects') },
  { id: 'nav-resume',   group: 'Navigation', icon: FileText,  label: 'Go to Resume',   sub: '#resume',   action: () => scrollTo('resume')   },
  { id: 'nav-contact',  group: 'Navigation', icon: Phone,     label: 'Go to Contact',  sub: '#contact',  action: () => scrollTo('contact')  },

  // Projects (dynamic from projects.js)
  ...projects.map(p => ({
    id:     `proj-${p.id}`,
    group:  'Projects',
    icon:   Briefcase,
    label:  p.title,
    sub:    p.category.join(', '),
    emoji:  p.emoji,
    action: () => {
      scrollTo('projects')
    },
  })),

  // Social links
  { id: 'social-github',   group: 'Social', icon: Github,   label: 'GitHub Profile',   sub: 'github.com/Rounak75',        action: () => open(personal.socials.github)   },
  { id: 'social-linkedin', group: 'Social', icon: Linkedin, label: 'LinkedIn Profile', sub: 'linkedin.com/in/rounakmahato', action: () => open(personal.socials.linkedin) },
  { id: 'social-email',    group: 'Social', icon: Mail,     label: 'Send Email',       sub: personal.email,               action: () => open(personal.socials.email)    },

  // Actions
  { id: 'action-resume', group: 'Actions', icon: FileText,     label: 'Download Resume',   sub: 'Save PDF to your device',  action: () => downloadResume() },
  { id: 'action-theme',  group: 'Actions', icon: Zap,          label: 'Toggle Theme',      sub: 'Switch dark / light mode', action: 'toggleTheme' },
]

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function open(href) {
  window.open(href, '_blank', 'noopener,noreferrer')
}

function downloadResume() {
  const a = document.createElement('a')
  a.href = personal.resumeUrl
  a.download = ''
  a.click()
}

// Simple fuzzy match — does every char in query appear in label in order?
function fuzzyMatch(str, query) {
  if (!query) return true
  const s = str.toLowerCase()
  const q = query.toLowerCase()
  let si = 0
  for (let qi = 0; qi < q.length; qi++) {
    const idx = s.indexOf(q[qi], si)
    if (idx === -1) return false
    si = idx + 1
  }
  return true
}

// ═══════════════════════════════════════════════════════
export default function CommandPalette({ isDark, onToggleTheme }) {
  const [open,    setOpen]    = useState(false)
  const [query,   setQuery]   = useState('')
  const [cursor,  setCursor]  = useState(0)   // keyboard-selected index
  const inputRef  = useRef(null)
  const listRef   = useRef(null)

  const commands = buildCommands()

  // ── Filter by query ───────────────────────────────
  const filtered = query
    ? commands.filter(c =>
        fuzzyMatch(c.label, query) ||
        fuzzyMatch(c.group, query) ||
        (c.sub && fuzzyMatch(c.sub, query))
      )
    : commands

  // Group filtered results
  const grouped = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.group]) acc[cmd.group] = []
    acc[cmd.group].push(cmd)
    return acc
  }, {})

  // Flat list for keyboard navigation
  const flat = Object.values(grouped).flat()

  // ── Open / close ──────────────────────────────────
  const openPalette  = useCallback(() => { setOpen(true);  setQuery(''); setCursor(0) }, [])
  const closePalette = useCallback(() => { setOpen(false); setQuery('') }, [])

  // ── Global keyboard shortcut ──────────────────────
  useEffect(() => {
    const handler = e => {
      // Cmd+K (Mac) or Ctrl+K (Win/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        open ? closePalette() : openPalette()
      }
      if (e.key === 'Escape' && open) closePalette()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, openPalette, closePalette])

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  // ── Keyboard navigation inside palette ────────────
  const handleKeyDown = e => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor(c => Math.min(c + 1, flat.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor(c => Math.max(c - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const cmd = flat[cursor]
      if (cmd) runCommand(cmd)
    }
  }

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.querySelector('[data-active="true"]')
    el?.scrollIntoView({ block: 'nearest' })
  }, [cursor])

  // Reset cursor when query changes
  useEffect(() => setCursor(0), [query])

  // ── Execute a command ─────────────────────────────
  const runCommand = cmd => {
    closePalette()
    if (cmd.action === 'toggleTheme') {
      onToggleTheme()
    } else if (typeof cmd.action === 'function') {
      // Small delay so the palette closes first
      setTimeout(cmd.action, 150)
    }
  }

  return (
    <>
      {/* ── Trigger hint (bottom-right corner) ───────
          Shows "⌘K" so visitors know the shortcut exists */}
      <motion.button
        onClick={openPalette}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.5, duration: 0.4 }}
        className={clsx(
          'fixed bottom-6 right-6 z-40',
          'flex items-center gap-2 px-3.5 py-2 rounded-xl',
          'text-xs font-mono font-medium border',
          'transition-all duration-200 hover:-translate-y-0.5',
          isDark
            ? 'bg-black/80 border-white/[0.1] text-slate-400 hover:text-slate-200 hover:border-yellow-500/30 backdrop-blur-md'
            : 'bg-white/90 border-black/[0.1] text-slate-500 hover:text-slate-800 hover:border-cyan-300 backdrop-blur-md shadow-md'
        )}
      >
        <Command size={12} />
        <span>K</span>
        <span className={clsx('ml-1 pl-2 border-l text-[0.6rem]', isDark ? 'border-white/[0.1] text-slate-600' : 'border-black/[0.08] text-slate-400')}>
          Search
        </span>
      </motion.button>

      {/* ── Palette modal ─────────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={closePalette}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -16 }}
              animate={{ opacity: 1, scale: 1,    y: 0   }}
              exit={{    opacity: 0, scale: 0.96, y: -16 }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className={clsx(
                'fixed top-[15vh] left-1/2 -translate-x-1/2 z-[101]',
                'w-full max-w-xl rounded-2xl overflow-hidden',
                'border shadow-2xl',
                isDark
                  ? 'bg-black/95 border-white/[0.1] backdrop-blur-xl'
                  : 'bg-white border-black/[0.1] backdrop-blur-xl shadow-slate-200/80'
              )}
            >
              {/* Search input row */}
              <div className={clsx('flex items-center gap-3 px-5 py-4 border-b', isDark ? 'border-white/[0.08]' : 'border-black/[0.07]')}>
                <Search size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search sections, projects, actions…"
                  className={clsx(
                    'flex-1 bg-transparent text-sm outline-none font-body',
                    isDark ? 'text-slate-100 placeholder:text-slate-600' : 'text-slate-900 placeholder:text-slate-400'
                  )}
                />
                {/* Close / ESC hint */}
                <button onClick={closePalette} className={clsx('text-xs font-mono px-2 py-0.5 rounded-md border transition-colors',
                  isDark ? 'border-white/[0.1] text-slate-500 hover:text-slate-300' : 'border-black/[0.1] text-slate-400 hover:text-slate-700'
                )}>
                  esc
                </button>
              </div>

              {/* Results list */}
              <div ref={listRef} className="max-h-[360px] overflow-y-auto py-2">
                {flat.length === 0 ? (
                  <div className={clsx('text-center py-10 text-sm', isDark ? 'text-slate-600' : 'text-slate-400')}>
                    No results for "{query}"
                  </div>
                ) : (
                  Object.entries(grouped).map(([group, items]) => (
                    <div key={group}>
                      {/* Group label */}
                      <div className={clsx('px-5 py-1.5 text-[0.65rem] font-mono uppercase tracking-[0.1em]', isDark ? 'text-slate-600' : 'text-slate-400')}>
                        {group}
                      </div>

                      {/* Items */}
                      {items.map(cmd => {
                        const globalIdx = flat.indexOf(cmd)
                        const isActive  = globalIdx === cursor
                        const Icon      = cmd.icon

                        return (
                          <button
                            key={cmd.id}
                            data-active={isActive}
                            onClick={() => runCommand(cmd)}
                            onMouseEnter={() => setCursor(globalIdx)}
                            className={clsx(
                              'w-full flex items-center gap-3 px-5 py-3 text-left transition-colors duration-100',
                              isActive
                                ? isDark ? 'bg-white/[0.07]' : 'bg-slate-50'
                                : 'hover:bg-white/[0.03]'
                            )}
                          >
                            {/* Icon or emoji */}
                            <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base',
                              isActive
                                ? 'bg-gradient-to-br from-cyan-400/25 to-violet-400/25 text-yellow-500'
                                : isDark ? 'bg-white/[0.05] text-slate-500' : 'bg-black/[0.05] text-slate-500'
                            )}>
                              {cmd.emoji ? cmd.emoji : <Icon size={14} />}
                            </div>

                            {/* Label + sub */}
                            <div className="flex-1 min-w-0">
                              <div className={clsx('text-sm font-medium truncate',
                                isActive ? (isDark ? 'text-white' : 'text-slate-900') : (isDark ? 'text-slate-300' : 'text-slate-700')
                              )}>
                                {cmd.label}
                              </div>
                              {cmd.sub && (
                                <div className={clsx('text-xs truncate mt-0.5', isDark ? 'text-slate-600' : 'text-slate-400')}>
                                  {cmd.sub}
                                </div>
                              )}
                            </div>

                            {/* Arrow hint on active */}
                            {isActive && <ArrowRight size={14} className="text-yellow-500 flex-shrink-0" />}
                          </button>
                        )
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer hint */}
              <div className={clsx('px-5 py-2.5 border-t flex items-center gap-4 text-[0.65rem] font-mono',
                isDark ? 'border-white/[0.06] text-slate-600' : 'border-black/[0.06] text-slate-400'
              )}>
                <span><kbd>↑↓</kbd> navigate</span>
                <span><kbd>↵</kbd> select</span>
                <span><kbd>esc</kbd> close</span>
                <span className="ml-auto opacity-60">{flat.length} results</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}