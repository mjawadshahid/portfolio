"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ParticleField } from "./ParticleField";
import { scrollState, ACTS, type Act } from "./scrollState";

/**
 * The fixed canvas layer.
 *
 * Sits at z-index -1 behind the whole document; sections that want it visible
 * stay transparent. It runs for the *entire* page, the dark bands are
 * interleaved with paper document sections all the way down, so the field
 * keeps reappearing instead of being hidden away after the hero.
 *
 * It only stops when the tab is hidden.
 */
export default function Scene() {
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    // A mid-range phone will happily draw 15k additive points; not 70k.
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const cores = navigator.hardwareConcurrency ?? 4;
    const dpr = window.devicePixelRatio || 1;

    if (mobile) setCount(16_000);
    else if (cores <= 4 || dpr > 2.5) setCount(38_000);
    else setCount(72_000);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const triggers: ScrollTrigger[] = [];

    // One trigger per act, each writing its own 0→1 into shared state.
    for (const act of ACTS) {
      const el = document.querySelector(`[data-act="${act}"]`);
      if (!el) continue;

      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          /*
            The morph runs as the section arrives and is finished while you're
            still reading its heading.

            The old "top bottom" → "bottom center" window meant a state only
            settled once the section's *bottom* reached the middle of the
            screen, so by the time the field looked right you'd already
            scrolled past the content it belonged to.
          */
          start: "top 90%",
          end: "top 35%",
          onUpdate: (self) => {
            scrollState[act as Act] = self.progress;
          },
        })
      );
    }

    /**
     * Paper sections are opaque, so while one covers the canvas the field is
     * invisible. Freeze it there rather than letting it morph unwatched.
     *
     * The window is generous on both ends: the section starts covering the
     * middle of the screen well before its top edge reaches it, and the next
     * act's trigger has usually already begun firing by then.
     */
    const paper = document.querySelectorAll("[data-ground='paper']");
    let covering = 0;

    paper.forEach((el) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 75%",
          end: "bottom 25%",
          onToggle: (self) => {
            covering += self.isActive ? 1 : -1;
            scrollState.occluded = covering > 0;
          },
        })
      );
    });

    // Smoothed scroll velocity, shared with the marquee.
    let last = window.scrollY;
    const onScroll = () => {
      const now = window.scrollY;
      const raw = gsap.utils.clamp(-60, 60, now - last);
      last = now;
      scrollState.velocity += (raw * 0.05 - scrollState.velocity) * 0.25;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Decay velocity toward zero when scrolling stops.
    const decay = () => {
      scrollState.velocity *= 0.92;
    };
    gsap.ticker.add(decay);

    const onPointer = (e: PointerEvent) => {
      scrollState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    // The only reason to stop rendering.
    const onVisibility = () => setRunning(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    ScrollTrigger.refresh();

    return () => {
      triggers.forEach((t) => t.kill());
      gsap.ticker.remove(decay);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  if (count === 0) return null;

  return (
    // Decoration. Nothing here is announced, focusable, or needed to
    // understand the page.
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 11], fov: 45 }}
        dpr={[1, 1.75]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        frameloop={running ? "always" : "never"}
      >
        <ParticleField count={count} />
      </Canvas>
    </div>
  );
}
