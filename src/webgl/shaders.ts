/**
 * The particle shader.
 *
 * Seven position attributes, one progress uniform each. The vertex stage
 * chains the blends in scroll order so the field morphs continuously from the
 * top of the page to the bottom; the fragment stage tints between the cool
 * majority and the amber minority, and inverts for paper sections.
 */

export const vertexShader = /* glsl */ `
  attribute vec3 aCluster;
  attribute vec3 aStream;
  attribute vec3 aLattice;
  attribute vec3 aPortrait;
  attribute vec3 aConstellation;
  attribute vec3 aDisperse;
  attribute float aRandom;

  uniform float uTime;
  uniform float uEmbed;
  uniform float uStream;
  uniform float uGallery;
  uniform float uDenoise;
  uniform float uConstellation;
  uniform float uDisperse;
  uniform float uSize;
  uniform float uVelocity;
  uniform vec2  uPointer;

  varying float vRandom;
  varying float vState;
  varying float vDepth;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  // Smootherstep; the extra derivative continuity is visible at this scale.
  float ss(float t) {
    t = clamp(t, 0.0, 1.0);
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  }

  void main() {
    // Stagger per particle so transitions ripple rather than snap.
    float stagger = aRandom * 0.26;
    float k = 1.0 / (1.0 - 0.26);

    float t1 = ss((uGallery       - stagger) * k);
    float t2 = ss((uStream        - stagger) * k);
    float t3 = ss((uEmbed         - stagger) * k);
    float t4 = ss((uDenoise       - stagger) * k);
    float t5 = ss((uConstellation - stagger) * k);
    float t6 = ss((uDisperse      - stagger) * k);

    // Chained in scroll order, each act blends on top of the last, so the
    // field is continuous from the hero all the way to the footer.
    //
    // It opens on aDisperse, literally the same buffer the page ends on, so
    // the state you see at the bottom is exactly the state you see at the top.
    // The sequence condenses it into meaning and then releases it back.
    vec3 pos = aDisperse;
    pos = mix(pos, aLattice,       t1);
    pos = mix(pos, aStream,        t2);
    pos = mix(pos, aCluster,       t3);
    pos = mix(pos, aPortrait,      t4);
    pos = mix(pos, aConstellation, t5);
    pos = mix(pos, aDisperse,      t6);

    // Ambient drift, calmest while the portrait is resolved.
    float settled = t4 * (1.0 - t5);
    float drift = 1.0 - settled * 0.8;

    /*
      Per-particle phase, constant for the life of the particle.

      This previously read hash(aToken * 1.7 + floor(uTime * 0.4)). That
      floor() steps every 2.5s, and when it did, every particle's hash jumped
      to an unrelated value and the z offset snapped, so the whole field
      visibly twitched at a fixed interval. Drift has to be continuous in
      time; only the phase may vary, and only per particle.
    */
    float n = hash(aDisperse * 1.7);
    pos.x += sin(uTime * 0.32 + aRandom * 6.28) * 0.09 * drift;
    pos.y += cos(uTime * 0.27 + aRandom * 5.13) * 0.09 * drift;
    pos.z += sin(uTime * 0.21 + n * 6.28) * 0.11 * drift;

    // Scroll velocity smears the field along its travel direction, so hard
    // scrolling feels like it's moving something rather than just scrubbing.
    pos.y -= uVelocity * (0.4 + aRandom * 0.9);

    pos.xy += uPointer * (0.28 + aRandom * 0.22);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = uSize * (0.55 + aRandom * 0.9);
    gl_PointSize = max(1.0, size * (12.0 / -mv.z));

    vRandom = aRandom;
    vState = t4 * (1.0 - t6);
    vDepth = clamp(-mv.z / 26.0, 0.0, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision mediump float;

  uniform vec3  uDim;
  uniform vec3  uAmber;
  uniform vec3  uDimLight;
  uniform vec3  uAmberLight;
  uniform float uOpacity;
  uniform float uLightness;

  varying float vRandom;
  varying float vState;
  varying float vDepth;

  void main() {
    // Round point, soft edge. Discarding early is cheaper than blending a
    // full quad tens of thousands of times.
    vec2 c = gl_PointCoord - vec2(0.5);
    float d = dot(c, c);
    if (d > 0.25) discard;

    float alpha = smoothstep(0.25, 0.02, d);

    // A minority burn amber; the share rises as the field resolves.
    float amberMix = step(vRandom, 0.16 + vState * 0.3);

    // On paper sections the palette inverts rather than the canvas switching
    // off, so the field can keep running under light content.
    vec3 cool = mix(uDim, uDimLight, uLightness);
    vec3 warm = mix(uAmber, uAmberLight, uLightness);
    vec3 color = mix(cool, warm, amberMix);

    // Amber points carry more weight, so the warm minority reads as sparks.
    float weight = mix(0.62, 1.0, amberMix);

    // Fade with depth so the lattice has air in it.
    float depthFade = 1.0 - vDepth * 0.55;

    gl_FragColor = vec4(color, alpha * uOpacity * weight * depthFade);
  }
`;
