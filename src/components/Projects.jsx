// ═══════════════════════════════════════════════════════
// src/components/Projects.jsx
//
// PROJECTS SECTION
//
// Features:
//  • Category filter bar (All / AI / ML / Web / Security)
//  • Animated grid of ProjectCard components
//  • ProjectModal for detailed view
// ═══════════════════════════════════════════════════════

import { useState }         from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { projects, filterCategories } from '../data/projects.js'
import { SectionLabel, SectionTitle, SectionDesc } from './ui/SectionHeader.jsx'
import ProjectCard  from './ProjectCard.jsx'
import clsx from 'clsx'

export default function Projects({ isDark, onPreview }) {
  // Which filter is active — default 'All'
  const [activeFilter, setActiveFilter] = useState('All')

  // Derive filtered list from activeFilter
  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.category.includes(activeFilter))

  return (
    <section
      id="projects"
      className={clsx('py-16 md:py-28', isDark ? 'bg-black/40' : 'bg-amber-50/40')}
    >
      <div className="max-w-6xl mx-auto px-6">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <SectionLabel isDark={isDark} number="03" label="What I've built" />
          <SectionTitle>Projects</SectionTitle>
          <SectionDesc isDark={isDark}>
            From AI systems to full-stack web apps — here's what I've been building.
          </SectionDesc>
        </motion.div>

        {/* ── Filter bar ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap gap-2 mt-10 mb-10"
        >
          {filterCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={clsx(
                'px-5 py-2 rounded-full text-sm font-medium border transition-all duration-200',
                activeFilter === cat
                  // Active: gradient fill
                  ? 'bg-gradient-to-r from-cyan-400 to-violet-400 border-transparent text-white shadow-lg shadow-cyan-400/20'
                  // Inactive: ghost style
                  : isDark
                    ? 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:border-yellow-500/30 hover:text-slate-200'
                    : 'bg-white/80 border-amber-200/60 text-stone-500 hover:border-yellow-500/50 hover:text-yellow-700 hover:bg-amber-50'
              )}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* ── Projects Grid ────────────────────────────── */}
        {/*
          layout prop: when items are added/removed, Framer Motion
          animates the surrounding cards to reposition smoothly.
        */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/*
            AnimatePresence: animates cards in/out when filter changes.
            mode="popLayout" keeps layout shift minimal.
          */}
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
              >
                <ProjectCard
                  project={project}
                  isDark={isDark}
                  onPreview={() => onPreview(project)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state — shown when no projects match the filter */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={clsx(
              'text-center py-20 text-sm',
              isDark ? 'text-slate-500' : 'text-slate-400'
            )}
          >
            No projects in this category yet.
          </motion.div>
        )}

      </div>

    </section>
  )
}