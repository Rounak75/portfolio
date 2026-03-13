import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Mail, Eye, EyeOff, ExternalLink, ChevronDown } from 'lucide-react'
import { personal } from '../data/personal.js'
import { SectionLabel, SectionTitle } from './ui/SectionHeader.jsx'
import clsx from 'clsx'

export default function Resume({ isDark }) {
  const [pdfOpen, setPdfOpen] = useState(false)

  return (
    <section id="resume" className="py-28">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <SectionLabel isDark={isDark} number="04" label="Get my CV" />
          <SectionTitle>Resume</SectionTitle>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className={clsx(
            'max-w-2xl mx-auto mt-14 rounded-3xl border overflow-hidden transition-all duration-300',
            isDark
              ? 'bg-white/[0.04] border-white/[0.08]'
              : 'bg-white border-black/[0.07] shadow-md'
          )}
        >
          {/* Top info */}
          <div className="p-10 text-center">
            <div className="text-5xl mb-5">📄</div>

            <h3 className="font-display font-extrabold text-xl mb-3">
              {personal.name}
            </h3>

            <p className={clsx('text-sm mb-8 leading-relaxed', isDark ? 'text-slate-400' : 'text-slate-500')}>
              B.Tech CSE · SOA ITER · Batch of 2028<br />
              AI Developer · Full Stack · Competitive Programmer
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">

              <button
                onClick={() => setPdfOpen(o => !o)}
                className={clsx(
                  'flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm border transition-all duration-200 hover:-translate-y-0.5',
                  pdfOpen
                    ? isDark
                      ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-500'
                      : 'bg-cyan-50 border-cyan-300 text-cyan-700'
                    : isDark
                      ? 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:bg-white/[0.08] hover:border-yellow-500/30'
                      : 'bg-black/[0.04] border-black/[0.07] text-slate-600 hover:bg-black/[0.07]'
                )}
              >
                {pdfOpen ? <EyeOff size={15} /> : <Eye size={15} />}
                {pdfOpen ? 'Hide Preview' : 'Preview Resume'}
              </button>

              <a
                href={personal.resumeUrl}
                download
                className="btn-shimmer flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-yellow-600 to-yellow-400 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-yellow-500/25 transition-all duration-200"
              >
                <Download size={15} />
                Download
              </a>

              <a
                href={personal.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={clsx(
                  'flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm border transition-all duration-200 hover:-translate-y-0.5',
                  isDark
                    ? 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:bg-white/[0.08] hover:border-yellow-500/30'
                    : 'bg-black/[0.04] border-black/[0.07] text-slate-600 hover:bg-black/[0.07]'
                )}
              >
                <ExternalLink size={15} />
                Open in Tab
              </a>

              <a
                href={personal.socials.email}
                className={clsx(
                  'flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm border transition-all duration-200 hover:-translate-y-0.5',
                  isDark
                    ? 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:bg-white/[0.08] hover:border-yellow-500/30'
                    : 'bg-black/[0.04] border-black/[0.07] text-slate-600 hover:bg-black/[0.07]'
                )}
              >
                <Mail size={15} />
                Get in Touch
              </a>
            </div>

            {!pdfOpen && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={clsx('flex items-center justify-center gap-1.5 mt-5 text-xs font-mono',
                  isDark ? 'text-slate-600' : 'text-slate-400')}
              >
                <ChevronDown size={12} />
                click preview to read inline
              </motion.div>
            )}
          </div>

          {/* PDF viewer */}
          <AnimatePresence>
            {pdfOpen && (
              <motion.div
                key="pdf"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className={clsx('h-px mx-8', isDark ? 'bg-white/[0.07]' : 'bg-black/[0.07]')} />

                <div className="p-3 md:p-4">
                  <iframe
                    src={`${personal.resumeUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                    className="w-full rounded-2xl"
                    style={{ height: 'min(720px, 60vh', border: 'none' }}
                    title="Resume Preview"
                  />
                </div>

                <div className="px-6 md:px-10 pb-8 pt-2 text-center">
                  <a
                    href={personal.resumeUrl}
                    download
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-yellow-600 to-yellow-400 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-yellow-500/25 transition-all duration-200"
                  >
                    <Download size={14} />
                    Download a copy
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </section>
  )
}