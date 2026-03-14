// ═══════════════════════════════════════════════════════
// src/components/Hero.jsx
// ═══════════════════════════════════════════════════════

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Github, Linkedin, Twitter, Mail, Download, ArrowRight } from 'lucide-react'
import { personal } from '../data/personal.js'
import { useTypewriter } from '../hooks/useTypewriter.js'
import clsx from 'clsx'

const TYPEWRITER_WORDS = [
  'AI Developer',
  'Python Engineer',
  'ML Enthusiast',
  'Full Stack Dev',
  'Problem Solver',
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
}

const itemVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.4,0,0.2,1] } }
}

const SOCIALS = [
  { icon: Github,   label: 'GitHub',   href: personal.socials.github   },
  { icon: Linkedin, label: 'LinkedIn', href: personal.socials.linkedin  },
  { icon: Mail,     label: 'Email',    href: personal.socials.email     },
  { icon: Twitter,  label: 'Twitter',  href: personal.socials.twitter   },
]

const CHIPS = [
  { text: '🤖 AI Developer',  pos: 'top-[-14px] right-[-16px]',  delay: 0,   accent: 'cyan'   },
  { text: '🐍 Python Expert', pos: 'bottom-[30px] left-[-28px]', delay: 1.4, accent: 'violet' },
  { text: '⚡ Full Stack',    pos: 'bottom-[-14px] right-[16px]', delay: 0.7, accent: 'green'  },
]

// ── Exact official Suzuka circuit SVG path ────────────
const SUZUKA_D = "M189.142857,4 C227.456875,4 248.420457,4.00974888 256.864191,4.00974888 C263.817211,4.00974888 271.61219,3.69583517 274.986231,6.63061513 C276.382736,7.84531176 279.193529,11.3814152 280.479499,13.4815847 C281.719344,15.5064248 284.841964,20.3571626 275.608629,20.3571626 C265.817756,20.3571626 247.262478,19.9013915 243.955117,19.9013915 C239.27946,19.9013915 235.350655,24.7304885 228.6344,24.7304885 C224.377263,24.7304885 219.472178,21.0304113 214.535324,21.0304113 C207.18393,21.0304113 200.882842,30.4798911 194.124187,30.4798911 C186.992968,30.4798911 182.652552,23.6245972 173.457298,23.6245972 C164.83277,23.6245972 157.191045,31.5424105 157.191045,39.1815359 C157.191045,48.466779 167.088672,63.6623005 166.666679,66.9065088 C166.378668,69.1206889 155.842137,79.2568633 151.508744,77.8570506 C145.044576,75.7689355 109.126667,61.6405346 98.7556561,52.9785141 C96.4766876,51.0750861 89.3680347,39.5769094 83.4195005,38.5221785 C80.6048001,38.0231057 73.0179337,38.7426555 74.4158694,42.6956376 C76.7088819,49.1796531 86.3280337,64.1214904 87.1781062,66.9065088 C88.191957,70.2280995 86.4690152,77.0567847 82.2060607,79.2503488 C79.2489435,80.7719756 73.1324132,82.8858479 64.7015706,83.0708761 C55.1604808,83.2802705 44.4254811,80.401884 39.1722168,80.401884 C25.7762119,80.401884 24.3280517,89.1260466 22.476679,94.4501705 C21.637667,96.8629767 20.4337535,108 33.2301959,108 C37.8976087,108 45.0757044,107.252595 53.4789069,103.876424 C61.8821095,100.500252 122.090049,78.119656 128.36127,75.3523302 C141.413669,69.5926477 151.190142,68.4987755 147.018529,52.0784879 C143.007818,36.291544 143.396957,23.4057975 145.221196,19.6589263 C146.450194,17.1346449 148.420955,14.8552817 153.206723,15.7880203 C155.175319,16.1716965 155.097637,15.0525421 156.757598,11.3860986 C158.417558,7.71965506 161.842736,4.00974888 167.736963,4.00974888 C177.205308,4.00974888 184.938832,4 189.142857,4 Z"

// ── Suzuka Track Component ────────────────────────────
function SuzukaTrack({ isDark }) {
  const pathRef  = useRef(null)
  const rafRef   = useRef(null)
  const tRef     = useRef(0)
  const lastRef  = useRef(null)
  const [ready,  setReady]  = useState(false)
  const [pos,    setPos]    = useState({ x: 189, y: 4 })
  const [trail,  setTrail]  = useState([])
  const [dashOffset, setDashOffset] = useState(800)
  const totalRef = useRef(800)

  useEffect(() => {
    const path = pathRef.current
    if (!path) return

    // Safe — called after mount so path is in DOM
    try {
      totalRef.current = path.getTotalLength()
      setDashOffset(totalRef.current)
      setReady(true)
    } catch (e) {
      return
    }

    const drawDuration = 1800 // ms to draw full track
    const lapDuration  = 6000 // ms per lap
    const drawStart    = performance.now()

    function tick(now) {
      if (!lastRef.current) lastRef.current = now
      const delta = now - lastRef.current
      lastRef.current = now

      // Draw track in
      const drawFrac = Math.min((now - drawStart) / drawDuration, 1)
      setDashOffset(totalRef.current * (1 - drawFrac))

      // Move comet
      tRef.current = (tRef.current + delta / lapDuration) % 1
      try {
        const pt = path.getPointAtLength(tRef.current * totalRef.current)
        setPos({ x: pt.x, y: pt.y })
        setTrail(prev => [...prev, { x: pt.x, y: pt.y }].slice(-18))
      } catch (e) {
        // ignore
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const trackStroke = isDark ? 'rgba(240,192,96,0.45)' : 'rgba(160,100,0,0.85)'
  const trackBg     = isDark ? 'rgba(240,192,96,0.12)' : 'rgba(160,100,0,0.18)'
  return (
    <div className="hidden md:flex justify-center mt-12">
      <svg
        viewBox="0 0 304 112"
        width="304"
        height="112"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <filter id="sz-glow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track background — always visible */}
        <path
          d={SUZUKA_D}
          fill="none"
          stroke={trackBg}
          strokeWidth="8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Track line — draws itself in */}
        <path
          ref={pathRef}
          d={SUZUKA_D}
          fill="none"
          stroke={trackStroke}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={totalRef.current}
          strokeDashoffset={dashOffset}
        />

        {/* Start/finish line */}
        <line x1="189" y1="1" x2="189" y2="9"
          stroke={isDark ? 'rgba(255,255,255,0.5)' : 'rgba(120,70,0,0.9)'} strokeWidth="2" />

        {/* Only render comet after path is ready */}
        {ready && (
          <>
            {/* Tail */}
            {trail.map((p, i) => (
              <circle
                key={i}
                cx={p.x} cy={p.y}
                r={(i / trail.length) * 3.5}
                fill={isDark ? `rgba(240,192,96,${(i / trail.length) * 0.75})` : `rgba(180,110,0,${(i / trail.length) * 0.85})`}
              />
            ))}

            {/* Head glow */}
            <circle cx={pos.x} cy={pos.y} r={4.5}
              fill={isDark ? '#f0c060' : '#b87800'} filter="url(#sz-glow)" />

            {/* Head core */}
            <circle cx={pos.x} cy={pos.y} r={2}
              fill="#ffffff" />
          </>
        )}
      </svg>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
export default function Hero({ isDark }) {
  const typedText = useTypewriter(TYPEWRITER_WORDS, {
    typeSpeed:   75,
    deleteSpeed: 40,
    pauseTime:  1800,
  })

  return (
    <section id="hero" className="min-h-screen flex items-center pt-20 pb-14 md:pt-24 md:pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 md:gap-16 items-center">

          {/* ── LEFT: Text ──────────────────────────────── */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">

            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-7">
              <span className={clsx(
                'inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-semibold',
                'border font-mono tracking-wide',
                isDark
                  ? 'bg-white/[0.04] border-yellow-500/30 text-yellow-500'
                  : 'bg-green-50 border-green-200 text-green-700'
              )}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse2 shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
                Open to opportunities &amp; collaborations
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="font-display font-extrabold leading-[1.05] tracking-tight"
              style={{ fontSize: 'clamp(2.6rem, 6vw, 4.8rem)' }}
            >
              {personal.name.split(' ')[0]}
              <br />
              <span className="gradient-text">
                {personal.name.split(' ').slice(1).join(' ')}
              </span>
            </motion.h1>

            {/* Typewriter */}
            <motion.div
              variants={itemVariants}
              className={clsx(
                'flex items-center gap-2 text-lg mt-4 mb-5 font-medium h-7',
                isDark ? 'text-slate-400' : 'text-slate-500'
              )}
            >
              <span>I am a</span>
              <span className="font-semibold" style={{
                background: 'linear-gradient(135deg, #d4a843, #f0c060)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {typedText}
              </span>
              <motion.span
                className="font-light text-yellow-500"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
              >|</motion.span>
            </motion.div>

            {/* Bio */}
            <motion.p
              variants={itemVariants}
              className={clsx('text-base leading-relaxed max-w-xl',
                isDark ? 'text-slate-500' : 'text-slate-600')}
            >
              {personal.bio}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mt-6 md:mt-9">
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
                View Projects <ArrowRight size={15} />
              </a>
            </motion.div>

            {/* Social Icons */}
            <motion.div variants={itemVariants} className="flex gap-3 mt-6 md:mt-9">
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
                      : 'bg-black/[0.04] border-black/[0.08] text-slate-500 hover:text-yellow-600 hover:border-yellow-400/60 hover:bg-amber-50'
                  )}
                >
                  <Icon size={16} />
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Avatar + Suzuka Track ──────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center order-first lg:order-last mb-4 lg:mb-0"
          >
            {/* Avatar card */}
            <div className="relative mx-8 sm:mx-0">
              <div className={clsx(
                'w-[280px] h-[280px] lg:w-[320px] lg:h-[320px] rounded-[28px]',
                'border flex flex-col items-center justify-center',
                'relative overflow-hidden',
                isDark
                  ? 'bg-[#0a0a0a] border-yellow-500/25 shadow-[0_0_60px_rgba(212,168,67,0.12),0_0_100px_rgba(167,139,250,0.1)]'
                  : 'bg-stone-900 border-yellow-500/25 shadow-[0_0_40px_rgba(212,168,67,0.12)]'
              )}>
                <div className={clsx(
                  'absolute inset-0',
                  isDark
                    ? 'bg-gradient-to-br from-yellow-500/[0.08] to-yellow-600/[0.04]'
                    : 'bg-gradient-to-br from-yellow-500/[0.08] to-yellow-600/[0.04]'
                )} />
                <div className="relative z-10 text-center">
                  <div
                    className="font-display font-extrabold gradient-text leading-none"
                    style={{ fontSize: '5rem' }}
                  >
                    {personal.initials}
                  </div>
                  <div className="font-mono text-[0.7rem] tracking-[0.2em] uppercase mt-2 text-slate-500">
                    AI Developer
                  </div>
                </div>
              </div>

              {/* Floating Chips */}
              {CHIPS.map(chip => (
                <motion.div
                  key={chip.text}
                  className={clsx(
                    'absolute px-3 py-2 rounded-xl text-[0.72rem] font-semibold',
                    'border backdrop-blur-md whitespace-nowrap',
                    chip.pos,
                    isDark
                      ? chip.accent === 'cyan'
                        ? 'bg-[#0a0a0a] border-yellow-500/35 text-yellow-400 shadow-md'
                        : chip.accent === 'violet'
                          ? 'bg-[#0a0a0a] border-yellow-500/25 text-yellow-300 shadow-md'
                          : 'bg-[#0a0a0a] border-emerald-400/30 text-emerald-400 shadow-md'
                      : chip.accent === 'cyan'
                        ? 'bg-black/70 border-yellow-500/35 text-yellow-400 shadow-md'
                        : chip.accent === 'violet'
                          ? 'bg-black/70 border-yellow-500/25 text-yellow-300 shadow-md'
                          : 'bg-black/70 border-emerald-400/30 text-emerald-400 shadow-md'
                  )}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, delay: chip.delay, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {chip.text}
                </motion.div>
              ))}
            </div>

            {/* Suzuka F1 Circuit — below avatar, desktop only */}
            <SuzukaTrack isDark={isDark} />

          </motion.div>

        </div>
      </div>
    </section>
  )
}