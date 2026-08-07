"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Pulls its child toward the cursor when the pointer is nearby, then springs
 * back on leave.
 *
 * Wraps rather than clones so it works on any child. Pointer-based, so it's
 * inert on touch devices, and it does nothing at all under reduced motion.
 */
export function Magnetic({
  children,
  strength = 0.35,
  radius = 90,
  className = "",
}: {
  children: React.ReactNode;
  /** 0–1. How far toward the cursor the element travels. */
  strength?: number;
  /** Pixels beyond the element's bounds that still count as "near". */
  radius?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduced || !fine) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      const near =
        Math.abs(dx) < r.width / 2 + radius && Math.abs(dy) < r.height / 2 + radius;

      if (near) {
        xTo(dx * strength);
        yTo(dy * strength);
      } else {
        xTo(0);
        yTo(0);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      gsap.killTweensOf(el);
    };
  }, [strength, radius]);

  return (
    <span ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </span>
  );
}
