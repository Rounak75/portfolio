import { useRef, useState, useCallback } from 'react'
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
const SPRING   = { stiffness: 300, damping: 42, mass: 0.5 }

// Evaluated once — true on real mouse devices, false on touch
const HAS_FINE_POINTER =
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine)').matches

// True on touch devices — where we use tap-to-tilt
const IS_TOUCH = !HAS_FINE_POINTER

export default function ProjectCard({ project, isDark, onPreview }) {
  const cardRef = useRef(null)
  const [expanded, setExpanded] = useState(false)
  // Track whether a tap-tilt is in progress (mobile)
  const [isTilting, setIsTilting] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, SPRING)
  const springY = useSpring(mouseY, SPRING)
  const rotateY = useTransform(springX, [-1, 1], [-MAX_TILT,  MAX_TILT])
  const rotateX = useTransform(springY, [-1, 1], [ MAX_TILT, -MAX_TILT])
  const shineX  = useTransform(springX, [-1, 1], ['0%', '100%'])
  const shineY  = useTransform(springY, [-1, 1], ['0%', '100%'])

  const shineBg = useTransform(
    [shineX, shineY],
    ([x, y]) =>
      `radial-gradient(circle at ${x} ${y}, rgba(212,168,67,0.13) 0%, transparent 65%)`
  )

  // Desktop: track mouse position for smooth tilt
  const handleMouseMove = e => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2))
    mouseY.set((e.clientY - rect.top  - rect.height / 2) / (rect.height / 2))
  }
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0) }

  // Mobile: tilt toward wherever the user actually tapped on the card
  const handleTap = useCallback((e) => {
    if (!IS_TOUCH) return
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return

    // Use changedTouches (touchend) or touches (touchstart), fall back to pointer event
    const touch = e.changedTouches?.[0] || e.touches?.[0] || e
    const x = (touch.clientX - rect.left  - rect.width  / 2) / (rect.width  / 2)
    const y = (touch.clientY - rect.top   - rect.height / 2) / (rect.height / 2)

    setIsTilting(true)
    mouseX.set(x)
    mouseY.set(y)
    // Spring back to flat after 400ms
    setTimeout(() => {
      mouseX.set(0)
      mouseY.set(0)
      setIsTilting(false)
    }, 400)
  }, [mouseX, mouseY])

  // Mobile expand/collapse toggle — passes event so tilt uses tap position
  const toggleExpanded = (e) => {
    if (IS_TOUCH) {
      handleTap(e)
      setExpanded(o => !o)
    }
  }

  return (
    // perspective always on — enables 3D on both desktop and mobile
    <div style={{ perspective: 900 }}>
      <motion.div
        ref={cardRef}
        // Desktop: continuous mouse tracking
        onMouseMove={HAS_FINE_POINTER ? handleMouseMove  : undefined}
        onMouseLeave={HAS_FINE_POINTER ? handleMouseLeave : undefined}
        // 3D tilt always active — works on both desktop (mouse) and mobile (tap pulse)
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        // Desktop lift on hover; mobile gets a subtle scale on tap via whileTap
        whileHover={HAS_FINE_POINTER ? { scale: 1.02, z: 20 } : undefined}
        whileTap={IS_TOUCH ? { scale: 0.98 } : undefined}
        transition={{ duration: 0.25 }}
        className={clsx(
          'rounded-2xl border overflow-hidden flex flex-col relative cursor-pointer group',
          'transition-colors duration-300',
          isDark
            ? 'bg-white/[0.04] border-white/[0.08] hover:border-yellow-500/30'
            : 'bg-white border-black/[0.07] shadow-sm hover:border-yellow-500/50'
        )}
      >
        {/* Shine overlay — visible on desktop hover AND mobile tap-tilt */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-20 rounded-2xl"
          style={{
            background: shineBg,
            translateZ: 1,
            // On mobile show shine only during tilt pulse
            opacity: IS_TOUCH ? (isTilting ? 1 : 0) : 1,
            transition: IS_TOUCH ? 'opacity 0.3s ease' : undefined,
          }}
        />

        {/* Thumbnail — tapping this toggles expand on mobile */}
        <div
          className={clsx(
            'h-44 flex items-center justify-center text-6xl relative overflow-hidden border-b transition-all duration-300',
            isDark ? 'bg-black/60 border-white/[0.06]' : 'bg-slate-50 border-black/[0.05]'
          )}
          onClick={toggleExpanded}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-yellow-400/0 group-hover:from-yellow-500/[0.08] group-hover:to-yellow-400/[0.08] transition-all duration-300" />

          <span
            className="relative z-10"
            style={{ display: 'block', transform: 'translateZ(30px)' }}
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

          {/* Mobile expand hint */}
          {IS_TOUCH && (
            <div className={clsx(
              'absolute bottom-2 left-1/2 -translate-x-1/2',
              'px-2.5 py-1 rounded-full text-[0.6rem] font-mono flex items-center gap-1',
              isDark ? 'bg-black/50 text-slate-400' : 'bg-white/70 text-slate-500'
            )}>
              {expanded ? <ChevronUp size={9} /> : <ChevronDown size={9} />}
              {expanded ? 'tap to collapse' : 'tap to expand'}
            </div>
          )}
        </div>

        {/* Body */}
        <div
          className="p-6 flex flex-col flex-1"
          style={{ transform: 'translateZ(10px)' }}
          onClick={toggleExpanded}
        >
          <div className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-yellow-500 mb-2">
            {project.category.join(' · ')}
          </div>

          <h3 className="font-display font-bold text-base mb-2 leading-snug">
            {project.title}
          </h3>

          {/* On desktop: always show full description
              On mobile: show one-line teaser when collapsed, full when expanded */}
          {HAS_FINE_POINTER ? (
            <p className={clsx('text-sm leading-relaxed mb-4', isDark ? 'text-slate-400' : 'text-slate-500')}>
              {project.shortDesc}
            </p>
          ) : expanded ? (
            <p className={clsx('text-sm leading-relaxed mb-4', isDark ? 'text-slate-400' : 'text-slate-500')}>
              {project.shortDesc}
            </p>
          ) : (
            <p className={clsx('text-sm leading-relaxed mb-3 line-clamp-1', isDark ? 'text-slate-500' : 'text-slate-400')}>
              {project.shortDesc}
            </p>
          )}

          {/* Tags — always visible */}
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

          {/* Buttons:
              Desktop — always visible
              Mobile  — only when expanded */}
          {(HAS_FINE_POINTER || expanded) && (
            <AnimatePresence>
              <motion.div
                key="buttons"
                className="flex gap-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
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
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  )
}