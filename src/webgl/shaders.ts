/**
 * The particle shader.
 *
 * Four position attributes, one progress uniform. The vertex stage blends
 * between layouts; the fragment stage draws a soft round point tinted between
 * the terminal dim and the amber phosphor.
 */

export const vertexShader = /* glsl */ `
  attribute vec3 aToken;
  attribute vec3 aCluster;
  attribute vec3 aNoise;
  attribute vec3 aPortrait;
  attribute float aRandom;

  uniform float uTime;
  uniform float uTokenize;
  uniform float uEmbed;
  uniform float uDenoise;
  uniform float uSize;
  uniform vec2  uPointer;

  varying float vRandom;
  varying float vState;

  // Cheap 3D value noise. Enough for drift; nothing here needs simplex.
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  void main() {
    // Stagger each particle slightly so transitions ripple instead of snapping.
    float stagger = aRandom * 0.28;
    float t1 = clamp((uTokenize - stagger) / (1.0 - 0.28), 0.0, 1.0);
    float t2 = clamp((uEmbed    - stagger) / (1.0 - 0.28), 0.0, 1.0);
    float t3 = clamp((uDenoise  - stagger) / (1.0 - 0.28), 0.0, 1.0);

    // Smootherstep — the extra derivative continuity is visible at this scale.
    t1 = t1 * t1 * t1 * (t1 * (t1 * 6.0 - 15.0) + 10.0);
    t2 = t2 * t2 * t2 * (t2 * (t2 * 6.0 - 15.0) + 10.0);
    t3 = t3 * t3 * t3 * (t3 * (t3 * 6.0 - 15.0) + 10.0);

    vec3 pos = aToken;
    pos = mix(pos, aCluster,  t1);
    pos = mix(pos, aNoise,    t2);
    pos = mix(pos, aPortrait, t3);

    // Ambient drift, strongest while the field is unresolved.
    float drift = 1.0 - t3 * 0.85;
    float n = hash(aToken * 1.7 + floor(uTime * 0.4));
    pos.x += sin(uTime * 0.32 + aRandom * 6.28) * 0.09 * drift;
    pos.y += cos(uTime * 0.27 + aRandom * 5.13) * 0.09 * drift;
    pos.z += sin(uTime * 0.21 + n * 6.28) * 0.11 * drift;

    // Pointer parallax, scaled by depth so it reads as a real volume.
    pos.xy += uPointer * (0.28 + aRandom * 0.22);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    // Perspective attenuation, with a floor so distant points don't vanish.
    float size = uSize * (0.55 + aRandom * 0.9);
    gl_PointSize = max(1.0, size * (12.0 / -mv.z));

    vRandom = aRandom;
    vState = t3;
  }
`;

export const fragmentShader = /* glsl */ `
  precision mediump float;

  uniform vec3  uDim;
  uniform vec3  uAmber;
  uniform float uOpacity;

  varying float vRandom;
  varying float vState;

  void main() {
    // Round point with a soft edge. Discarding early is cheaper than blending
    // a full quad when there are tens of thousands of these.
    vec2 c = gl_PointCoord - vec2(0.5);
    float d = dot(c, c);
    if (d > 0.25) discard;

    float alpha = smoothstep(0.25, 0.02, d);

    // A minority of particles burn amber; the share rises as the field
    // resolves, so the payoff is warmer than the noise it came from.
    float amberMix = step(vRandom, 0.16 + vState * 0.3);
    vec3 color = mix(uDim, uAmber, amberMix);

    // Amber points carry more weight than the cool ones, so the warm minority
    // reads as sparks rather than evenly-distributed confetti.
    float weight = mix(0.62, 1.0, amberMix);

    gl_FragColor = vec4(color, alpha * uOpacity * weight);
  }
`;
