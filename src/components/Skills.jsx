// ═══════════════════════════════════════════════════════
// src/components/Skills.jsx
//
// SKILLS SECTION
//
// Features:
//  • Animated progress bars (trigger on scroll into view)
//  • Tech stack chip row
//  • All data comes from src/data/personal.js
// ═══════════════════════════════════════════════════════

import { useInView } from 'react-intersection-observer'
import { motion }    from 'framer-motion'
import { skills, techStack } from '../data/personal.js'
import { SectionLabel, SectionTitle, SectionDesc } from './ui/SectionHeader.jsx'
import clsx from 'clsx'

// ── Single animated skill bar ─────────────────────────
// The bar width animates from 0% → target% when it enters view
function SkillBar({ skill, isDark, inView }) {
  return (
    <div className={clsx(
      'rounded-2xl border p-5 transition-all duration-300',
      isDark
        ? 'bg-white/[0.04] border-white/[0.08] hover:border-yellow-500/25 hover:shadow-lg hover:shadow-cyan-400/[0.07]'
        : 'bg-white border-black/[0.07] shadow-sm hover:border-yellow-500-300/50 hover:shadow-md'
    )}>
      {/* Top row: icon + name + percentage */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          {/* Emoji icon */}
          <span className={clsx(
            'w-8 h-8 rounded-lg flex items-center justify-center text-lg',
            isDark ? 'bg-white/[0.06]' : 'bg-black/[0.04]'
          )}>
            {skill.emoji}
          </span>
          <span className="font-semibold text-sm">{skill.name}</span>
        </div>
        {/* Percentage label */}
        <span className="font-mono text-xs font-semibold text-yellow-500">
          {skill.pct}%
        </span>
      </div>

      {/* Bar track */}
      <div className={clsx(
        'h-1.5 rounded-full overflow-hidden',
        isDark ? 'bg-white/[0.08]' : 'bg-black/[0.07]'
      )}>
        {/* Animated fill — width goes 0 → pct when inView */}
        <motion.div
          className="skill-fill"
          initial={{ width: 0 }}
          animate={{ width: inView ? `${skill.pct}%` : '0%' }}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.4,0,0.2,1] }}
        />
      </div>
    </div>
  )
}

export default function Skills({ isDark }) {
  // Watch the section — when it scrolls into view, trigger bar animations
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section id="skills" className="py-16 md:py-28" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <SectionLabel isDark={isDark} number="02" label="What I know" />
          <SectionTitle>Skills &amp; Technologies</SectionTitle>
          <SectionDesc isDark={isDark}>
            A blend of AI/ML expertise with full-stack development capabilities.
          </SectionDesc>
        </motion.div>

        {/* Skills grid — 3 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <SkillBar skill={skill} isDark={isDark} inView={inView} />
            </motion.div>
          ))}
        </div>

        {/* ── Tech chip row ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-3 mt-12"
        >
          {techStack.map((chip, i) => (
            <motion.span
              key={chip}
              // Stagger each chip's entrance
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -3, scale: 1.04 }}
              className={clsx(
                'px-4 py-2 rounded-full text-sm font-medium cursor-default',
                'border transition-all duration-200',
                isDark
                  ? 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:border-yellow-500/30 hover:text-yellow-500 hover:shadow-md hover:shadow-cyan-400/10'
                  : 'bg-white border-black/[0.08] text-slate-600 hover:border-yellow-500-300 hover:text-cyan-600 hover:shadow-sm'
              )}
            >
              {chip}
            </motion.span>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
