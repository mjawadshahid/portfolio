"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { scrollState } from "./scrollState";
import {
  tokenLayout,
  clusterLayout,
  streamLayout,
  latticeLayout,
  portraitLayout,
  constellationLayout,
  disperseLayout,
  attributes,
} from "./particles";
import { vertexShader, fragmentShader } from "./shaders";

export function ParticleField({ count }: { count: number }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    // The opening and closing state are the same buffer, not two similar ones.
    const disperse = disperseLayout(count);
    const { random } = attributes(count);

    // `position` is required by three even though the shader ignores it.
    g.setAttribute("position", new THREE.BufferAttribute(disperse, 3));
    g.setAttribute("aDisperse", new THREE.BufferAttribute(disperse, 3));
    g.setAttribute("aToken", new THREE.BufferAttribute(tokenLayout(count), 3));
    g.setAttribute("aCluster", new THREE.BufferAttribute(clusterLayout(count), 3));
    g.setAttribute("aStream", new THREE.BufferAttribute(streamLayout(count), 3));
    g.setAttribute("aLattice", new THREE.BufferAttribute(latticeLayout(count), 3));
    g.setAttribute("aPortrait", new THREE.BufferAttribute(portraitLayout(count), 3));
    g.setAttribute(
      "aConstellation",
      new THREE.BufferAttribute(constellationLayout(count), 3)
    );
    g.setAttribute("aRandom", new THREE.BufferAttribute(random, 1));

    // The field travels well outside its initial bounds; culling by the token
    // layout would pop it off screen mid-sequence.
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 40);

    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTokenize: { value: 0 },
      uEmbed: { value: 0 },
      uStream: { value: 0 },
      uGallery: { value: 0 },
      uDenoise: { value: 0 },
      uConstellation: { value: 0 },
      uDisperse: { value: 0 },
      uSize: { value: 3.0 },
      uVelocity: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uOpacity: { value: 0.5 },
      uLightness: { value: 0 },
      // On the terminal ground.
      uDim: { value: new THREE.Color("#93aea8") },
      uAmber: { value: new THREE.Color("#f0ab45") },
      // On paper. Both need to be dark enough to read against #F0EFEA.
      uDimLight: { value: new THREE.Color("#4c6560") },
      uAmberLight: { value: new THREE.Color("#b4650e") },
    }),
    []
  );

  useFrame((_, delta) => {
    const m = materialRef.current;
    if (!m) return;

    const u = m.uniforms;
    u.uTime.value += delta;

    // Ease toward the scroll targets rather than tracking them exactly; this
    // is what stops the field feeling glued to the scrollbar.
    const k = 1 - Math.pow(0.001, delta);
    u.uTokenize.value += (scrollState.tokenize - u.uTokenize.value) * k;
    u.uEmbed.value += (scrollState.embed - u.uEmbed.value) * k;
    u.uStream.value += (scrollState.stream - u.uStream.value) * k;
    u.uGallery.value += (scrollState.gallery - u.uGallery.value) * k;
    u.uDenoise.value += (scrollState.denoise - u.uDenoise.value) * k;
    u.uConstellation.value +=
      (scrollState.constellation - u.uConstellation.value) * k;
    u.uDisperse.value += (scrollState.disperse - u.uDisperse.value) * k;

    u.uVelocity.value += (scrollState.velocity - u.uVelocity.value) * k * 0.6;
    u.uLightness.value += (scrollState.lightness - u.uLightness.value) * k;

    const p = u.uPointer.value as THREE.Vector2;
    p.x += (scrollState.pointerX - p.x) * k * 0.5;
    p.y += (scrollState.pointerY - p.y) * k * 0.5;

    /**
     * The opening state is a wide ambient field rather than the dense token
     * block, so it can be properly visible from the first frame without
     * reading as static behind the headline — that was only a problem when
     * the particles were packed into a rectangle.
     *
     * It still lifts a little on scroll, mostly so entering the sequence has
     * some lift to it.
     */
    const reveal = Math.min(1, scrollState.tokenize * 1.6);
    const eased = reveal * reveal * (3 - 2 * reveal);
    u.uOpacity.value = 0.62 + eased * 0.3;
    u.uSize.value = 2.9 + eased * 1.2;

    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.014;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
