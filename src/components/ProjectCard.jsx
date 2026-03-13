import { useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion'
import { Github, ExternalLink, Eye, ChevronDown, ChevronUp } from 'lucide-react'
import clsx from 'clsx'

const MAX_TILT = 12
const SPRING   = { stiffness: 300, damping: 28, mass: 0.5 }

// Evaluated once at module level — stable, no re-render cost
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

export default function ProjectCard({ project, isDark, onPreview }) {
  const cardRef  = useRef(null)
  const [expanded, setExpanded] = useState(false)

  // 3D tilt motion values — only wired up on desktop
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, SPRING)
  const springY = useSpring(mouseY, SPRING)
  const rotateY = useTransform(springX, [-1, 1], [-MAX_TILT,  MAX_TILT])
  const rotateX = useTransform(springY, [-1, 1], [ MAX_TILT, -MAX_TILT])
  const shineX  = useTransform(springX, [-1, 1], ['0%', '100%'])
  const shineY  = useTransform(springY, [-1, 1], ['0%', '100%'])

  const handleMouseMove = e => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2))
    mouseY.set((e.clientY - rect.top  - rect.height / 2) / (rect.height / 2))
  }
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0) }

  // Shine background — static on mobile, dynamic on desktop
  const shineBg = useTransform(
    [shineX, shineY],
    ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.09) 0%, transparent 65%)`
  )

  return (
    // perspective: none on mobile so no 3D context is created at all
    <div style={{ perspective: isMobile ? 'none' : 900 }}>
      <motion.div
        ref={cardRef}
        // Mouse handlers — desktop only
        onMouseMove={isMobile ? undefined : handleMouseMove}
        onMouseLeave={isMobile ? undefined : handleMouseLeave}
        // 3D style — desktop only; empty object on mobile means no transform applied
        style={isMobile ? {} : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        // whileHover scale+z — desktop only; on mobile touch triggers hover and never resets
        whileHover={isMobile ? undefined : { scale: 1.02, z: 20 }}
        transition={{ duration: 0.25 }}
        className={clsx(
          'rounded-2xl border overflow-hidden flex flex-col relative cursor-pointer group',
          'transition-colors duration-300',
          isDark
            ? 'bg-white/[0.04] border-white/[0.08] hover:border-yellow-500/30'
            : 'bg-white/80 border-amber-200/60 shadow-sm hover:border-yellow-500/50'
        )}
      >
        {/* Shine overlay — disabled on mobile */}
        {!isMobile && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-20 rounded-2xl"
            style={{ background: shineBg, translateZ: 1 }}
          />
        )}

        {/* Thumbnail */}
        <div className={clsx(
          'h-44 flex items-center justify-center text-6xl relative overflow-hidden border-b transition-all duration-300',
          isDark ? 'bg-black/60 border-white/[0.06]' : 'bg-slate-50 border-black/[0.05]'
        )}>
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-yellow-400/0 group-hover:from-yellow-500/[0.08] group-hover:to-yellow-400/[0.08] transition-all duration-300" />

          {/* translateZ only on desktop */}
          <span
            className="relative z-10"
            style={{ display: 'block', transform: isMobile ? 'none' : 'translateZ(30px)' }}
          >
            {project.emoji}
          </span>

          {project.featured && (
            <span className={clsx(
              'absolute top-3 right-3 px-2.5 py-1 rounded-full font-mono text-[0.65rem] font-semibold',
              isDark
                ? 'bg-yellow-500/15 border border-yellow-500/30 text-yellow-500'
                : 'bg-yellow-50 border border-yellow-300 text-yellow-700'
            )}>
              ★ Featured
            </span>
          )}

          {/* Mobile tap hint */}
          <div className={clsx(
            'absolute bottom-2 left-1/2 -translate-x-1/2 md:hidden',
            'px-2.5 py-1 rounded-full text-[0.6rem] font-mono flex items-center gap-1',
            isDark ? 'bg-black/50 text-slate-400' : 'bg-white/70 text-slate-500'
          )}>
            {expanded ? <ChevronUp size={9} /> : <ChevronDown size={9} />}
            {expanded ? 'tap to collapse' : 'tap to expand'}
          </div>
        </div>

        {/* Body — translateZ only on desktop */}
        <div
          className="p-6 flex flex-col flex-1"
          style={{ transform: isMobile ? 'none' : 'translateZ(10px)' }}
          onClick={() => {
            if (window.innerWidth < 768) setExpanded(o => !o)
          }}
        >
          <div className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-yellow-500 mb-2">
            {project.category.join(' · ')}
          </div>

          <h3 className="font-display font-bold text-base mb-2 leading-snug">
            {project.title}
          </h3>

          {/* Description — always visible on desktop, toggled on mobile */}
          <div className={clsx('md:block', expanded ? 'block' : 'hidden')}>
            <p className={clsx('text-sm leading-relaxed mb-4', isDark ? 'text-slate-400' : 'text-slate-500')}>
              {project.shortDesc}
            </p>
          </div>

          {/* Short teaser on mobile when collapsed */}
          <p className={clsx(
            'text-sm leading-relaxed mb-3 md:hidden line-clamp-1',
            expanded ? 'hidden' : 'block',
            isDark ? 'text-slate-500' : 'text-slate-400'
          )}>
            {project.shortDesc}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.tech.map(t => (
              <span key={t} className={clsx(
                'font-mono text-[0.66rem] px-2 py-0.5 rounded-md',
                isDark
                  ? 'bg-white/[0.06] text-slate-400 border border-white/[0.07]'
                  : 'bg-black/[0.05] text-slate-500 border border-black/[0.07]'
              )}>
                {t}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <AnimatePresence>
            {(expanded || true) && (
              <motion.div
                className={clsx('flex gap-2', 'md:flex', expanded ? 'flex' : 'hidden md:flex')}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={e => { e.stopPropagation(); onPreview() }}
                  className={clsx(
                    'flex-1 flex items-center justify-center gap-1.5',
                    'py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200',
                    isDark
                      ? 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:bg-white/[0.08] hover:border-yellow-500/25'
                      : 'bg-black/[0.04] border-black/[0.07] text-slate-600 hover:bg-black/[0.07]'
                  )}
                >
                  <Eye size={12} /> Preview
                </button>

                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className={clsx(
                    'flex-1 flex items-center justify-center gap-1.5',
                    'py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200',
                    isDark
                      ? 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:bg-white/[0.08] hover:border-yellow-500/25'
                      : 'bg-black/[0.04] border-black/[0.07] text-slate-600 hover:bg-black/[0.07]'
                  )}
                >
                  <Github size={12} /> GitHub
                </a>

                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl
                             text-xs font-semibold text-white
                             bg-gradient-to-r from-yellow-600 to-yellow-400
                             hover:shadow-lg hover:shadow-yellow-500/20 hover:-translate-y-0.5
                             transition-all duration-200"
                >
                  <ExternalLink size={12} /> Demo
                </a>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </div>
  )
}