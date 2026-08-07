"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ParticleField } from "./ParticleField";
import { scrollState } from "./scrollState";

/**
 * The fixed canvas layer.
 *
 * Sits at z-index -1 behind the whole document, exactly as landonorris.com
 * does it — sections above stay transparent where they want the field to show
 * through. The DOM owns all content; this owns none.
 */
export default function Scene() {
  const [count, setCount] = useState(0);
  /**
   * Drives `frameloop`. Once the act sequence is scrolled past, the render
   * loop stops entirely rather than drawing 68k points behind opaque
   * document sections nobody can see them through.
   */
  const [running, setRunning] = useState(true);

  useEffect(() => {
    // Particle budget by device. A mid-range phone will happily draw 15k
    // additive points; it will not draw 70k.
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const cores = navigator.hardwareConcurrency ?? 4;
    const dpr = window.devicePixelRatio || 1;

    if (mobile) setCount(14_000);
    else if (cores <= 4 || dpr > 2.5) setCount(34_000);
    else setCount(68_000);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggers: ScrollTrigger[] = [];

    // One trigger per act, each writing its own 0→1 into the shared state.
    const acts: { sel: string; key: "tokenize" | "embed" | "denoise" }[] = [
      { sel: '[data-act="tokenize"]', key: "tokenize" },
      { sel: '[data-act="embed"]', key: "embed" },
      { sel: '[data-act="denoise"]', key: "denoise" },
    ];

    for (const act of acts) {
      const el = document.querySelector(act.sel);
      if (!el) continue;

      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom center",
          onUpdate: (self) => {
            scrollState[act.key] = self.progress;
          },
        })
      );
    }

    // Stop rendering once the sequence is off screen — everything below is
    // documents, and there's no reason to keep a GPU loop alive for them.
    const generate = document.querySelector('[data-act="generate"]');
    if (generate) {
      triggers.push(
        ScrollTrigger.create({
          trigger: generate,
          start: "top center",
          onEnter: () => {
            scrollState.visible = false;
            setRunning(false);
          },
          onLeaveBack: () => {
            scrollState.visible = true;
            setRunning(true);
          },
        })
      );
    }

    const onPointer = (e: PointerEvent) => {
      scrollState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      triggers.forEach((t) => t.kill());
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  if (count === 0) return null;

  return (
    // The canvas is decoration. Nothing here is announced, focusable, or
    // required to understand the page.
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 11], fov: 45 }}
        dpr={[1, 1.75]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        frameloop={running ? "always" : "never"}
      >
        <ParticleField count={count} />
      </Canvas>
    </div>
  );
}
