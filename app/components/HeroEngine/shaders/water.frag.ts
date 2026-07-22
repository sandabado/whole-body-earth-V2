const waterFragmentShader = /* glsl */ `
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
  uniform float uFluidDissipation;
  uniform float uFlowVelocityScale;
  uniform float uCurlNoiseAmplitude;
  uniform float uCameraDriftSpeed;
  uniform float uCameraRotationDegrees;
  uniform float uPointerInfluenceStrength;
  uniform float uScrollAccelerationMultiplier;
  uniform float uWhiteHotFlare;

  varying vec2 vUv;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
      mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.52;
    mat2 rotation = mat2(0.80, -0.60, 0.60, 0.80);
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p = rotation * p * 2.04 + 13.7;
      amplitude *= 0.49;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    vec2 centered = uv - 0.5;
    centered.x *= uResolution.x / max(uResolution.y, 1.0);

    float rotation = radians(uCameraRotationDegrees) * sin(uTime * (0.16 + uCameraDriftSpeed * 350.0));
    mat2 cameraTurn = mat2(cos(rotation), -sin(rotation), sin(rotation), cos(rotation));
    centered = cameraTurn * centered;

    float heavyScroll = 1.0 + abs(uScrollSpeed) * uScrollAccelerationMultiplier * 2.4;
    float time = uTime * uFlowVelocityScale / heavyScroll;
    vec2 domain = centered * 1.42;
    vec2 flow = vec2(
      fbm(domain * 1.45 + vec2(time * 0.22, -time * 0.15)),
      fbm(domain * 1.35 + vec2(-time * 0.12, time * 0.19) + 8.3)
    ) - 0.5;
    domain += flow * (0.72 + uCurlNoiseAmplitude * 1.35);

    vec2 pointer = uPointer - 0.5;
    pointer.x *= uResolution.x / max(uResolution.y, 1.0);
    float rippleDistance = distance(centered, pointer);
    float ripple = sin(rippleDistance * 32.0 - uTime * 2.1)
      * exp(-rippleDistance * 5.8)
      * uPointerActive
      * (0.22 + uPointerInfluenceStrength * 5.0);
    domain += normalize(centered - pointer + vec2(0.0001)) * ripple;

    float fieldA = fbm(domain * 2.15 + vec2(time * 0.32, -time * 0.18));
    float fieldB = fbm(domain * 3.35 - flow * 1.6 - vec2(time * 0.13, time * 0.11));
    float density = smoothstep(0.18, 0.88, fieldA * 0.72 + fieldB * 0.48);

    vec2 causticUv = domain * 5.2 + flow * 4.0;
    float causticA = abs(sin(causticUv.x + time * 1.2) + sin(causticUv.y * 1.18 - time * 0.75));
    float causticB = abs(sin((causticUv.x + causticUv.y) * 0.72 - time * 0.58));
    float caustic = 1.0 - smoothstep(0.18, 0.72, causticA * causticB);
    caustic *= smoothstep(0.18, 0.9, density) * 0.68;

    float depth = smoothstep(-0.48, 0.72, centered.y + fieldA * 0.38);
    vec3 color = mix(uColorBase, uColorSecondary, density * 0.8 * uFluidDissipation);
    color = mix(color, uColorPrimary, (density * 0.48 + caustic * 0.42) * depth);

    float surface = smoothstep(0.34, 0.96, centered.y + 0.5) * (0.12 + caustic * 0.42);
    color = mix(color, uColorSurface, surface * 0.3);
    color += uColorPrimary * caustic * 0.18;
    color += uColorSurface * uWhiteHotFlare * (0.06 + caustic * 0.16);

    float vignette = smoothstep(1.05, 0.18, length(centered * vec2(0.72, 1.0)));
    color = mix(uColorBase, color, 0.34 + vignette * 0.66);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default waterFragmentShader;
