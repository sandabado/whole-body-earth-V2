const airFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform float uPointerActive;
  uniform float uScrollSpeed;
  uniform vec3 uColorBase;
  uniform vec3 uColorPrimary;
  uniform vec3 uColorSecondary;
  uniform vec3 uColorSurface;
  uniform float uFlowVelocityScale;
  uniform float uCameraDriftSpeed;
  uniform float uPointerInfluenceStrength;
  uniform float uScrollAccelerationMultiplier;
  uniform float uWhiteHotFlare;

  varying vec2 vUv;

  float hash21(vec2 point) {
    point = fract(point * vec2(123.34, 456.21));
    point += dot(point, point + 45.32);
    return fract(point.x * point.y);
  }

  float valueNoise(vec2 point) {
    vec2 cell = floor(point);
    vec2 local = fract(point);
    local = local * local * (3.0 - 2.0 * local);
    float a = hash21(cell);
    float b = hash21(cell + vec2(1.0, 0.0));
    float c = hash21(cell + vec2(0.0, 1.0));
    float d = hash21(cell + vec2(1.0, 1.0));
    return mix(mix(a, b, local.x), mix(c, d, local.x), local.y) * 2.0 - 1.0;
  }

  float cymaticField(vec2 point, float time, float frequency) {
    vec2 source1 = vec2(0.30, 0.70);
    vec2 source2 = vec2(0.70, 0.30);
    vec2 source3 = vec2(0.20, 0.20);
    vec2 source4 = vec2(0.80, 0.80);
    vec2 source5 = vec2(0.50, 0.50);

    float w1 = sin(distance(point, source1) * frequency * 6.28318 - time * 2.00);
    float w2 = sin(distance(point, source2) * frequency * 6.28318 - time * 1.70);
    float w3 = sin(distance(point, source3) * frequency * 6.28318 - time * 2.30);
    float w4 = sin(distance(point, source4) * frequency * 6.28318 - time * 1.90);
    float w5 = sin(distance(point, source5) * frequency * 6.28318 - time * 2.10);
    return (w1 + w2 + w3 + w4 + w5) / 5.0;
  }

  float nodeBand(float wave, float inner, float outer) {
    float absoluteWave = abs(wave);
    return smoothstep(outer, inner, absoluteWave);
  }

  float sandDensity(vec2 point, float time, float frequency) {
    float primaryWave = cymaticField(point, time, frequency);
    float primaryNodes = nodeBand(primaryWave, 0.018, 0.13);

    float harmonicWave = cymaticField(point * 1.7, time * 1.3, frequency * 1.5);
    float harmonicNodes = nodeBand(harmonicWave, 0.015, 0.095);

    float modulation = valueNoise(point * 8.0 + vec2(time * 0.018, -time * 0.012));
    float microScatter = hash21(floor(point * uResolution * 0.72));

    float density = mix(primaryNodes, harmonicNodes, 0.28);
    density += modulation * 0.075;
    density *= mix(0.42, 1.0, smoothstep(0.18, 0.95, microScatter));
    density += smoothstep(0.985, 1.0, microScatter) * 0.34;
    return clamp(density, 0.0, 1.0);
  }

  float manifestGeometry(vec2 point, float frequency) {
    vec2 centered = point - 0.5;
    float radius = length(centered);
    float angle = atan(centered.y, centered.x);
    float rings = nodeBand(sin(radius * (frequency + 4.0) * 18.0), 0.0, 0.16);
    float spokes = nodeBand(sin(angle * 8.0 + radius * 10.0), 0.0, 0.12);
    float latticeX = nodeBand(sin(centered.x * (frequency + 2.0) * 20.0), 0.0, 0.10);
    float latticeY = nodeBand(sin(centered.y * (frequency + 2.0) * 20.0), 0.0, 0.10);
    return clamp(max(rings * 0.72 + spokes * 0.55, latticeX * latticeY), 0.0, 1.0);
  }

  void main() {
    vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
    vec2 point = vUv;
    vec2 centered = (vUv - 0.5) * aspect;

    float scrollEnergy = min(abs(uScrollSpeed) * uScrollAccelerationMultiplier, 1.8);
    float frequency = 3.0 + scrollEnergy * 8.0;
    float time = uTime * max(uFlowVelocityScale, 0.04);

    float rippleDistance = distance(point, uPointer);
    float ripple = sin(rippleDistance * 42.0 - uTime * 4.8)
      * exp(-rippleDistance * 7.0)
      * uPointerActive
      * uPointerInfluenceStrength;
    point += normalize(point - uPointer + vec2(0.0001)) * ripple * 0.075;

    point += vec2(
      sin(uTime * 0.05) * (0.0017 + uCameraDriftSpeed),
      cos(uTime * 0.03) * 0.0011
    );

    float sand = sandDensity(point, time, frequency);

    // One near-perfect lock every ~60 seconds: signal almost becoming language.
    float manifestWave = sin(uTime * 0.10472);
    float manifest = smoothstep(0.965, 0.998, manifestWave);
    float geometry = manifestGeometry(point, frequency);
    sand = mix(sand, geometry, manifest * 0.78);

    vec3 darkGold = vec3(0.25, 0.18, 0.04);
    vec3 brightGold = vec3(0.96, 0.85, 0.51);
    vec3 color = mix(uColorBase, uColorSecondary, 0.045);
    color = mix(color, darkGold, smoothstep(0.06, 0.28, sand));
    color = mix(color, uColorPrimary, smoothstep(0.28, 0.62, sand));
    color = mix(color, brightGold, smoothstep(0.62, 0.86, sand));
    color = mix(color, uColorSurface, smoothstep(0.86, 1.0, sand) * 0.72);
    color += uColorSurface * manifest * 0.045;
    color += uColorPrimary * uWhiteHotFlare * (0.055 + geometry * 0.08);

    float vignette = smoothstep(1.12, 0.18, length(centered * vec2(0.72, 1.0)));
    color = mix(uColorBase, color, 0.22 + vignette * 0.78);
    color += (hash21(gl_FragCoord.xy) - 0.5) * 0.018;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default airFragmentShader;
