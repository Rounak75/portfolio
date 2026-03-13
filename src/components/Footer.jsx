// ═══════════════════════════════════════════════════════
// src/components/Footer.jsx
//
// FOOTER
// Copyright, quick links, social icons.
// ═══════════════════════════════════════════════════════

import { Github, Linkedin, Mail, Twitter } from 'lucide-react'
import { personal } from '../data/personal.js'
import clsx from 'clsx'

const QUICK_LINKS = [
  { label: 'Home',     href: '#hero'     },
  { label: 'About',    href: '#about'    },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact',  href: '#contact'  },
]

const SOCIALS = [
  { icon: Github,   href: personal.socials.github,   label: 'GitHub'   },
  { icon: Linkedin, href: personal.socials.linkedin,  label: 'LinkedIn' },
  { icon: Mail,     href: personal.socials.email,     label: 'Email'    },
  { icon: Twitter,  href: personal.socials.twitter,   label: 'Twitter'  },
]

export default function Footer({ isDark }) {
  return (
    <footer className={clsx(
      'border-t py-10',
      isDark
         ? 'bg-neutral-900/40 border-white/[0.06]'
         : 'bg-amber-50/60 border-amber-200/60'
    )}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo */}
          <a href="#hero" className="font-display font-extrabold text-lg gradient-text">
            {personal.nameShort}.
          </a>

          {/* Quick links */}
          <div className="flex gap-6">
            {QUICK_LINKS.map(l => (
              <a
                key={l.href}
                href={l.href}
                className={clsx(
                  'text-sm transition-colors duration-150',
                  isDark
                    ? 'text-slate-500 hover:text-slate-300'
                    : 'text-stone-400 hover:text-yellow-700'
                )}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Social icons */}
          <div className="flex gap-2">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={label}
                className={clsx(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  'border transition-all duration-200 hover:-translate-y-0.5',
                  isDark
                    ? 'bg-white/[0.04] border-white/[0.07] text-slate-500 hover:text-yellow-500 hover:border-yellow-500/30'
                    : 'bg-white/80 border-amber-200/60 text-stone-400 hover:text-yellow-600 hover:border-yellow-400/60 hover:bg-amber-50'
                )}
              >
                <Icon size={13} />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className={clsx(
          'text-center text-xs mt-8',
          isDark ? 'text-slate-600' : 'text-slate-400'
        )}>
          {/* ✏️ Update year if needed */}
          © 2026 {personal.name}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
