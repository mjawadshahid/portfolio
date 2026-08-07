"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Lenis drives scrolling; ScrollTrigger reads from it. Wiring them together is
 * four lines, and getting the order wrong is the usual cause of scroll-linked
 * animation drifting out of sync with the page.
 *
 * Under `prefers-reduced-motion` we never start Lenis at all — native scrolling
 * stays, and every scrubbed timeline elsewhere renders its end state. That's a
 * real supported path, not a degraded one.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap.registerPlugin(ScrollTrigger);

    if (reduced) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      // Weighted, but not so heavy it feels laggy on a trackpad.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    // ScrollTrigger asks Lenis for the scroll position rather than the window.
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
