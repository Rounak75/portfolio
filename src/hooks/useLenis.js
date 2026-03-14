// src/hooks/useLenis.js
import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'

export function useLenis() {
  const lenisRef = useRef(null)

  useEffect(() => {
    // Detect touch device — disable Lenis on mobile
    // Native iOS/Android momentum scroll is better than JS smooth scroll on touch
    // and Lenis can fight with elastic bounce scroll on mobile browsers
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches
    if (isTouchDevice) return

    const lenis = new Lenis({
      duration: 1.4,
      easing: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 0, // disabled — native touch scroll handles this
      infinite: false,
    })

    lenisRef.current = lenis
    window.__lenis = lenis

    // Correct RAF loop — store id so cleanup can cancel it
    let rafId
    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      window.__lenis = null
      lenisRef.current = null
    }
  }, [])

  return lenisRef
}