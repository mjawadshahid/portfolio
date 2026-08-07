"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Children slide in from alternating sides and meet in the middle as the
 * section is scrolled through.
 *
 * This is the beat between the two galleries on the reference site — after a
 * horizontal run finishes, the next block assembles itself from left and right
 * rather than just appearing. It reads as a deliberate join.
 *
 * Everything is rendered in its final position first and only *offset* by the
 * animation, so a crawler, a no-JS visitor and a reduced-motion visitor all
 * get the finished layout.
 */
export function Converge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-converge]");

      rows.forEach((row, i) => {
        const fromLeft = i % 2 === 0;
        gsap.fromTo(
          row,
          { xPercent: fromLeft ? -55 : 55, opacity: 0, rotate: fromLeft ? -1.5 : 1.5 },
          {
            xPercent: 0,
            opacity: 1,
            rotate: 0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 92%",
              end: "top 45%",
              scrub: 0.8,
            },
          }
        );
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
