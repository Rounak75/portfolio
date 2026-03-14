// ═══════════════════════════════════════════════════════
// src/components/About.jsx
// ═══════════════════════════════════════════════════════

import { useRef, useState, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Briefcase, GraduationCap, Camera, Users, Calendar } from 'lucide-react'
import { personal, experience, education, achievements, certifications } from '../data/personal.js'
import { SectionLabel, SectionTitle } from './ui/SectionHeader.jsx'
import clsx from 'clsx'

// FIX 1: Use pointer:fine instead of window.innerWidth
// pointer:fine = real mouse (desktop). pointer:coarse = touch (mobile/tablet).
// This is the correct API — width-based isMobile is wrong for tablets with mice.
const HAS_FINE_POINTER =
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine)').matches

// Keep isMobile for tap-to-tilt logic on touch devices
const isMobile = !HAS_FINE_POINTER

const MAX_TILT = 8

// FIX 2: damping raised from 30 → 42
// damping:30 lets the spring oscillate after mouseLeave — card stays mid-tilt.
// damping:42 is critically damped — snaps to zero instantly, no overshoot.
const SPRING = { stiffness: 300, damping: 42, mass: 0.5 }

// ── Fade up wrapper ───────────────────────────────────
function FadeUp({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ── Pick icon from dot value ──────────────────────────
function getIcon(dot) {
  if (dot === '🎓' || dot === '📘' || dot === '📗') return GraduationCap
  if (dot === '📷') return Camera
  if (dot === 'G' || dot === 'I') return Users
  return Briefcase
}

// ── 3D Tilt Timeline Card ─────────────────────────────
function TimelineCard({ item, index, isDark, isLast }) {
  const [inViewRef, inView] = useInView({ threshold: 0.15, triggerOnce: true })
  const cardRef = useRef(null)
  const Icon = getIcon(item.dot)

  // Mobile tap-to-tilt state
  const [tapped, setTapped] = useState(false)

  // Motion values for tilt
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, SPRING)
  const springY = useSpring(mouseY, SPRING)
  const rotateY = useTransform(springX, [-1, 1], [-MAX_TILT,  MAX_TILT])
  const rotateX = useTransform(springY, [-1, 1], [ MAX_TILT, -MAX_TILT])

  // Shine position
  const shineX = useTransform(springX, [-1, 1], ['20%', '80%'])
  const shineY = useTransform(springY, [-1, 1], ['20%', '80%'])
  const shineBg = useTransform(
    [shineX, shineY],
    ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(212,168,67,0.12) 0%, transparent 65%)`
  )

  // Desktop: track mouse
  const handleMouseMove = useCallback(e => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2))
    mouseY.set((e.clientY - rect.top  - rect.height / 2) / (rect.height / 2))
  }, [mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  // Mobile: tap triggers a quick tilt pulse then resets
  const handleTap = useCallback(() => {
    if (!isMobile) return
    setTapped(true)
    mouseX.set(0.6)
    mouseY.set(-0.4)
    setTimeout(() => {
      mouseX.set(0)
      mouseY.set(0)
      setTapped(false)
    }, 400)
  }, [mouseX, mouseY])

  // Combine inView ref + cardRef
  const setRefs = useCallback(node => {
    cardRef.current = node
    inViewRef(node)
  }, [inViewRef])

  return (
    <div ref={setRefs} className="relative flex flex-col items-center">

      {/* Perspective wrapper */}
      <div style={{ perspective: 800, width: '100%' }}>
        <motion.div
          // Entrance animation
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 24,
            delay: index * 0.07,
          }}
          // FIX 3: willChange only on desktop — tells GPU to pre-promote the layer.
          // On mobile, willChange:transform creates compositing layers that waste
          // memory without benefit since tilt is disabled.
          style={HAS_FINE_POINTER
            ? { rotateX, rotateY, transformStyle: 'preserve-3d', willChange: 'transform' }
            : { rotateX, rotateY, transformStyle: 'preserve-3d' }
          }
          // Desktop hover lift — disabled on mobile to prevent stuck state
          whileHover={isMobile ? undefined : { scale: 1.02, z: 10 }}
          // FIX 4: Use HAS_FINE_POINTER for mouse handlers — not isMobile width check
          // Prevents mouse events firing on touch devices that happen to be wide
          onTap={isMobile ? handleTap : undefined}
          onMouseMove={HAS_FINE_POINTER ? handleMouseMove  : undefined}
          onMouseLeave={HAS_FINE_POINTER ? handleMouseLeave : undefined}
          className={clsx(
            'w-full rounded-2xl border p-5 transition-colors duration-300 group relative overflow-hidden card-3d ground-shadow',
            isDark
              ? 'bg-white/[0.04] border-white/[0.08] hover:border-yellow-500/30 hover:bg-white/[0.07] hover:shadow-xl hover:shadow-yellow-500/[0.08]'
              : 'bg-white/80 border-amber-200/60 shadow-sm hover:border-yellow-500/50 hover:shadow-md hover:shadow-yellow-500/[0.08]',
            isMobile && tapped ? (isDark ? 'border-yellow-500/40' : 'border-yellow-500/60') : ''
          )}
        >
          {/* Gold shimmer overlay — desktop only */}
          {HAS_FINE_POINTER && (
            <motion.div
              className="absolute inset-0 pointer-events-none rounded-2xl z-10"
              style={{ background: shineBg }}
            />
          )}

          {/* Top row: icon + year */}
          {/* FIX 3 cont: translateZ on children only on desktop */}
          <div
            className="flex items-center justify-between mb-3"
            style={HAS_FINE_POINTER ? { transform: 'translateZ(8px)' } : undefined}
          >
            <div className={clsx(
              'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
              'bg-gradient-to-br from-yellow-600/20 to-yellow-400/20 border',
              isDark ? 'border-yellow-500/25' : 'border-yellow-500/30'
            )}>
              {['🎓', '📘', '📗', '📷'].includes(item.dot)
                ? <span className="text-base leading-none">{item.dot}</span>
                : <Icon size={15} className="text-yellow-500" />
              }
            </div>

            <div className={clsx(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.65rem] font-mono',
              isDark
                ? 'bg-white/[0.05] border border-white/[0.08] text-slate-500'
                : 'bg-amber-50 border border-amber-200/60 text-stone-400'
            )}>
              <Calendar size={9} />
              {item.year}
            </div>
          </div>

          {/* Title */}
          <h3
            className="font-display font-bold text-sm leading-snug mb-1"
            style={HAS_FINE_POINTER ? { transform: 'translateZ(6px)' } : undefined}
          >
            {item.title}
          </h3>

          {/* Subtitle */}
          <p className={clsx('text-xs leading-relaxed', isDark ? 'text-slate-400' : 'text-stone-500')}>
            {item.sub}
          </p>

          {/* Tags */}
          {item.tags && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {item.tags.map(t => (
                <span key={t} className={clsx(
                  'px-2 py-0.5 rounded-md text-[0.65rem] font-mono',
                  isDark
                    ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500'
                    : 'bg-yellow-50 border border-yellow-300 text-yellow-700'
                )}>
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Gold left accent bar */}
          <motion.div
            className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
            style={{
              background: 'linear-gradient(to bottom, #d4a843, #f0c060)',
              scaleY: 0,
              transformOrigin: 'top',
            }}
            whileHover={isMobile ? undefined : { scaleY: 1 }}
            animate={isMobile && tapped ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.25 }}
          />
        </motion.div>
      </div>

      {/* Connector line */}
      {!isLast && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.45, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{
            width: 1,
            minHeight: 24,
            transformOrigin: 'top',
            background: isDark
              ? 'linear-gradient(to bottom, rgba(212,168,67,0.4), rgba(240,192,96,0.1))'
              : 'linear-gradient(to bottom, rgba(212,168,67,0.5), rgba(240,192,96,0.15))',
          }}
        />
      )}
    </div>
  )
}

// ── Timeline column with header ───────────────────────
function TimelineColumn({ title, emoji, items, isDark, delay = 0 }) {
  return (
    <FadeUp delay={delay}>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xl">{emoji}</span>
        <h3 className={clsx(
          'font-display font-bold text-base tracking-tight',
          isDark ? 'text-slate-200' : 'text-stone-800'
        )}>
          {title}
        </h3>
        <div className="flex-1 h-px" style={{
          background: isDark
            ? 'linear-gradient(to right, rgba(212,168,67,0.4), transparent)'
            : 'linear-gradient(to right, rgba(212,168,67,0.5), transparent)',
        }} />
      </div>

      <div className="flex flex-col items-stretch">
        {items.map((item, i) => (
          <TimelineCard
            key={i}
            item={item}
            index={i}
            isDark={isDark}
            isLast={i === items.length - 1}
          />
        ))}
      </div>
    </FadeUp>
  )
}

// ═══════════════════════════════════════════════════════
export default function About({ isDark }) {
  const surface      = isDark ? 'bg-white/[0.04] border-white/[0.08]' : 'bg-white/80 border-amber-200/60 shadow-sm'
  const surfaceHover = isDark
    ? 'hover:border-yellow-500/25 hover:shadow-lg hover:shadow-yellow-500/[0.07]'
    : 'hover:border-yellow-500/40 hover:shadow-md'

  return (
    <section id="about" className={clsx('py-16 md:py-28', isDark ? 'bg-white/[0.02]' : 'bg-amber-50/40')}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <FadeUp>
          <SectionLabel isDark={isDark} number="01" label="Who I am" />
          <SectionTitle>About Me</SectionTitle>
        </FadeUp>

        {/* Bio + Achievements + Certs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-12">
          <div>
            <FadeUp delay={0.05}>
              <p className={clsx('text-base leading-[1.9] mb-4', isDark ? 'text-slate-400' : 'text-stone-600')}>
                {personal.aboutLong}
              </p>
              <p className={clsx('text-sm leading-[1.9] mb-8', isDark ? 'text-slate-500' : 'text-stone-500')}>
                {personal.aboutExtra}
              </p>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className={clsx('rounded-2xl border p-6 mb-4 transition-all duration-300', surface, surfaceHover)}>
                <div className="text-2xl mb-3">🏆</div>
                <h3 className="font-display font-bold text-sm mb-3">Achievements</h3>
                <ul className="space-y-2">
                  {achievements.map(a => (
                    <li key={a} className={clsx('flex items-start gap-2.5 text-sm', isDark ? 'text-slate-400' : 'text-stone-600')}>
                      <span className="text-yellow-500 font-mono mt-0.5 flex-shrink-0">→</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className={clsx('rounded-2xl border p-6 transition-all duration-300', surface, surfaceHover)}>
                <div className="text-2xl mb-3">📜</div>
                <h3 className="font-display font-bold text-sm mb-3">Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {certifications.map(cert => (
                    <span key={cert} className={clsx(
                      'px-3 py-1 rounded-lg text-xs font-medium font-mono',
                      isDark
                        ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500'
                        : 'bg-yellow-50 border border-yellow-300 text-yellow-700'
                    )}>
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Quote card — desktop only */}
          <div className="hidden lg:flex items-start justify-center">
            <FadeUp delay={0.1} className="w-full">
              <div className={clsx('rounded-2xl border p-6 text-center', surface)}>
                <div className="text-4xl mb-3">💡</div>
                <p className={clsx('text-sm leading-relaxed font-mono', isDark ? 'text-slate-500' : 'text-stone-500')}>
                  "First, solve the problem.<br />Then, write the code."
                </p>
                <p className={clsx('text-xs mt-2 font-mono', isDark ? 'text-slate-600' : 'text-stone-400')}>
                  — John Johnson
                </p>
              </div>
            </FadeUp>
          </div>
        </div>

        {/* Divider */}
        <div className={clsx('my-12 h-px', isDark ? 'bg-white/[0.06]' : 'bg-amber-200/50')} />

        {/* Two Timeline Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <TimelineColumn
            title="Education"
            emoji="🎓"
            items={education}
            isDark={isDark}
            delay={0.05}
          />
          <TimelineColumn
            title="Experience"
            emoji="💼"
            items={experience}
            isDark={isDark}
            delay={0.15}
          />
        </div>

      </div>
    </section>
  )
}