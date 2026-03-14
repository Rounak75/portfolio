// ═══════════════════════════════════════════════════════
// src/components/Skills.jsx
// ═══════════════════════════════════════════════════════

import { useInView } from 'react-intersection-observer'
import { motion }    from 'framer-motion'
import { skills, techStack } from '../data/personal.js'
import { SectionLabel, SectionTitle, SectionDesc } from './ui/SectionHeader.jsx'
import clsx from 'clsx'

// ── Single animated skill bar ─────────────────────────
function SkillBar({ skill, isDark, inView }) {
  return (
    <div className={clsx(
      'rounded-2xl border p-5 transition-all duration-300 card-3d ground-shadow',
      isDark
        ? 'bg-yellow-500/[0.06] border-yellow-500/20 hover:border-yellow-500/45 hover:bg-yellow-500/[0.1] hover:shadow-lg hover:shadow-yellow-500/[0.1]'
        : 'bg-yellow-50/80 border-yellow-300/60 shadow-sm hover:border-yellow-400/70 hover:shadow-md hover:shadow-yellow-200/50'
    )}>
      {/* Top row: logo + name + percentage */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          {/* Real tech logo */}
          <div className={clsx(
            'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
            isDark ? 'bg-white/[0.06]' : 'bg-amber-100/60'
          )}>
            {skill.logo ? (
              <img
                src={skill.logo}
                alt={skill.name}
                width={20}
                height={20}
                style={{
                  filter: isDark && skill.invertDark ? 'invert(1) brightness(1.2)' : 'none',
                }}
                onError={e => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextSibling.style.display = 'flex'
                }}
              />
            ) : (
              <span className="text-lg">{skill.emoji}</span>
            )}
            {/* Fallback emoji hidden by default */}
            <span className="text-lg hidden">{skill.emoji}</span>
          </div>
          <span className="font-semibold text-sm">{skill.name}</span>
        </div>
        <span className="font-mono text-xs font-semibold text-yellow-500">
          {skill.pct}%
        </span>
      </div>

      {/* Bar track */}
      <div className={clsx(
        'h-1.5 rounded-full overflow-hidden',
        isDark ? 'bg-white/[0.08]' : 'bg-amber-100/80'
      )}>
        <motion.div
          className="skill-fill"
          initial={{ width: 0 }}
          animate={{ width: inView ? `${skill.pct}%` : '0%' }}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>
  )
}

export default function Skills({ isDark }) {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section id="skills" className="py-16 md:py-28" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

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

        {/* Skills grid */}
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

        {/* ── Tech chip row — compact, wrapping ──────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-2 mt-10"
        >
          {techStack.map((chip, i) => (
            <motion.div
              key={chip.name}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, type: 'spring', stiffness: 260, damping: 20 }}
              whileHover={{ y: -3, scale: 1.07 }}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-default',
                'border transition-all duration-200',
                isDark
                  ? 'bg-yellow-500/[0.08] border-yellow-500/25 text-yellow-200 hover:bg-yellow-500/[0.15] hover:border-yellow-500/50 hover:text-yellow-300'
                  : 'bg-yellow-50 border-yellow-300/70 text-yellow-800 hover:bg-yellow-100 hover:border-yellow-400 hover:text-yellow-900'
              )}
            >
              <img
                src={chip.logo}
                alt={chip.name}
                width={14}
                height={14}
                className="flex-shrink-0"
                style={{
                  filter: isDark && chip.invertDark ? 'invert(1) brightness(1.2)' : 'none',
                }}
                onError={e => { e.currentTarget.style.display = 'none' }}
              />
              {chip.name}
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}