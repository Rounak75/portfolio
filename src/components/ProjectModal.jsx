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

  // ── Scroll lock ────────────────────────────────────────
  // Desktop: overflow:hidden + paddingRight to compensate scrollbar
  // Mobile iOS: position:fixed trick to kill momentum scroll
  useEffect(() => {
    if (!project) return

    const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const scrollY = window.scrollY
    const body = document.body

    if (isMobileDevice) {
      body.style.position = 'fixed'
      body.style.top      = `-${scrollY}px`
      body.style.left     = '0'
      body.style.right    = '0'
      body.style.overflow = 'hidden'
    } else {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      body.style.overflow    = 'hidden'
      if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`
    }

    return () => {
      body.style.position     = ''
      body.style.top          = ''
      body.style.left         = ''
      body.style.right        = ''
      body.style.overflow     = ''
      body.style.paddingRight = ''
      if (isMobileDevice) {
        window.scrollTo({ top: scrollY, behavior: 'instant' })
      }
    }
  }, [project])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[200] overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          style={{ background: 'rgba(4,6,12,0.85)', backdropFilter: 'blur(14px)' }}
          onClick={onClose}
        >
          {/* Centering wrapper */}
          <div className="min-h-full flex items-center justify-center p-4 sm:p-6">

            {/* Modal card */}
            <motion.div
              className={clsx(
                'w-full max-w-[640px] rounded-2xl border',
                'relative my-4',
                isDark
                  ? 'bg-[#111111] border-yellow-500/20'
                  : 'bg-white border-amber-200/70 shadow-xl'
              )}
              initial={{ scale: 0.93, y: 16, opacity: 0 }}
              animate={{ scale: 1,    y: 0,  opacity: 1 }}
              exit={{    scale: 0.93, y: 16, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Emoji hero */}
              <div className={clsx(
                'h-44 sm:h-52 flex items-center justify-center text-[5rem] sm:text-[6rem]',
                'rounded-t-2xl bg-gradient-to-br',
                isDark
                  ? 'from-yellow-500/[0.06] to-yellow-400/[0.04]'
                  : 'from-amber-50 to-yellow-50'
              )}>
                {project.emoji}
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8">

                {/* Title row + close */}
                <div className="flex items-start justify-between mb-6">
                  <div className="pr-4">
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

                {/* About */}
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
                    <span key={t} className={clsx(
                      'font-mono text-xs px-3 py-1 rounded-lg',
                      isDark
                        ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500'
                        : 'bg-amber-50 border border-amber-200 text-amber-700'
                    )}>
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
                    className="flex-1 flex items-center justify-center gap-2
                               py-3 rounded-xl text-sm font-semibold text-white
                               bg-gradient-to-r from-yellow-600 to-yellow-400
                               hover:shadow-xl hover:shadow-yellow-500/25 hover:-translate-y-0.5
                               transition-all duration-200"
                  >
                    <ExternalLink size={15} /> Live Demo
                  </a>
                </div>

              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}