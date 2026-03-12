# 🚀 Rounak Kumar Mahato — Developer Portfolio

A modern, animated developer portfolio built with **React + Vite + Tailwind CSS + Framer Motion**.

---

## 📁 Project Structure

```
portfolio/
├── public/
│   └── resume.pdf          ← PUT YOUR RESUME PDF HERE
│
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   └── SectionHeader.jsx   ← Reusable section title components
│   │   ├── Navbar.jsx              ← Sticky nav with mobile menu
│   │   ├── Hero.jsx                ← Landing section with avatar
│   │   ├── About.jsx               ← Bio, timeline, achievements
│   │   ├── Skills.jsx              ← Animated skill bars + tech chips
│   │   ├── Projects.jsx            ← Filterable project grid
│   │   ├── ProjectCard.jsx         ← Individual project card
│   │   ├── ProjectModal.jsx        ← Full-screen project detail modal
│   │   ├── Resume.jsx              ← Resume download section
│   │   ├── Contact.jsx             ← Contact form + details
│   │   └── Footer.jsx              ← Copyright + links
│   │
│   ├── data/
│   │   ├── personal.js    ← ✏️ YOUR NAME, BIO, SKILLS, SOCIALS
│   │   └── projects.js    ← ✏️ YOUR PROJECTS (add/remove easily)
│   │
│   ├── styles/
│   │   └── globals.css    ← Tailwind imports + custom CSS
│   │
│   ├── App.jsx            ← Root component, theme management
│   └── main.jsx           ← React entry point
│
├── index.html             ← HTML shell + font imports
├── vite.config.js         ← Vite build config
├── tailwind.config.js     ← Tailwind theme + colors
└── postcss.config.js      ← PostCSS plugins
```

---

## ⚡ Quick Start (Run Locally)

### Step 1 — Prerequisites
Make sure you have **Node.js** installed (version 18+).  
Check: `node --version`  
Download: https://nodejs.org

### Step 2 — Install dependencies
```bash
# Navigate to the portfolio folder
cd portfolio

# Install all packages listed in package.json
npm install
```

### Step 3 — Start the dev server
```bash
npm run dev
```
Open your browser at **http://localhost:5173** — the site hot-reloads on every save.

### Step 4 — Build for production
```bash
npm run build
```
This creates a `/dist` folder with optimised HTML/CSS/JS ready to deploy.

### Step 5 — Preview the production build locally
```bash
npm run preview
```

---

## ✏️ How to Customise (Beginner-Friendly)

### 1. Change your name, bio, contact info
Open `src/data/personal.js` and edit the values:
```js
export const personal = {
  name:    "Your Full Name",      // ← change this
  email:   "you@email.com",       // ← change this
  bio:     "Your bio...",         // ← change this
  socials: {
    github:   "https://github.com/YOURUSERNAME",
    linkedin: "https://linkedin.com/in/YOURPROFILE",
  }
  // ...
}
```

### 2. Add/remove/edit projects
Open `src/data/projects.js`. Copy an existing object and paste it:
```js
{
  id: 6,                          // ← unique number
  title: "My New Project",
  emoji: "🚀",                    // ← pick any emoji as thumbnail
  category: ["AI", "Web"],        // ← used for filter buttons
  shortDesc: "One-line summary",
  fullDesc:  "Full description shown in the modal...",
  tech: ["React", "Python"],
  github: "https://github.com/...",
  demo:   "https://mysite.com",
  date:   "2025",
  featured: false,
},
```

### 3. Edit skill bars
In `src/data/personal.js`, find the `skills` array:
```js
export const skills = [
  { name: "Python", emoji: "🐍", pct: 90 },  // pct = bar fill (0-100)
  // add or remove skills here
]
```

### 4. Change colors
Open `tailwind.config.js` and find the `colors` section:
```js
// Change accent colors globally here
colors: {
  cyan:   { 400: '#63b3ed' },   // ← primary accent
  violet: { 400: '#a78bfa' },   // ← secondary accent
  emerald:{ 400: '#34d399' },   // ← tertiary accent
}
```

### 5. Change fonts
1. Visit https://fonts.google.com and pick two fonts
2. In `index.html`, replace the Google Fonts link
3. In `tailwind.config.js`, update `fontFamily`:
```js
fontFamily: {
  display: ['YourHeadingFont', 'sans-serif'],
  body:    ['YourBodyFont', 'sans-serif'],
}
```

### 6. Add your resume PDF
Place your PDF file at: `/public/resume.pdf`  
The download button automatically links to this path.

### 7. Make the contact form send real emails (Formspree — FREE)
1. Go to https://formspree.io → sign up → create a form
2. Copy your form ID (looks like `xabcdefg`)
3. In `src/components/Contact.jsx`, find this line:
   ```js
   await new Promise(r => setTimeout(r, 1500))  // ← replace this
   ```
   Replace with:
   ```js
   const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(form),
   })
   if (!res.ok) throw new Error('Failed')
   ```

---

## 🌐 Deployment

### Option A — Vercel (Recommended — Easiest, Free)

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial portfolio"
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

2. Go to https://vercel.com → Sign in with GitHub  
3. Click **"New Project"** → Import your repository  
4. Framework: **Vite** (auto-detected)  
5. Click **"Deploy"**  
6. Your site is live at `https://your-project.vercel.app` in ~60 seconds!

**Redeploy after changes:**
```bash
git add .
git commit -m "Update portfolio"
git push
# Vercel auto-deploys on every push!
```

---

### Option B — Netlify (Also Free, Very Easy)

**Method 1 — Drag & Drop (no CLI needed):**
```bash
npm run build   # creates /dist folder
```
1. Go to https://netlify.com → Log in  
2. Drag the `/dist` folder onto the Netlify dashboard  
3. Done! Get a free `*.netlify.app` URL

**Method 2 — Git integration (auto-deploys):**
1. Push code to GitHub (see above)  
2. Netlify Dashboard → **"Add new site"** → **"Import from Git"**  
3. Build command: `npm run build`  
4. Publish directory: `dist`  
5. Click **"Deploy site"**

---

### Option C — GitHub Pages

> ⚠️ GitHub Pages requires a small config change.

**Step 1** — In `vite.config.js`, set `base` to your repo name:
```js
export default defineConfig({
  plugins: [react()],
  base: '/YOUR-REPO-NAME/',   // ← add this
})
```

**Step 2** — Install the deploy helper:
```bash
npm install --save-dev gh-pages
```

**Step 3** — Add to `package.json` scripts:
```json
"scripts": {
  "dev":      "vite",
  "build":    "vite build",
  "preview":  "vite preview",
  "deploy":   "npm run build && gh-pages -d dist"
}
```

**Step 4** — Deploy:
```bash
npm run deploy
```

**Step 5** — In your GitHub repo:  
Settings → Pages → Source → `gh-pages` branch → Save  
Your site is live at: `https://YOUR_USERNAME.github.io/YOUR-REPO-NAME/`

---

## 🔧 Useful Commands

| Command           | What it does                              |
|-------------------|-------------------------------------------|
| `npm install`     | Install all dependencies                  |
| `npm run dev`     | Start local dev server (hot reload)       |
| `npm run build`   | Build optimised production files          |
| `npm run preview` | Preview the production build locally      |
| `npm run deploy`  | Deploy to GitHub Pages (after setup)      |

---

## 📦 Dependencies Explained

| Package                      | Purpose                                      |
|------------------------------|----------------------------------------------|
| `react`, `react-dom`         | The UI library                               |
| `framer-motion`              | Smooth animations (entrance, hover, modal)   |
| `react-intersection-observer`| Triggers animations when elements scroll in  |
| `lucide-react`               | Clean SVG icon library                       |
| `clsx`                       | Cleanly combine conditional CSS class names  |
| `tailwindcss`                | Utility-first CSS framework                  |
| `vite`                       | Fast dev server and build tool               |

---

## 🧩 Adding a New Section

1. Create `src/components/MySection.jsx`
2. Import it in `src/App.jsx` and add `<MySection isDark={isDark} />`
3. Add a nav link in `src/components/Navbar.jsx` → `NAV_LINKS` array
4. Give the section `id="my-section"` to match the nav href

---

## 💡 Tips

- **Profile photo**: Replace the initials avatar in `Hero.jsx` with an `<img>` tag pointing to `/public/avatar.jpg`
- **Dark mode default**: In `App.jsx`, change `useState(true)` to `useState(false)` to default light
- **Animations speed**: In `tailwind.config.js`, edit the `keyframes` durations
- **Section order**: In `App.jsx`, reorder the section components

---

Built with ❤️ by Rounak Kumar Mahato
