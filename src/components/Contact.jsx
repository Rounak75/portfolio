// ═══════════════════════════════════════════════════════════════════
// src/components/Contact.jsx  —  with Copy Email button
//
// NEW: The Email contact card has a clipboard copy button.
//   Click the copy icon → email copies to clipboard →
//   icon flips to a ✓ checkmark for 2s → resets.
//
// FORMSPREE SETUP:
//   Replace 'YOUR_FORM_ID' below with your Formspree form ID.
//   Get it free at https://formspree.io
// ═══════════════════════════════════════════════════════════════════

import { useState }  from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Github, Linkedin, Mail, MapPin, Send,
  CheckCircle2, AlertCircle, User, AtSign,
  MessageSquare, Tag, Copy, Check,
} from 'lucide-react'
import { personal }  from '../data/personal.js'
import { SectionLabel, SectionTitle } from './ui/SectionHeader.jsx'
import clsx from 'clsx'

// ✏️ Paste your Formspree form ID here
const FORMSPREE_ID = 'mwvrbnkp'

const FORM_CONFIG = {
  name:    { enabled: true,  required: true,  label: 'Your Name',     placeholder: 'e.g. Priya Sharma',              icon: User          },
  email:   { enabled: true,  required: true,  label: 'Email Address', placeholder: 'hello@example.com',              icon: AtSign        },
  subject: {
    enabled: true, required: false, label: 'Subject',
    placeholder: 'e.g. Internship inquiry…', icon: Tag,
    quickOptions: ['Internship', 'Collaboration', 'Freelance Project', 'Just saying hi 👋'],
  },
  message: { enabled: true,  required: true,  label: 'Message',       placeholder: 'Tell me about your project…',    icon: MessageSquare,
    rows: 5, maxLength: 1000 },
}

const MESSAGES = {
  success: { emoji: '🎉', title: 'Message Sent!',         body: "Thanks for reaching out. I'll get back to you within 24 hours." },
  error:   { emoji: '😕', title: 'Something went wrong',  body: 'Please try again, or email me directly at ' + personal.email    },
}

// ── Email copy card (replaces plain email link) ───────
function EmailCopyCard({ isDark, surface }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e) => {
    e.preventDefault()       // don't open mailto
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(personal.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for browsers that block clipboard API
      const el = document.createElement('textarea')
      el.value = personal.email
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className={clsx('flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-200', surface)}>
      {/* Icon */}
      <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.05]')}>
        <Mail size={16} className="text-yellow-500" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-slate-500 mb-0.5">Email</div>
        <a href={personal.socials.email} className="text-sm font-medium hover:text-yellow-500 transition-colors truncate block">
          {personal.email}
        </a>
      </div>

      {/* Copy button */}
      <motion.button
        onClick={handleCopy}
        aria-label="Copy email address"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={clsx(
          'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200',
          copied
            ? 'bg-emerald-400/15 text-emerald-400'
            : isDark
              ? 'bg-white/[0.06] text-slate-400 hover:bg-yellow-500/15 hover:text-yellow-500'
              : 'bg-black/[0.05] text-slate-400 hover:bg-cyan-50 hover:text-cyan-500'
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span key="check"
              initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }} transition={{ duration: 0.18 }}
            >
              <Check size={13} />
            </motion.span>
          ) : (
            <motion.span key="copy"
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              exit={{ scale: 0 }} transition={{ duration: 0.18 }}
            >
              <Copy size={13} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}

// ── Generic contact card ──────────────────────────────
function ContactCard({ icon: Icon, label, value, href, isDark, surface }) {
  return href ? (
    <a href={href} target={href.startsWith('mailto') ? undefined : '_blank'}
      rel="noopener noreferrer"
      className={clsx('flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-200 hover:translate-x-1', surface, isDark ? 'hover:border-yellow-500/25' : 'hover:border-cyan-300/50')}
    >
      <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.05]')}>
        <Icon size={16} className="text-yellow-500" />
      </div>
      <div>
        <div className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-slate-500 mb-0.5">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </a>
  ) : (
    <div className={clsx('flex items-center gap-4 px-4 py-3.5 rounded-xl border', surface)}>
      <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.05]')}>
        <Icon size={16} className="text-yellow-500" />
      </div>
      <div>
        <div className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-slate-500 mb-0.5">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  )
}

// ── Field helpers ─────────────────────────────────────
function FieldLabel({ config, isDark }) {
  const Icon = config.icon
  return (
    <label className={clsx('flex items-center gap-1.5 text-xs font-semibold tracking-wide', isDark ? 'text-slate-400' : 'text-slate-600')}>
      {Icon && <Icon size={12} className={isDark ? 'text-slate-500' : 'text-slate-400'} />}
      {config.label}
      {config.required && <span className="text-yellow-500 ml-0.5">*</span>}
    </label>
  )
}

function FieldError({ msg }) {
  return (
    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5"
    >
      <AlertCircle size={11} />{msg}
    </motion.p>
  )
}

// ═══════════════════════════════════════════════════════
export default function Contact({ isDark }) {
  const [form,   setForm]   = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const handleChange = e => {
    const { name, value } = e.target
    if (name === 'message' && FORM_CONFIG.message.maxLength > 0 && value.length > FORM_CONFIG.message.maxLength) return
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }))
  }

  const handleQuickOption = opt => {
    setForm(f => ({ ...f, subject: f.subject === opt ? '' : opt }))
    if (errors.subject) setErrors(p => ({ ...p, subject: '' }))
  }

  const validate = () => {
    const e = {}
    if (FORM_CONFIG.name.enabled    && FORM_CONFIG.name.required    && !form.name.trim())    e.name    = 'Name is required'
    if (FORM_CONFIG.email.enabled   && FORM_CONFIG.email.required   && !form.email.trim())   e.email   = 'Email is required'
    else if (FORM_CONFIG.email.enabled && form.email && !/\S+@\S+\.\S+/.test(form.email))     e.email   = 'Enter a valid email'
    if (FORM_CONFIG.message.enabled && FORM_CONFIG.message.required && !form.message.trim()) e.message = 'Message is required'
    return e
  }

  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStatus('loading')
    const payload = {}
    if (FORM_CONFIG.name.enabled)    payload.name    = form.name
    if (FORM_CONFIG.email.enabled)   payload.email   = form.email
    if (FORM_CONFIG.subject.enabled) payload.subject = form.subject
    if (FORM_CONFIG.message.enabled) payload.message = form.message
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) { setStatus('success'); setForm({ name: '', email: '', subject: '', message: '' }) }
      else        { console.error(await res.json()); setStatus('error') }
    } catch (err) { console.error(err); setStatus('error') }
  }

  const handleReset = () => { setStatus('idle'); setErrors({}) }

  const surface  = isDark ? 'bg-white/[0.04] border-white/[0.08]' : 'bg-white/80 border-amber-200/70 shadow-sm'
  const inputCls = field => clsx(
    'w-full px-4 py-3 rounded-xl text-sm border transition-all duration-200 outline-none font-body',
    isDark ? 'bg-black/80 text-slate-100 border-white/[0.1] placeholder:text-slate-600 focus:bg-black'
           : 'bg-amber-50/50 text-stone-900 border-amber-200/70 placeholder:text-stone-400 focus:bg-white',
    errors[field]
      ? 'border-red-400/70 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(248,113,113,0.12)]'
      : isDark ? 'focus:border-yellow-500/60 focus:shadow-[0_0_0_3px_rgba(99,179,237,0.1)]'
               : 'focus:border-yellow-500 focus:shadow-[0_0_0_3px_rgba(99,179,237,0.12)]'
  )

  return (
    <section id="contact" className={clsx('py-16 md:py-28', isDark ? 'bg-white/[0.02]' : 'bg-amber-50/40')}>
      <div className="max-w-6xl mx-auto px-6">

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }}
        >
          <SectionLabel isDark={isDark} number="05" label="Let's connect" />
          <SectionTitle>Get In Touch</SectionTitle>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 mt-14">

          {/* ── LEFT sidebar ──────────────────────────── */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }}
          >
            <h3 className="font-display font-bold text-lg mb-3">Let's build something together</h3>
            <p className={clsx('text-sm leading-relaxed mb-8', isDark ? 'text-slate-400' : 'text-slate-500')}>
              Open to internship opportunities, collaborations, freelance projects,
              and interesting conversations about AI and tech.
            </p>

            <div className="space-y-3">
              {/* Email card with copy button */}
              <EmailCopyCard isDark={isDark} surface={surface} />
              {/* Other contact cards */}
              <ContactCard icon={Linkedin} label="LinkedIn" value="linkedin.com/in/rounakmahato" href={personal.socials.linkedin} isDark={isDark} surface={surface} />
              <ContactCard icon={Github}   label="GitHub"   value="github.com/Rounak75"          href={personal.socials.github}   isDark={isDark} surface={surface} />
              <ContactCard icon={MapPin}   label="Location" value={personal.location}             href={null}                       isDark={isDark} surface={surface} />
            </div>

            <div className={clsx('mt-6 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm',
              isDark ? 'bg-emerald-400/[0.06] border-emerald-400/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            )}>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse2 flex-shrink-0 shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
              Usually responds within 24 hours
            </div>
          </motion.div>

          {/* ── RIGHT form ────────────────────────────── */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: 0.1 }}
            className={clsx('rounded-2xl border p-8', surface)}
          >
            <AnimatePresence mode="wait">

              {/* SUCCESS */}
              {status === 'success' && (
                <motion.div key="success"
                  initial={{ opacity: 0, scale: 0.93, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.93 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                  className="text-center py-10"
                >
                  <div className="text-5xl mb-5">{MESSAGES.success.emoji}</div>
                  <div className={clsx('w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5', isDark ? 'bg-emerald-400/15' : 'bg-emerald-50')}>
                    <CheckCircle2 size={30} className="text-emerald-400" />
                  </div>
                  <h4 className="font-display font-bold text-xl mb-2">{MESSAGES.success.title}</h4>
                  <p className={clsx('text-sm mb-7', isDark ? 'text-slate-400' : 'text-slate-500')}>{MESSAGES.success.body}</p>
                  <button onClick={handleReset} className={clsx('text-xs font-medium px-5 py-2 rounded-xl border transition-all',
                    isDark ? 'border-white/[0.1] text-slate-400 hover:bg-white/[0.06]' : 'border-black/[0.1] text-slate-500 hover:bg-black/[0.05]'
                  )}>Send another message</button>
                </motion.div>
              )}

              {/* ERROR */}
              {status === 'error' && (
                <motion.div key="error"
                  initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="text-center py-10"
                >
                  <div className="text-5xl mb-4">{MESSAGES.error.emoji}</div>
                  <h4 className="font-display font-bold text-lg mb-2">{MESSAGES.error.title}</h4>
                  <p className={clsx('text-sm mb-6', isDark ? 'text-slate-400' : 'text-slate-500')}>{MESSAGES.error.body}</p>
                  <button onClick={handleReset} className="text-sm font-semibold text-yellow-500 hover:text-cyan-300 transition-colors">← Try again</button>
                </motion.div>
              )}

              {/* FORM */}
              {(status === 'idle' || status === 'loading') && (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">

                  {/* NAME */}
                  {FORM_CONFIG.name.enabled && (
                    <div>
                      <FieldLabel config={FORM_CONFIG.name} isDark={isDark} />
                      <div className="mt-2"><input name="name" type="text" value={form.name} onChange={handleChange} placeholder={FORM_CONFIG.name.placeholder} autoComplete="name" className={inputCls('name')} /></div>
                      {errors.name && <FieldError msg={errors.name} />}
                    </div>
                  )}

                  {/* EMAIL */}
                  {FORM_CONFIG.email.enabled && (
                    <div>
                      <FieldLabel config={FORM_CONFIG.email} isDark={isDark} />
                      <div className="mt-2"><input name="email" type="email" value={form.email} onChange={handleChange} placeholder={FORM_CONFIG.email.placeholder} autoComplete="email" className={inputCls('email')} /></div>
                      {errors.email && <FieldError msg={errors.email} />}
                    </div>
                  )}

                  {/* SUBJECT */}
                  {FORM_CONFIG.subject.enabled && (
                    <div>
                      <FieldLabel config={FORM_CONFIG.subject} isDark={isDark} />
                      <div className="mt-2"><input name="subject" type="text" value={form.subject} onChange={handleChange} placeholder={FORM_CONFIG.subject.placeholder} className={inputCls('subject')} /></div>
                      {errors.subject && <FieldError msg={errors.subject} />}
                      {FORM_CONFIG.subject.quickOptions?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {FORM_CONFIG.subject.quickOptions.map(opt => (
                            <button key={opt} type="button" onClick={() => handleQuickOption(opt)}
                              className={clsx('px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150',
                                form.subject === opt
                                  ? 'bg-gradient-to-r from-yellow-600 to-yellow-400 border-transparent text-white'
                                  : isDark
                                    ? 'bg-white/[0.04] border-white/[0.1] text-slate-400 hover:border-yellow-500/30 hover:text-slate-200'
                                    : 'bg-white border-black/[0.1] text-slate-500 hover:border-cyan-300 hover:text-slate-700'
                              )}
                            >{opt}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* MESSAGE */}
                  {FORM_CONFIG.message.enabled && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <FieldLabel config={FORM_CONFIG.message} isDark={isDark} />
                        {FORM_CONFIG.message.maxLength > 0 && (
                          <span className={clsx('font-mono text-[0.65rem]',
                            form.message.length > FORM_CONFIG.message.maxLength * 0.9 ? 'text-amber-400' : isDark ? 'text-slate-600' : 'text-slate-400'
                          )}>{form.message.length}/{FORM_CONFIG.message.maxLength}</span>
                        )}
                      </div>
                      <textarea name="message" value={form.message} onChange={handleChange}
                        placeholder={FORM_CONFIG.message.placeholder} rows={FORM_CONFIG.message.rows}
                        className={clsx(inputCls('message'), 'resize-none')} />
                      {errors.message && <FieldError msg={errors.message} />}
                    </div>
                  )}

                  {/* SUBMIT */}
                  <button onClick={handleSubmit} disabled={status === 'loading'}
                    className={clsx('w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white',
                      'bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-200',
                      status !== 'loading' && 'hover:-translate-y-0.5 hover:shadow-xl hover:shadow-yellow-500/25',
                      'disabled:opacity-60 disabled:cursor-not-allowed'
                    )}
                  >
                    {status === 'loading' ? (
                      <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Sending…</>
                    ) : (
                      <><Send size={14} />Send Message</>
                    )}
                  </button>

                  <p className={clsx('text-center text-[0.7rem]', isDark ? 'text-slate-600' : 'text-slate-400')}>
                    🔒 Your info is only used to reply to you. No spam, ever.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}