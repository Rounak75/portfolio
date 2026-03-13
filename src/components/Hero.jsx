// ═══════════════════════════════════════════════════════
// src/components/Hero.jsx
//
// HERO SECTION — the first thing visitors see.
//
// Features:
//  • Staggered entrance animations (Framer Motion)
//  • Floating badge + avatar with floating chips
//  • Download Resume & View Projects CTA buttons
//  • Social icon row
// ═══════════════════════════════════════════════════════

import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, Mail, Download, ArrowRight } from 'lucide-react'
import { personal } from '../data/personal.js'
import { useTypewriter } from '../hooks/useTypewriter.js'
import clsx from 'clsx'

// ✏️ CUSTOMISE: Words the typewriter cycles through.
// Add/remove/reorder freely — they loop automatically.
const TYPEWRITER_WORDS = [
  'AI Developer',
  'Python Engineer',
  'ML Enthusiast',
  'Full Stack Dev',
  'Problem Solver',
]

// ── Framer Motion Variants ────────────────────────────
// Variants let you name animation states and apply them
// to groups of elements with staggering built-in.

// Parent container: staggers children by 0.1s each
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

// Each child: fade up from y=24
const itemVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.4,0,0.2,1] } }
}

// Social links config — ✏️ update hrefs in personal.js
const SOCIALS = [
  { icon: Github,   label: 'GitHub',   href: personal.socials.github   },
  { icon: Linkedin, label: 'LinkedIn', href: personal.socials.linkedin  },
  { icon: Mail,     label: 'Email',    href: personal.socials.email     },
  { icon: Twitter,  label: 'Twitter',  href: personal.socials.twitter   },
]

// Avatar floating chips — appear around the avatar card
// ✏️ Change the text to reflect your key skills
const CHIPS = [
  { text: '🤖 AI Developer',   pos: 'top-[-14px] right-[-16px]', delay: 0,    accent: 'cyan'   },
  { text: '🐍 Python Expert',  pos: 'bottom-[30px] left-[-28px]', delay: 1.4, accent: 'violet' },
  { text: '⚡ Full Stack',     pos: 'bottom-[-14px] right-[16px]', delay: 0.7, accent: 'green'  },
]

export default function Hero({ isDark }) {
  // useTypewriter returns the currently displayed string.
  // It automatically cycles through TYPEWRITER_WORDS above.
  const typedText = useTypewriter(TYPEWRITER_WORDS, {
    typeSpeed:   75,   // ✏️ ms per character typed
    deleteSpeed: 40,   // ✏️ ms per character deleted
    pauseTime:  1800,  // ✏️ ms to pause when word is complete
  })
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center pt-20 pb-16 md:pt-24 md:pb-20"
    >
  <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">

        {/* ── Two-column grid ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 md:gap-16 items-center">

          {/* ── LEFT: Text Content ──────────────────────── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Available badge */}
            <motion.div variants={itemVariants} className="mb-7">
              <span className={clsx(
                'inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-semibold',
                'border font-mono tracking-wide',
                isDark
                  ? 'bg-white/[0.04] border-yellow-500/30 text-yellow-500'
                  : 'bg-cyan-50 border-cyan-300 text-cyan-600'
              )}>
                {/* Pulsing green dot = "online / available" */}
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse2" />
                Open to opportunities &amp; collaborations
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              variants={itemVariants}
              className="font-display font-extrabold leading-[1.05] tracking-tight"
              style={{ fontSize: 'clamp(2.6rem, 6vw, 4.8rem)' }}
            >
              {/* First line: first name in default text color */}
              {personal.name.split(' ')[0]}
              <br />
              {/* Rest of name: gradient */}
              <span className="gradient-text">
                {personal.name.split(' ').slice(1).join(' ')}
              </span>
            </motion.h1>

            {/* Typewriter tagline */}
            <motion.div
              variants={itemVariants}
              className={clsx(
                'flex items-center gap-2 text-lg mt-4 mb-5 font-medium h-7',
                isDark ? 'text-slate-400' : 'text-slate-500'
              )}
            >
              {/* Static prefix */}
              <span>I am a</span>

              {/* Typed text — changes automatically */}
              <span
                className="font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #d4a843, #f0c060)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {typedText}
              </span>

              {/* Blinking cursor — a simple animated pipe character */}
              <motion.span
                className="font-light text-yellow-500"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
              >
                |
              </motion.span>
            </motion.div>

            {/* Bio */}
            <motion.p
              variants={itemVariants}
              className={clsx(
                'text-base leading-relaxed max-w-xl',
                isDark ? 'text-slate-500' : 'text-slate-600'
              )}
            >
              {personal.bio}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex gap-3 mt-9"
            >
              {/* Primary: Download Resume */}
              <a
                href={personal.resumeUrl}
                download
                className="btn-shimmer flex items-center gap-2 px-7 py-3.5 rounded-xl
                           font-semibold text-sm text-white
                           bg-gradient-to-r from-yellow-600 to-yellow-400
                           hover:-translate-y-0.5 hover:shadow-xl hover:shadow-yellow-500/25
                           transition-all duration-200"
              >
                <Download size={15} />
                Download Resume
              </a>

              {/* Secondary: View Projects */}
              <a
                href="#projects"
                className={clsx(
                  'flex items-center gap-2 px-7 py-3.5 rounded-xl font-medium text-sm',
                  'border transition-all duration-200 hover:-translate-y-0.5',
                  isDark
                    ? 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:bg-white/[0.08] hover:border-yellow-500/30'
                    : 'bg-black/[0.04] border-black/[0.08] text-slate-600 hover:bg-black/[0.07] hover:border-yellow-500/50'
                )}
              >
                View Projects
                <ArrowRight size={15} />
              </a>
            </motion.div>

            {/* Social Icons */}
            <motion.div
              variants={itemVariants}
              className="flex gap-3 mt-6 md:mt-9"
            >
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={clsx(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    'border transition-all duration-200 hover:-translate-y-1',
                    isDark
                      ? 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-yellow-500 hover:border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/15'
                      : 'bg-black/[0.04] border-black/[0.08] text-slate-500 hover:text-cyan-500 hover:border-cyan-300 hover:shadow-md'
                  )}
                >
                  <Icon size={16} />
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Avatar Card ──────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            // On mobile, show avatar above the text
            className="flex justify-center order-first lg:order-last mb-4 lg:mb-0"
          >
            <div className="relative mx-8 sm:mx-0">

              {/* Avatar card */}
              <div className={clsx(
                'w-[280px] h-[280px] lg:w-[320px] lg:h-[320px] rounded-[28px]',
                'border flex flex-col items-center justify-center',
                'relative overflow-hidden',
                isDark
                  ? 'bg-neutral-900 border-yellow-500/20 shadow-[0_0_60px_rgba(212,168,67,0.12),0_0_100px_rgba(167,139,250,0.1)]'
                  : 'bg-white border-cyan-300/40 shadow-[0_0_50px_rgba(212,168,67,0.1)]'
              )}>
                {/* Subtle gradient overlay inside card */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/[0.07] to-violet-400/[0.07]" />

                {/* Initials */}
                <div className="relative z-10 text-center">
                  <div
                    className="font-display font-extrabold gradient-text leading-none"
                    style={{ fontSize: '5rem' }}
                  >
                    {personal.initials}
                  </div>
                  <div className={clsx(
                    'font-mono text-[0.7rem] tracking-[0.2em] uppercase mt-2',
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  )}>
                    AI Developer
                  </div>
                </div>
              </div>

              {/* ── Floating Chips around avatar ── */}
              {CHIPS.map(chip => (
                <motion.div
                  key={chip.text}
                  className={clsx(
                    'absolute px-3 py-2 rounded-xl text-[0.72rem] font-semibold',
                    'border backdrop-blur-md whitespace-nowrap',
                    chip.pos,
                    isDark
                      ? chip.accent === 'cyan'
                        ? 'bg-neutral-900/90 border-yellow-500/30 text-yellow-500'
                        : chip.accent === 'violet'
                          ? 'bg-neutral-900/90 border-violet-400/30 text-violet-400'
                          : 'bg-neutral-900/90 border-emerald-400/30 text-emerald-400'
                      : chip.accent === 'cyan'
                        ? 'bg-white/90 border-cyan-300 text-cyan-600 shadow-md'
                        : chip.accent === 'violet'
                          ? 'bg-white/90 border-violet-300 text-violet-600 shadow-md'
                          : 'bg-white/90 border-emerald-300 text-emerald-600 shadow-md'
                  )}
                  // Each chip floats up/down with a different delay
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 3,
                    delay: chip.delay,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  {chip.text}
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}