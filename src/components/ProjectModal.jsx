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

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Github, ExternalLink } from 'lucide-react'
import clsx from 'clsx'

export default function ProjectModal({ project, isDark, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = project ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [project])

  return (
    // AnimatePresence handles mount/unmount animations
    <AnimatePresence>
      {project && (
        // Backdrop
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          // Click backdrop to close
          onClick={onClose}
          style={{ background: 'rgba(4,6,12,0.82)', backdropFilter: 'blur(14px)' }}
        >
          {/* Modal card — stop propagation so clicking card doesn't close */}
          <motion.div
            className={clsx(
              'w-full max-w-[640px] max-h-[90vh] overflow-y-auto',
              'rounded-2xl border',
              isDark
                ? 'bg-navy-800 border-cyan-400/25'
                : 'bg-white border-cyan-200'
            )}
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 20, opacity: 0 }}
            // Spring = bouncy, natural-feeling animation
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Emoji hero area */}
            <div className={clsx(
              'h-52 flex items-center justify-center text-[6rem]',
              'rounded-t-2xl bg-gradient-to-br',
              isDark
                ? 'from-cyan-400/[0.08] to-violet-400/[0.08]'
                : 'from-cyan-50 to-violet-50'
            )}>
              {project.emoji}
            </div>

            {/* Body */}
            <div className="p-8">
              {/* Title row + close button */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="font-mono text-xs text-cyan-400 uppercase tracking-[0.1em] mb-1">
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
                        ? 'bg-cyan-400/10 border border-cyan-400/20 text-cyan-400'
                        : 'bg-cyan-50 border border-cyan-200 text-cyan-700'
                    )}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx(
                    'flex-1 flex items-center justify-center gap-2',
                    'py-3 rounded-xl text-sm font-semibold border transition-all duration-200',
                    isDark
                      ? 'bg-white/[0.05] border-white/[0.1] text-slate-200 hover:bg-white/[0.09] hover:border-cyan-400/30'
                      : 'bg-black/[0.04] border-black/[0.08] text-slate-700 hover:bg-black/[0.08]'
                  )}
                >
                  <Github size={15} /> View on GitHub
                </a>
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2
                             py-3 rounded-xl text-sm font-semibold text-white
                             bg-gradient-to-r from-cyan-400 to-violet-400
                             hover:shadow-xl hover:shadow-cyan-400/25 hover:-translate-y-0.5
                             transition-all duration-200"
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
