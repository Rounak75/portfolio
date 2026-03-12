// ─────────────────────────────────────────────
// vite.config.js
// Vite is our build tool — it compiles React + 
// Tailwind into optimised HTML/CSS/JS for deploy.
// ─────────────────────────────────────────────
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // ✏️ CHANGE THIS: If deploying to GitHub Pages in a sub-folder repo
  // e.g. github.com/username/portfolio → base: '/portfolio/'
  // For Netlify/Vercel, keep as '/'
  base: '/',
})
