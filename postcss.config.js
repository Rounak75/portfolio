// postcss.config.js
// PostCSS processes your CSS — Tailwind and Autoprefixer
// are plugins that run during the build step.
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}, // adds vendor prefixes for browser compatibility
  },
}
