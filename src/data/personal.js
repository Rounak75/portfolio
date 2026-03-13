// ═══════════════════════════════════════════════════════
// src/data/personal.js
//
// ✏️ THIS IS YOUR MAIN DATA FILE.
//    Change everything here and the whole site updates.
// ═══════════════════════════════════════════════════════

export const personal = {
  // ── Basic Info ──────────────────────────────────────
  name:       "Rounak Kumar Mahato",
  nameShort:  "RKM",           // used in navbar logo
  initials:   "RK",            // used in avatar placeholder
  tagline:    "AI Developer · Python · Machine Learning · Full Stack",
  location:   "Bhubaneswar, Odisha, India",
  email:      "rounakmahato039@gmail.com",
  phone:      "810-271-0351",

  // ── Hero Bio (shown below tagline) ──────────────────
  bio: "I build intelligent systems and beautiful interfaces — combining the power of Machine Learning with modern web technology to create impactful, real-world solutions.",

  // ── About Section (longer version) ─────────────────
  aboutLong: `I am a software developer and CSE undergrad at SOA ITER (Batch of 2028) \npassionate about Artificial Intelligence, Machine Learning, and building impactful technology. \nI enjoy solving real-world problems through code and continuously learning new technologies.`,

  aboutExtra: `I've worked on projects spanning computer vision, cybersecurity dashboards, and \nfull-stack applications. Beyond code, I'm a competitive programmer, photographer, and co-founder at Ayuda.`,

  // ── Social Links ─────────────────────────────────────
  socials: {
    github:   "https://github.com/Rounak75",
    linkedin: "https://linkedin.com/in/rounakmahato",
    twitter:  "https://twitter.com",
    email:    "mailto:rounakmahato039@gmail.com",
  },

  // ── Resume ───────────────────────────────────────────
  resumeUrl: "/resume.pdf",
};

// ── Skills ───────────────────────────────────────────────
export const skills = [
  { name: "Python",           emoji: "🐍",  pct: 90, color: "from-cyan-400 to-violet-400" },
  { name: "Machine Learning", emoji: "🤖",  pct: 80, color: "from-violet-400 to-emerald-400" },
  { name: "React.js",         emoji: "⚛️",  pct: 78, color: "from-cyan-400 to-violet-400" },
  { name: "JavaScript",       emoji: "🌐",  pct: 80, color: "from-emerald-400 to-cyan-400" },
  { name: "Django",           emoji: "🔧",  pct: 75, color: "from-violet-400 to-cyan-400" },
  { name: "Computer Vision",  emoji: "👁️",  pct: 72, color: "from-cyan-400 to-emerald-400" },
  { name: "Java / C++",       emoji: "☕",  pct: 75, color: "from-violet-400 to-emerald-400" },
  { name: "SQL / MongoDB",    emoji: "🗄️",  pct: 72, color: "from-emerald-400 to-violet-400" },
  { name: "HTML / CSS",       emoji: "🎨",  pct: 88, color: "from-cyan-400 to-violet-400" },
];

// ── Tech Chips ───────────────────────────────────────────
export const techStack = [
  "🐍 Python", "⚛️ React", "🔧 Django", "🟢 Node.js",
  "🧠 TensorFlow", "📊 Scikit-learn", "🐙 Git",
  "🗄️ PostgreSQL", "🍃 MongoDB", "🐹 Go", "☁️ Cloud",
];

// ── Education Timeline ────────────────────────────────────
// ✏️ Add/remove education entries here
export const education = [
  {
    dot:   "🎓",
    year:  "2024 – 2028",
    title: "B.Tech CSE — Siksha 'O' Anusandhan, ITER",
    sub:   "CGPA: 7.68/10 · Bhubaneswar, Odisha",
    tags:  ["ML", "DSA", "Web Dev", "Networking"],
  },
  {
    dot:   "📘",
    year:  "2024",
    title: "Class XII — DAV Public School",
    sub:   "CBSE · Jamshedpur, Jharkhand",
  },
  {
    dot:   "📗",
    year:  "2022",
    title: "Class X — Tagore Academy",
    sub:   "ICSE · Jamshedpur, Jharkhand",
  },
];

// ── Experience Timeline ───────────────────────────────────
// ✏️ Add/remove experience entries here
export const experience = [
  {
    dot:   "E",
    year:  "Jan 2025 – Present",
    title: "Co-Founder — Ayuda",
    sub:   "Leading product development and team operations",
  },
  {
    dot:   "G",
    year:  "Nov 2025 – Present",
    title: "PR & Event Management — GDG on Campus ITER",
    sub:   "Planned and executed GDG workshops and events with 400+ registrations, driving active participation in the tech community.",
  },
  {
    dot:   "I",
    year:  "Oct 2025 – Present",
    title: "Event & Operations — IEC (ECell)",
    sub:   "Managed IIC 2025 Regional Meet (AICTE) logistics",
  },
  {
    dot:   "📷",
    year:  "Mar 2025 – Present",
    title: "Photographer — SOA Photography Club",
    sub:   "Documenting campus events and moments",
  },
];

// ── Achievements ─────────────────────────────────────────
export const achievements = [
  "2nd place — Scriptwriting Competition, IIT (BHU) Varanasi",
  "AI Appreciate Badge — Odisha for AI",
  "Certificate of Merit — TechWiz 2.0",
  "Cybersecurity Workshop — 400+ registrations, 200+ attendees",
];

// ── Certifications ───────────────────────────────────────
export const certifications = [
  "Getting Started with AI",
  "Cloud Community Day Bhubaneswar 2025",
  "TechWiz 2.0",
];