// ─────────────────────────────────────────────
// tailwind.config.js
// Tailwind scans your src/ files and generates
// only the CSS classes you actually use.
// ─────────────────────────────────────────────
/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind where your component files are
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  // darkMode: 'class' means dark mode is toggled
  // by adding/removing the 'dark' class on <html>
  darkMode: 'class',

  theme: {
    extend: {
      // ✏️ CUSTOMISE: Add your own colors here
      colors: {
        // Main dark background
        navy: {
          950: '#05080f',
          900: '#080b14',
          800: '#0d1220',
          700: '#121a2e',
        },
        // Accent / highlight color
        cyan: {
          400: '#63b3ed',
          500: '#4fa8e8',
        },
        violet: {
          400: '#ff4ae7',
        },
        emerald: {
          400: '#34d399',
        }
      },

      // ✏️ CUSTOMISE: Fonts — imported in index.css
      fontFamily: {
        display: ['Syne', 'sans-serif'],      // headings
        body:    ['DM Sans', 'sans-serif'],   // paragraphs
        mono:    ['JetBrains Mono', 'monospace'], // code/labels
      },

      // Custom animation keyframes
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        drift: {
          '0%':   { transform: 'translate(0, 0) scale(1)' },
          '100%': { transform: 'translate(40px, 60px) scale(1.1)' },
        },
        pulse2: {
          '0%, 100%': { opacity: '1',   transform: 'scale(1)' },
          '50%':      { opacity: '0.5', transform: 'scale(0.8)' },
        },
      },
      animation: {
        'fade-up':  'fadeUp 0.6s ease both',
        'float':    'float 3s ease-in-out infinite',
        'drift':    'drift 18s ease-in-out infinite alternate',
        'pulse2':   'pulse2 2s ease-in-out infinite',
      },
    },
  },

  plugins: [],
}
