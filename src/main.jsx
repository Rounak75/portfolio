// ─────────────────────────────────────────────
// src/main.jsx
//
// This is the JavaScript entry point.
// It mounts the React <App /> component into
// the <div id="root"> in index.html.
//
// You rarely need to edit this file.
// ─────────────────────────────────────────────

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Import global CSS (Tailwind + custom styles)
import './styles/globals.css'

// ReactDOM.createRoot finds the #root div and
// renders your entire app inside it.
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode helps catch bugs in development.
  // It runs component lifecycle twice in dev — don't worry, 
  // this doesn't happen in production builds.
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
