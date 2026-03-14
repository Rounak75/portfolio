// ═══════════════════════════════════════════════════════
// src/components/ui/SectionHeader.jsx
//
// Reusable section label + title components.
// Used at the top of every section.
//
// Usage:
//   <SectionLabel isDark={isDark} number="01" label="Who I am" />
//   <SectionTitle>About Me</SectionTitle>
// ═══════════════════════════════════════════════════════

import clsx from 'clsx'

export function SectionLabel({ isDark, number, label }) {
  return (
    <div className={clsx(
      'flex items-center gap-3 font-mono text-xs uppercase tracking-[0.15em] mb-3',
      isDark ? 'text-yellow-500' : 'text-yellow-600'
    )}>
      <span>{number} —</span>
      <span>{label}</span>
      <span className={clsx(
        'w-10 h-px',
        isDark ? 'bg-yellow-500/40' : 'bg-yellow-600/60'
      )} />
    </div>
  )
}

export function SectionTitle({ children, className = '' }) {
  return (
    <div className="section-3d-header">
      <h2
        className={clsx('font-display font-extrabold tracking-tight leading-tight', className)}
        style={{ fontSize: 'clamp(1.9rem, 4vw, 2.75rem)' }}
      >
        {children}
      </h2>
    </div>
  )
}

export function SectionDesc({ children, isDark, className = '' }) {
  return (
    <p className={clsx(
      'text-base mt-3 max-w-xl',
      isDark ? 'text-slate-400' : 'text-stone-500',
      className
    )}>
      {children}
    </p>
  )
}
