// ═══════════════════════════════════════════════════════
// src/components/ProjectModal.jsx
//
// Animated full-screen modal for project details.
//
// Props:
//  • project  — project object or null (null = closed)
//  • isDark   — theme
//  • onClose  — callback to close the modal
//
// HOW IT WORKS:
//  AnimatePresence in Projects.jsx detects when project 
//  goes null→object and plays the enter animation.
//  When onClose is called, it goes object→null and plays exit.
// ═══════════════════════════════════════════════════════

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Github, ExternalLink } from 'lucide-react'
import clsx from 'clsx'

export default function ProjectModal({ project, isDark, onClose }) {
  // FIX: ref to the modal card so we can allow scroll inside it
  const cardRef = useRef(null)

  // Close on Escape key
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent page scroll while modal is open
  useEffect(() => {
    if (!project) return

    // The ONLY correct approach when Lenis is running:
    // 1. Stop Lenis (it runs its own RAF — overflow rules won't work while it runs)
    // 2. Block wheel + touch scroll events directly on the window
    // 3. Never touch body position/top/overflow — those cause the viewport shift bug
    if (window.__lenis) window.__lenis.stop()

    // FIX: only block scroll OUTSIDE the modal card
    // Previous version blocked ALL touchmove — that prevented scrolling inside the modal
    const preventScroll = (e) => {
      if (cardRef.current && cardRef.current.contains(e.target)) return
      e.preventDefault()
    }
    window.addEventListener('wheel', preventScroll, { passive: false })
    window.addEventListener('touchmove', preventScroll, { passive: false })

    return () => {
      window.removeEventListener('wheel', preventScroll)
      window.removeEventListener('touchmove', preventScroll)
      // Small delay so scroll events don't fire during modal close animation
      requestAnimationFrame(() => {
        if (window.__lenis) window.__lenis.start()
      })
    }
  }, [project])


  return (
    // AnimatePresence handles mount/unmount animations
    <AnimatePresence>
      {project && (
        // Backdrop
        // FIX: items-end on mobile (bottom sheet) so card never overflows screen width
        // sm:items-center restores centered layout on desktop
        <motion.div
          data-modal-backdrop
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:px-4 sm:py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{ background: 'rgba(4,6,12,0.85)', backdropFilter: 'blur(14px)' }}
        >
          {/* Modal card */}
          <motion.div
            ref={cardRef}
            data-lenis-prevent
            className={clsx(
              // FIX: full width on mobile (no side padding = no overflow/border clip)
              // max-w-[640px] kicks in at sm breakpoint for desktop
              'w-full sm:max-w-[640px] overflow-y-auto',
              // FIX: rounded top corners only on mobile (bottom sheet style)
              // full rounded on desktop
              'rounded-t-3xl sm:rounded-2xl',
              'border-t border-x sm:border',
              '[overscroll-behavior:contain] [-webkit-overflow-scrolling:touch]',
              isDark
                ? 'bg-[#111111] border-yellow-500/25'
                : 'bg-white border-yellow-200'
            )}
            // FIX: slides up from bottom on mobile, scale-in on desktop
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            // FIX: dvh accounts for mobile browser address bar (vh doesn't)
            style={{ maxHeight: '92dvh', WebkitOverflowScrolling: 'touch' }}
            onClick={e => e.stopPropagation()}
          >
            {/* FIX: drag handle pill — tells mobile users they can scroll up for more */}
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className={clsx('w-9 h-1 rounded-full', isDark ? 'bg-white/20' : 'bg-black/20')} />
            </div>

            {/* Emoji hero area */}
            <div className={clsx(
              'h-36 sm:h-52 flex items-center justify-center text-5xl sm:text-[6rem]',
              'rounded-t-2xl',
              isDark
                ? 'bg-[#0d0d0d]'
                : 'bg-yellow-50/40'
            )}>
              {project.emoji}
            </div>

            {/* Body */}
            <div className="p-5 sm:p-8">
              {/* Title row + close button */}
              <div className="flex items-start justify-between mb-6">
                {/* FIX: min-w-0 + pr-3 prevents title overflowing into close button */}
                <div className="flex-1 min-w-0 pr-3">
                  <div className="font-mono text-xs text-yellow-500 uppercase tracking-[0.1em] mb-1">
                    {project.category.join(' · ')}
                  </div>
                  <h2 className="font-display font-extrabold text-xl leading-tight">
                    {project.title}
                  </h2>
                  <div className={clsx(
                    'font-mono text-xs mt-1',
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  )}>
                    {project.date}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className={clsx(
                    'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
                    'border transition-all duration-200',
                    isDark
                      ? 'bg-white/[0.06] border-white/[0.08] text-slate-400 hover:text-red-400 hover:border-red-400/30'
                      : 'bg-black/[0.05] border-black/[0.07] text-slate-400 hover:text-red-500 hover:border-red-300'
                  )}
                >
                  <X size={15} />
                </button>
              </div>

              {/* About section */}
              <div className={clsx(
                'font-mono text-[0.7rem] uppercase tracking-[0.1em] mb-2',
                isDark ? 'text-slate-500' : 'text-slate-400'
              )}>
                About
              </div>
              <p className={clsx(
                'text-sm leading-relaxed mb-6',
                isDark ? 'text-slate-300' : 'text-slate-600'
              )}>
                {project.fullDesc}
              </p>

              {/* Tech stack */}
              <div className={clsx(
                'font-mono text-[0.7rem] uppercase tracking-[0.1em] mb-3',
                isDark ? 'text-slate-500' : 'text-slate-400'
              )}>
                Tech Stack
              </div>
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tech.map(t => (
                  <span
                    key={t}
                    className={clsx(
                      'font-mono text-xs px-3 py-1 rounded-lg',
                      isDark
                        ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
                        : 'bg-yellow-50 border border-yellow-200 text-yellow-700'
                    )}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx(
                    'flex-1 flex items-center justify-center gap-2',
                    'py-3 rounded-xl text-sm font-semibold border transition-all duration-200',
                    isDark
                      ? 'bg-white/[0.05] border-white/[0.1] text-slate-200 hover:bg-white/[0.09] hover:border-yellow-500/30'
                      : 'bg-black/[0.04] border-black/[0.08] text-slate-700 hover:bg-black/[0.08]'
                  )}
                >
                  <Github size={15} /> View on GitHub
                </a>
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-black bg-gradient-to-r from-yellow-500 to-yellow-300 hover:shadow-xl hover:shadow-yellow-500/25 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <ExternalLink size={15} /> Live Demo
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}