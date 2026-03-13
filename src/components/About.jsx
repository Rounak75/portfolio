import { useInView } from 'react-intersection-observer'
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion'
import { Briefcase, GraduationCap, Camera, Users, Calendar } from 'lucide-react'
import { personal, experience, achievements, certifications } from '../data/personal.js'
import { SectionLabel, SectionTitle } from './ui/SectionHeader.jsx'
import clsx from 'clsx'

function FadeUp({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function getIcon(dot) {
  if (['🎓','📘','📗'].includes(dot)) return GraduationCap
  if (dot === '📷') return Camera
  if (dot === 'G' || dot === 'I') return Users
  return Briefcase
}

function TimelineCard({ item, index, isDark, isLast }) {
  const [ref, inView] = useInView({ threshold: 0.15, triggerOnce: true })
  const Icon = getIcon(item.dot)

  const mouseX  = useMotionValue(0)
  const mouseY  = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 })
  const glareX  = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%'])
  const glareY  = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%'])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width  - 0.5)
    mouseY.set((e.clientY - rect.top)  / rect.height - 0.5)
  }
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0) }

  const delay = index * 0.1

  return (
    <div ref={ref} className="relative flex flex-col items-center">
      <div style={{ perspective: 800 }} className="w-full">
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          initial={{ opacity: 0, y: 50, scale: 0.94, filter: 'blur(8px)' }}
          animate={inView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
          className={clsx(
            'relative w-full rounded-2xl border p-5 overflow-hidden cursor-default group',
            'transition-shadow duration-300',
            isDark
              ? 'bg-white/[0.04] border-white/[0.08] hover:border-cyan-400/35 hover:shadow-2xl hover:shadow-cyan-400/[0.08]'
              : 'bg-white border-black/[0.07] shadow-sm hover:border-cyan-300/60 hover:shadow-xl hover:shadow-cyan-400/10'
          )}
        >
          {/* Glare overlay */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl z-10"
            style={{
              background: useTransform(
                [glareX, glareY],
                ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.07) 0%, transparent 60%)`
              ),
            }}
          />

          {/* Hover glow */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(99,179,237,0.05) 0%, transparent 70%)' }}
          />

          {/* Top row: icon + year */}
          <div className="flex items-center justify-between mb-3 relative z-10">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={inView ? { scale: 1, rotate: 0 } : {}}
              transition={{ type: 'spring', stiffness: 350, damping: 20, delay: delay + 0.15 }}
              className={clsx(
                'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
                'bg-gradient-to-br from-cyan-400/20 to-violet-400/20 border',
                isDark ? 'border-cyan-400/25' : 'border-cyan-300/40'
              )}
            >
              {['🎓','📘','📗','📷'].includes(item.dot)
                ? <span className="text-base leading-none">{item.dot}</span>
                : <Icon size={15} className="text-cyan-400" />
              }
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: delay + 0.2, ease: [0.22, 1, 0.36, 1] }}
              className={clsx(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.65rem] font-mono',
                isDark
                  ? 'bg-white/[0.05] border border-white/[0.08] text-slate-500'
                  : 'bg-black/[0.04] border border-black/[0.07] text-slate-400'
              )}
            >
              <Calendar size={9} />{item.year}
            </motion.div>
          </div>

          {/* Title */}
          <motion.h3
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: delay + 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-bold text-sm leading-snug mb-1 relative z-10"
          >
            {item.title}
          </motion.h3>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: delay + 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={clsx('text-xs leading-relaxed relative z-10', isDark ? 'text-slate-400' : 'text-slate-500')}
          >
            {item.sub}
          </motion.p>

          {/* Tags */}
          {item.tags && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: delay + 0.35 }}
              className="flex flex-wrap gap-1.5 mt-3 relative z-10"
            >
              {item.tags.map((t, ti) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: delay + 0.35 + ti * 0.05 }}
                  className={clsx(
                    'px-2 py-0.5 rounded-md text-[0.65rem] font-mono',
                    isDark
                      ? 'bg-cyan-400/10 border border-cyan-400/20 text-cyan-400'
                      : 'bg-cyan-50 border border-cyan-200 text-cyan-700'
                  )}
                >
                  {t}
                </motion.span>
              ))}
            </motion.div>
          )}

          {/* Bottom accent line — single style prop (bug fix) */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: delay + 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
            style={{
              background: 'linear-gradient(to right, #63b3ed, #a78bfa, transparent)',
              transformOrigin: 'left',
            }}
          />
        </motion.div>
      </div>

      {/* Connector line between cards */}
      {!isLast && (
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={inView ? { scaleY: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: delay + 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: 1,
            minHeight: 24,
            transformOrigin: 'top',
            background: isDark
              ? 'linear-gradient(to bottom, rgba(99,179,237,0.5), rgba(167,139,250,0.1))'
              : 'linear-gradient(to bottom, rgba(99,179,237,0.6), rgba(167,139,250,0.15))',
          }}
        />
      )}
    </div>
  )
}

export default function About({ isDark }) {
  const surface = isDark
    ? 'bg-white/[0.04] border-white/[0.08]'
    : 'bg-white border-black/[0.08] shadow-sm'
  const surfaceHover = isDark
    ? 'hover:border-cyan-400/25 hover:shadow-lg hover:shadow-cyan-400/[0.07]'
    : 'hover:border-cyan-300/60 hover:shadow-md'

  return (
    <section id="about" className={clsx('py-28', isDark ? 'bg-navy-800/40' : 'bg-slate-100/60')}>
      <div className="max-w-6xl mx-auto px-6">

        <FadeUp>
          <SectionLabel isDark={isDark} number="01" label="Who I am" />
          <SectionTitle>About Me</SectionTitle>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 mt-14">

          {/* LEFT */}
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
                  {achievements.map((a, i) => (
                    <motion.li
                      key={a}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                      className={clsx('flex items-start gap-2.5 text-sm', isDark ? 'text-slate-400' : 'text-slate-600')}
                    >
                      <span className="text-cyan-400 font-mono mt-0.5 flex-shrink-0">→</span>
                      {a}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className={clsx('rounded-2xl border p-6 transition-all duration-300', surface, surfaceHover)}>
                <div className="text-2xl mb-3">🎓</div>
                <h3 className="font-display font-bold text-sm mb-3">Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {certifications.map((cert, i) => (
                    <motion.span
                      key={cert}
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      className={clsx(
                        'px-3 py-1 rounded-lg text-xs font-medium font-mono',
                        isDark
                          ? 'bg-cyan-400/10 border border-cyan-400/25 text-cyan-400'
                          : 'bg-cyan-50 border border-cyan-200 text-cyan-700'
                      )}
                    >
                      {cert}
                    </motion.span>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>

          {/* RIGHT — timeline */}
          <div>
            <FadeUp delay={0.05}>
              <p className={clsx('font-mono text-xs uppercase tracking-[0.12em] mb-6', isDark ? 'text-slate-500' : 'text-slate-400')}>
                Experience &amp; Education
              </p>
            </FadeUp>

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