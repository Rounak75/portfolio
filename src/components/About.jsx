// ═══════════════════════════════════════════════════════
// src/components/About.jsx
//
// ABOUT SECTION
//
// Timeline: each experience/education item is a full
// glassmorphic card that slides in one-by-one as you
// scroll, with a connecting animated line between them.
// ═══════════════════════════════════════════════════════

import { useInView } from 'react-intersection-observer'
import { motion }    from 'framer-motion'
import { Briefcase, GraduationCap, Camera, Users, Calendar } from 'lucide-react'
import { personal, experience, achievements, certifications } from '../data/personal.js'
import { SectionLabel, SectionTitle } from './ui/SectionHeader.jsx'
import clsx from 'clsx'

// ── Fade up wrapper ───────────────────────────────────
function FadeUp({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView({ threshold: 0.12, triggerOnce: true })
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.4,0,0.2,1] }}
    >
      {children}
    </motion.div>
  )
}

// ── Pick an icon based on the dot value ───────────────
function getIcon(dot) {
  if (dot === '🎓' || dot === '📘' || dot === '📗') return GraduationCap
  if (dot === '📷') return Camera
  if (dot === 'G' || dot === 'I')  return Users
  return Briefcase
}

// ── Single timeline card ──────────────────────────────
function TimelineCard({ item, index, isDark, isLast }) {
  const [ref, inView] = useInView({ threshold: 0.18, triggerOnce: true })
  const Icon = getIcon(item.dot)

  // Alternate: even cards slide from left, odd from right
  const fromX = index % 2 === 0 ? -48 : 48

  return (
    <div ref={ref} className="relative flex flex-col items-center">

      {/* ── Card ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: fromX, y: 20 }}
        animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 24,
          delay: 0.05,
        }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className={clsx(
          'w-full rounded-2xl border p-5 transition-colors duration-300 group',
          isDark
            ? 'bg-white/[0.04] border-white/[0.08] hover:border-yellow-500/30 hover:bg-white/[0.07] hover:shadow-xl hover:shadow-yellow-500/[0.06]'
            : 'bg-white border-black/[0.07] shadow-sm hover:border-yellow-500/30 hover:shadow-md'
        )}
      >
        {/* Top row: icon badge + year */}
        <div className="flex items-center justify-between mb-3">
          {/* Icon badge */}
          <div className={clsx(
            'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
            'bg-gradient-to-br from-yellow-600/20 to-yellow-400/20',
            'border',
            isDark ? 'border-yellow-500/25' : 'border-yellow-500/30'
          )}>
            {/* If dot is an emoji, show it; otherwise show the Lucide icon */}
            {['🎓','📘','📗','📷'].includes(item.dot)
              ? <span className="text-base leading-none">{item.dot}</span>
              : <Icon size={15} className="text-yellow-500" />
            }
          </div>

          {/* Year badge */}
          <div className={clsx(
            'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.65rem] font-mono',
            isDark
              ? 'bg-white/[0.05] border border-white/[0.08] text-slate-500'
              : 'bg-black/[0.04] border border-black/[0.07] text-slate-400'
          )}>
            <Calendar size={9} />
            {item.year}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-sm leading-snug mb-1">
          {item.title}
        </h3>

        {/* Subtitle */}
        <p className={clsx('text-xs leading-relaxed', isDark ? 'text-slate-400' : 'text-slate-500')}>
          {item.sub}
        </p>

        {/* Tags */}
        {item.tags && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {item.tags.map(t => (
              <span key={t} className={clsx(
                'px-2 py-0.5 rounded-md text-[0.65rem] font-mono',
                isDark
                  ? 'bg-cyan-400/10 border border-cyan-400/20 text-yellow-500'
                  : 'bg-yellow-50 border border-yellow-300 text-yellow-700'
              )}>
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Subtle left accent bar — grows in on hover */}
        <motion.div
          className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
          style={{
            background: 'linear-gradient(to bottom, #d4a843, #f0c060)',
            scaleY: 0,
            transformOrigin: 'top',
          }}
          whileHover={{ scaleY: 1 }}
          transition={{ duration: 0.25 }}
        />
      </motion.div>

      {/* ── Connector line between cards ──────────────── */}
      {!isLast && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.45, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="w-px my-1"
          style={{
            width: 1,
            minHeight: 28,
            transformOrigin: 'top',
            background: isDark
              ? 'linear-gradient(to bottom, rgba(212,168,67,0.4), rgba(240,192,96,0.15))'
              : 'linear-gradient(to bottom, rgba(212,168,67,0.5), rgba(240,192,96,0.2))',
          }}
        />
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════
export default function About({ isDark }) {
  const surface      = isDark ? 'bg-white/[0.04] border-white/[0.08]' : 'bg-white border-black/[0.08] shadow-sm'
  const surfaceHover = isDark
    ? 'hover:border-yellow-500/25 hover:shadow-lg hover:shadow-yellow-500/[0.07]'
    : 'hover:border-yellow-500/40 hover:shadow-md'

  return (
    <section id="about" className={clsx('py-16 md:py-28', isDark ? 'bg-black/40' : 'bg-gray-50/60')}>
      <div className="max-w-6xl mx-auto px-6">

        <FadeUp>
          <SectionLabel isDark={isDark} number="01" label="Who I am" />
          <SectionTitle>About Me</SectionTitle>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 mt-14">

          {/* ── LEFT: Bio + achievement + cert cards ──── */}
          <div>
            <FadeUp delay={0.05}>
              <p className={clsx('text-base leading-[1.9] mb-4', isDark ? 'text-slate-400' : 'text-slate-600')}>
                {personal.aboutLong}
              </p>
              <p className={clsx('text-sm leading-[1.9] mb-8', isDark ? 'text-slate-500' : 'text-slate-500')}>
                {personal.aboutExtra}
              </p>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className={clsx('rounded-2xl border p-6 mb-4 transition-all duration-300', surface, surfaceHover)}>
                <div className="text-2xl mb-3">🏆</div>
                <h3 className="font-display font-bold text-sm mb-3">Achievements</h3>
                <ul className="space-y-2">
                  {achievements.map(a => (
                    <li key={a} className={clsx('flex items-start gap-2.5 text-sm', isDark ? 'text-slate-400' : 'text-slate-600')}>
                      <span className="text-yellow-500 font-mono mt-0.5 flex-shrink-0">→</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className={clsx('rounded-2xl border p-6 transition-all duration-300', surface, surfaceHover)}>
                <div className="text-2xl mb-3">🎓</div>
                <h3 className="font-display font-bold text-sm mb-3">Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {certifications.map(cert => (
                    <span key={cert} className={clsx(
                      'px-3 py-1 rounded-lg text-xs font-medium font-mono',
                      isDark
                        ? 'bg-cyan-400/10 border border-yellow-500/25 text-yellow-500'
                        : 'bg-yellow-50 border border-yellow-300 text-yellow-700'
                    )}>
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>

          {/* ── RIGHT: Timeline cards ─────────────────── */}
          <div>
            <FadeUp delay={0.05}>
              <p className={clsx('font-mono text-xs uppercase tracking-[0.12em] mb-6', isDark ? 'text-slate-500' : 'text-slate-400')}>
                Experience &amp; Education
              </p>
            </FadeUp>

            {/* Each card reveals itself as you scroll */}
            <div className="flex flex-col items-stretch">
              {experience.map((item, i) => (
                <TimelineCard
                  key={i}
                  item={item}
                  index={i}
                  isDark={isDark}
                  isLast={i === experience.length - 1}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
