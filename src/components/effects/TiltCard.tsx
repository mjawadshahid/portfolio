"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Cursor-tracking 3D tilt with a specular sheen that follows the pointer.
 *
 * The sheen is what sells it — tilt alone reads as a gimmick, but tilt plus a
 * highlight that moves like a real reflection reads as a surface.
 */
export function TiltCard({
  children,
  className = "",
  max = 7,
}: {
  children: React.ReactNode;
  className?: string;
  /** Maximum rotation in degrees. */
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduced || !fine) return;

    const rx = gsap.quickTo(el, "rotationX", { duration: 0.55, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.55, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;

      ry((px - 0.5) * max * 2);
      rx((0.5 - py) * max * 2);

      el.style.setProperty("--sheen-x", `${px * 100}%`);
      el.style.setProperty("--sheen-y", `${py * 100}%`);
      el.style.setProperty("--sheen-o", "1");
    };

    const onLeave = () => {
      rx(0);
      ry(0);
      el.style.setProperty("--sheen-o", "0");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [max]);

  return (
    <div
      ref={ref}
      className={`relative [transform-style:preserve-3d] [perspective:900px] ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: "var(--sheen-o, 0)",
          background:
            "radial-gradient(340px circle at var(--sheen-x,50%) var(--sheen-y,50%), rgba(232,163,61,0.13), transparent 60%)",
        }}
      />
    </div>
  );
}
