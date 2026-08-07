"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Pinned horizontal scroll track.
 *
 * This is the 2,484px `is-horizontal-track` section on landonorris.com: the
 * page pins, and vertical scroll drives the strip sideways. It's the single
 * most effective "this site is built" moment available, because it breaks the
 * one assumption every other page makes.
 *
 * Under reduced motion the pin never engages and the strip becomes a normal
 * horizontally-scrollable list — same content, no hijack.
 */
export function HorizontalTrack({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const section = sectionRef.current;
    const strip = stripRef.current;
    if (!section || !strip || reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Distance the strip has to travel to show its last card.
      const distance = () => strip.scrollWidth - window.innerWidth;

      const tween = gsap.to(strip, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          // Scroll length equals travel distance, so it moves 1:1 with the
          // wheel rather than feeling geared.
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`relative overflow-hidden ${className}`}
      data-act="gallery"
    >
      <div
        ref={stripRef}
        className="flex w-max items-stretch gap-6 px-[clamp(1.25rem,4vw,3.5rem)] py-16 max-lg:overflow-x-auto"
      >
        {children}
      </div>
    </div>
  );
}
