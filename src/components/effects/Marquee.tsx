"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { scrollState } from "@/webgl/scrollState";

/**
 * Infinite marquee whose speed and direction follow scroll velocity, with a
 * skew that leans into the movement.
 *
 * This is the trick landonorris.com uses on its `marquee-gl` band, and it's
 * most of why that page feels physical: the content isn't just scrolling past,
 * it's reacting to how hard you pushed it.
 *
 * Runs on a `gsap.ticker` loop, not React state — this updates every frame.
 */
export function Marquee({
  items,
  baseSpeed = 0.6,
  direction = 1,
  className = "",
}: {
  items: readonly string[];
  baseSpeed?: number;
  direction?: 1 | -1;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const inner = innerRef.current;
    const track = trackRef.current;
    if (!inner || !track || reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    // One copy's width. The strip holds two, so resetting at -half is seamless.
    let half = inner.scrollWidth / 2;
    let offset = 0;
    let skew = 0;

    const measure = () => {
      half = inner.scrollWidth / 2;
    };
    const ro = new ResizeObserver(measure);
    ro.observe(inner);

    const tick = () => {
      const v = scrollState.velocity;

      // Scroll velocity adds to the idle drift and can reverse it outright.
      offset -= (baseSpeed + v * 1.8) * direction;

      // Wrap in both directions.
      if (offset <= -half) offset += half;
      if (offset > 0) offset -= half;

      // Lean into the movement, then settle back.
      const targetSkew = gsap.utils.clamp(-12, 12, v * -1.4);
      skew += (targetSkew - skew) * 0.1;

      inner.style.transform = `translate3d(${offset}px,0,0)`;
      track.style.transform = `skewY(${skew * 0.12}deg)`;
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
    };
  }, [baseSpeed, direction]);

  // Two copies so the wrap is invisible. aria-hidden on the duplicate keeps
  // screen readers from hearing the list twice.
  return (
    <div
      ref={trackRef}
      className={`w-full overflow-hidden will-change-transform ${className}`}
    >
      <div ref={innerRef} className="flex w-max will-change-transform">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            className="flex shrink-0"
            aria-hidden={copy === 1 ? "true" : undefined}
          >
            {items.map((item) => (
              <li
                key={`${copy}-${item}`}
                className="flex items-center whitespace-nowrap"
              >
                <span className="px-6 font-[family-name:var(--font-mono)] text-[clamp(1.1rem,2.6vw,2rem)] tracking-[-0.03em]">
                  {item}
                </span>
                <span
                  aria-hidden="true"
                  className="text-[var(--color-amber)] opacity-70"
                >
                  ✦
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
