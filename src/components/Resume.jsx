// ═══════════════════════════════════════════════════════
// src/components/Resume.jsx
//
// RESUME SECTION
//
// A centered card with a download button.
//
// ✏️ HOW TO LINK YOUR RESUME PDF:
//   1. Place your PDF file in the /public folder
//      → /public/resume.pdf
//   2. The resumeUrl in personal.js already points to '/resume.pdf'
//   3. That's it! The download button will work automatically.
// ═══════════════════════════════════════════════════════

import { motion } from 'framer-motion'
import { Download, Mail } from 'lucide-react'
import { personal } from '../data/personal.js'
import { SectionLabel, SectionTitle } from './ui/SectionHeader.jsx'
import clsx from 'clsx'

export default function Resume({ isDark }) {
  return (
    <section
      id="resume"
      className="py-28"
    >
      <div className="max-w-6xl mx-auto px-6">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <SectionLabel isDark={isDark} number="04" label="Get my CV" />
          <SectionTitle>Resume</SectionTitle>
        </motion.div>

        {/* Resume card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          whileHover={{ boxShadow: isDark
            ? '0 24px 60px rgba(99,179,237,0.12)'
            : '0 24px 50px rgba(99,179,237,0.1)'
          }}
          className={clsx(
            'max-w-xl mx-auto mt-14 p-12 rounded-3xl border text-center',
            'transition-all duration-300',
            isDark
              ? 'bg-white/[0.04] border-white/[0.08] hover:border-cyan-400/25'
              : 'bg-white border-black/[0.07] shadow-md hover:border-cyan-300/50'
          )}
        >
          {/* Doc emoji */}
          <div className="text-5xl mb-5">📄</div>

          {/* Name */}
          <h3 className="font-display font-extrabold text-xl mb-3">
            {personal.name}
          </h3>

          {/* Subtitle */}
          <p className={clsx(
            'text-sm mb-8 leading-relaxed',
            isDark ? 'text-slate-400' : 'text-slate-500'
          )}>
            B.Tech CSE · SOA ITER · Batch of 2028<br />
            AI Developer · Full Stack · Competitive Programmer
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {/* Download — uses HTML download attribute */}
            <a
              href={personal.resumeUrl}
              download
              className="btn-shimmer flex items-center justify-center gap-2
                         px-8 py-3.5 rounded-xl font-semibold text-sm text-white
                         bg-gradient-to-r from-cyan-400 to-violet-400
                         hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-400/25
                         transition-all duration-200"
            >
              <Download size={15} />
              Download Resume
            </a>

            {/* Email shortcut */}
            <a
              href={personal.socials.email}
              className={clsx(
                'flex items-center justify-center gap-2',
                'px-8 py-3.5 rounded-xl font-medium text-sm border transition-all duration-200',
                'hover:-translate-y-0.5',
                isDark
                  ? 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:bg-white/[0.08] hover:border-cyan-400/30'
                  : 'bg-black/[0.04] border-black/[0.07] text-slate-600 hover:bg-black/[0.07]'
              )}
            >
              <Mail size={15} />
              Get in Touch
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
