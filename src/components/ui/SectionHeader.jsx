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

// Small monospaced label above the main title
// e.g. "01 — Who I am"
export function SectionLabel({ isDark, number, label }) {
  return (
    <div className={clsx(
      'flex items-center gap-3 font-mono text-xs uppercase tracking-[0.15em] mb-3',
      isDark ? 'text-cyan-400' : 'text-cyan-500'
    )}>
      {/* Number + dash */}
      <span>{number} —</span>
      <span>{label}</span>
      {/* Decorative line */}
      <span className={clsx(
        'w-10 h-px',
        isDark ? 'bg-cyan-400/40' : 'bg-cyan-400/60'
      )} />
    </div>
  )
}

// Large display heading
// ✏️ CHANGE: Just put your section title as children
export function SectionTitle({ children, className = '' }) {
  return (
    <h2 className={clsx(
      'font-display font-extrabold tracking-tight leading-tight',
      className
    )}
    style={{ fontSize: 'clamp(1.9rem, 4vw, 2.75rem)' }}
    >
      {children}
    </h2>
  )
}

// Optional description paragraph below the title
export function SectionDesc({ children, isDark, className = '' }) {
  return (
    <p className={clsx(
      'text-base mt-3 max-w-xl',
      isDark ? 'text-slate-400' : 'text-slate-500',
      className
    )}>
      {children}
    </p>
  )
}
