"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * Gate in front of the WebGL layer.
 *
 * Nothing here is on the critical path: the scene is code-split, only imported
 * on the client, and only mounted once the browser is idle *and* the device
 * has actually earned it. Act 00 has already painted by then — which is the
 * whole reason LCP stays under budget on a site like this.
 *
 * Three ways to end up with no canvas at all, each of them a supported path:
 *   - prefers-reduced-motion
 *   - no WebGL context available
 *   - device reports very low memory
 */
const Scene = dynamic(() => import("./Scene"), { ssr: false });

function canRender(): boolean {
  if (typeof window === "undefined") return false;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

  // `deviceMemory` is Chromium-only; absence is not a failure.
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (typeof mem === "number" && mem < 2) return false;

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}

export function InferenceStage() {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    if (!canRender()) return;

    const idle =
      window.requestIdleCallback ??
      ((cb: IdleRequestCallback) =>
        window.setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 }), 200));

    const handle = idle(() => setMount(true), { timeout: 1800 });

    return () => {
      if (window.cancelIdleCallback && typeof handle === "number") {
        window.cancelIdleCallback(handle);
      }
    };
  }, []);

  if (!mount) return null;
  return <Scene />;
}
