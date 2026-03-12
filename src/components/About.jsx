// ═══════════════════════════════════════════════════════
// src/components/About.jsx
//
// ABOUT SECTION
//
// NEW: Scroll-triggered timeline draw animation
//  • The vertical connector line draws itself downward
//    as the timeline enters the viewport (scaleY 0→1)
//  • Each dot pops in with a spring scale animation
//  • Each row of text slides in from the left, staggered
//  • Respects prefers-reduced-motion
// ═══════════════════════════════════════════════════════

import { useRef }    from 'react'
import { useInView } from 'react-intersection-observer'
import { motion }    from 'framer-motion'
import { personal, experience, achievements, certifications } from '../data/personal.js'
import { SectionLabel, SectionTitle } from './ui/SectionHeader.jsx'
import clsx from 'clsx'

// ── Reusable fade-in wrapper ──────────────────────────
function FadeUp({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView({ threshold: 0.12, triggerOnce: true })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.4,0,0.2,1] }}
    >
      {children}
    </motion.div>
  )
}

// ── Animated timeline item ────────────────────────────
// Each item: dot pops in, content slides from left
function TimelineItem({ item, index, isDark, isLast }) {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true })

  return (
    <div ref={ref} className="flex gap-5 relative">

      {/* ── Left column: dot + connector line ────────── */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 30 }}>
        {/* Dot — springs in when row enters viewport */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.05 }}
          className={clsx(
            'w-[30px] h-[30px] rounded-full flex-shrink-0 z-10',
            'flex items-center justify-center text-[0.68rem] font-bold text-white',
            'bg-gradient-to-br from-cyan-400 to-violet-400',
            'shadow-lg shadow-cyan-400/20'
          )}
        >
          {item.dot}
        </motion.div>

        {/* Connector line — draws downward when row enters viewport */}
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{
              width: 1, flex: 1, marginTop: 4, minHeight: 32,
              transformOrigin: 'top',
              background: isDark
                ? 'linear-gradient(to bottom, rgba(99,179,237,0.3), rgba(255,255,255,0.06))'
                : 'linear-gradient(to bottom, rgba(99,179,237,0.4), rgba(0,0,0,0.06))',
            }}
          />
        )}
      </div>

      {/* ── Right column: content slides in from left ── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.45, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="pt-1 pb-6"
      >
        <div className="font-mono text-xs text-cyan-400 mb-1">{item.year}</div>
        <div className="font-display font-bold text-sm">{item.title}</div>
        <div className={clsx('text-sm mt-1', isDark ? 'text-slate-400' : 'text-slate-500')}>
          {item.sub}
        </div>
        {item.tags && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {item.tags.map(t => (
              <span key={t} className={clsx(
                'px-2 py-0.5 rounded-md text-[0.68rem] font-mono',
                isDark ? 'bg-white/[0.06] text-slate-400' : 'bg-black/[0.05] text-slate-500'
              )}>
                {t}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default function About({ isDark }) {
  const surface  = isDark ? 'bg-white/[0.04] border-white/[0.08]'   : 'bg-white border-black/[0.08] shadow-sm'
  const surfaceHover = isDark
    ? 'hover:border-cyan-400/25 hover:shadow-lg hover:shadow-cyan-400/[0.07]'
    : 'hover:border-cyan-300/60 hover:shadow-md'

  return (
    <section
      id="about"
      className={clsx('py-28', isDark ? 'bg-navy-800/40' : 'bg-slate-100/60')}
    >
      <div className="max-w-6xl mx-auto px-6">

        {/* ── Section Header ──────────────────────────── */}
        <FadeUp>
          <SectionLabel isDark={isDark} number="01" label="Who I am" />
          <SectionTitle>About Me</SectionTitle>
        </FadeUp>

        {/* ── Two-column grid ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 mt-14">

          {/* ── LEFT: Bio + Cards ─────────────────────── */}
          <div>
            <FadeUp delay={0.05}>
              <p className={clsx('text-base leading-[1.9] mb-4', isDark ? 'text-slate-400' : 'text-slate-600')}>
                {personal.aboutLong}
              </p>
              <p className={clsx('text-sm leading-[1.9] mb-8', isDark ? 'text-slate-500' : 'text-slate-500')}>
                {personal.aboutExtra}
              </p>
            </FadeUp>

            {/* Achievements card */}
            <FadeUp delay={0.1}>
              <div className={clsx('rounded-2xl border p-6 mb-4 transition-all duration-300', surface, surfaceHover)}>
                <div className="text-2xl mb-3">🏆</div>
                <h3 className="font-display font-bold text-sm mb-3">Achievements</h3>
                <ul className="space-y-2">
                  {achievements.map(a => (
                    <li key={a} className={clsx(
                      'flex items-start gap-2.5 text-sm',
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    )}>
                      {/* Arrow bullet */}
                      <span className="text-cyan-400 font-mono mt-0.5 flex-shrink-0">→</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>

            {/* Certifications card */}
            <FadeUp delay={0.15}>
              <div className={clsx('rounded-2xl border p-6 transition-all duration-300', surface, surfaceHover)}>
                <div className="text-2xl mb-3">🎓</div>
                <h3 className="font-display font-bold text-sm mb-3">Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {certifications.map(cert => (
                    <span
                      key={cert}
                      className={clsx(
                        'px-3 py-1 rounded-lg text-xs font-medium font-mono',
                        isDark
                          ? 'bg-cyan-400/10 border border-cyan-400/25 text-cyan-400'
                          : 'bg-cyan-50 border border-cyan-200 text-cyan-700'
                      )}
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>

          {/* ── RIGHT: Timeline ───────────────────────── */}
          <div>
            <FadeUp delay={0.05}>
              <p className={clsx(
                'font-mono text-xs uppercase tracking-[0.12em] mb-6',
                isDark ? 'text-slate-500' : 'text-slate-400'
              )}>
                Experience &amp; Education
              </p>

              {/* Animated timeline — each item draws itself in */}
              <div>
                {experience.map((item, i) => (
                  <TimelineItem
                    key={i}
                    item={item}
                    index={i}
                    isDark={isDark}
                    isLast={i === experience.length - 1}
                  />
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  )
}