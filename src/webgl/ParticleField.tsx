"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { scrollState } from "./scrollState";
import {
  tokenLayout,
  clusterLayout,
  noiseLayout,
  portraitLayout,
  attributes,
} from "./particles";
import { vertexShader, fragmentShader } from "./shaders";

export function ParticleField({ count }: { count: number }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const token = tokenLayout(count);
    const { random } = attributes(count);

    // `position` is required by three even though the shader ignores it; we
    // point it at the token layout so frustum culling has sane bounds.
    g.setAttribute("position", new THREE.BufferAttribute(token, 3));
    g.setAttribute("aToken", new THREE.BufferAttribute(token, 3));
    g.setAttribute("aCluster", new THREE.BufferAttribute(clusterLayout(count), 3));
    g.setAttribute("aNoise", new THREE.BufferAttribute(noiseLayout(count), 3));
    g.setAttribute("aPortrait", new THREE.BufferAttribute(portraitLayout(count), 3));
    g.setAttribute("aRandom", new THREE.BufferAttribute(random, 1));

    // The field moves well outside its initial bounds, so culling it by the
    // token layout would pop it off screen mid-sequence.
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 12);

    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTokenize: { value: 0 },
      uEmbed: { value: 0 },
      uDenoise: { value: 0 },
      uSize: { value: 2.4 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uDim: { value: new THREE.Color("#7e9a95") },
      uAmber: { value: new THREE.Color("#e8a33d") },
      uOpacity: { value: 0.92 },
    }),
    []
  );

  useFrame((_, delta) => {
    const m = materialRef.current;
    if (!m) return;

    m.uniforms.uTime.value += delta;

    // Ease toward the scroll targets rather than tracking them exactly; this
    // is what stops the field feeling glued to the scrollbar.
    const k = 1 - Math.pow(0.001, delta);
    m.uniforms.uTokenize.value += (scrollState.tokenize - m.uniforms.uTokenize.value) * k;
    m.uniforms.uEmbed.value += (scrollState.embed - m.uniforms.uEmbed.value) * k;
    m.uniforms.uDenoise.value += (scrollState.denoise - m.uniforms.uDenoise.value) * k;

    const p = m.uniforms.uPointer.value as THREE.Vector2;
    p.x += (scrollState.pointerX - p.x) * k * 0.5;
    p.y += (scrollState.pointerY - p.y) * k * 0.5;

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
