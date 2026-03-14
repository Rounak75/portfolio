// src/hooks/useLenis.js
//
// Initialises Lenis smooth scroll and syncs it with
// Framer Motion's useScroll so both work together.

import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'

export function useLenis() {
  const lenisRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration:  1.4,          // How long the scroll takes — landonorris.com uses ~1.2-1.6
      easing: t =>             // Custom easing — expo out, super silky
        t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
      orientation:  'vertical',
      smoothWheel:  true,
      wheelMultiplier: 0.9,   // Slightly slower than native — feels premium
      touchMultiplier: 1.5,   // Touch feels snappier
      infinite: false,
    })

    lenisRef.current = lenis

    // Lenis needs a RAF loop to work
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    const id = requestAnimationFrame(raf)

    // Expose lenis instance globally so ScrollProgressBar
    // and Navbar active section detection still work
    window.__lenis = lenis

    return () => {
      cancelAnimationFrame(id)
      lenis.destroy()
      window.__lenis = null
    }
  }, [])

  return lenisRef
}