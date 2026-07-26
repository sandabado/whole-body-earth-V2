const cosmicFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uOctaves;

  varying vec2 vUv;

  float hash21(vec2 point) {
    point = fract(point * vec2(123.34, 456.21));
    point += dot(point, point + 45.32);
    return fract(point.x * point.y);
  }

  float noise(vec2 point) {
    vec2 cell = floor(point);
    vec2 local = fract(point);
    local = local * local * (3.0 - 2.0 * local);
    return mix(
      mix(hash21(cell), hash21(cell + vec2(1.0, 0.0)), local.x),
      mix(hash21(cell + vec2(0.0, 1.0)), hash21(cell + vec2(1.0)), local.x),
      local.y
    );
  }

  float fbm(vec2 point) {
    float value = 0.0;
    float amplitude = 0.52;
    mat2 turn = mat2(0.80, -0.60, 0.60, 0.80);
    for (int octave = 0; octave < 5; octave++) {
      if (float(octave) >= uOctaves) break;
      value += amplitude * noise(point);
      point = turn * point * 2.03 + 17.17;
      amplitude *= 0.48;
    }
    return value;
  }

  void main() {
    vec2 centered = vUv - 0.5;
    centered.x *= uResolution.x / max(uResolution.y, 1.0);

    float time = uTime * 0.022;
    vec2 field = centered * 2.25;
    vec2 warp = vec2(
      fbm(field * 0.72 + vec2(time, -time * 0.54)),
      fbm(field * 0.68 + vec2(-time * 0.41, time * 0.63) + 8.4)
    ) - 0.5;

    float broad = fbm(field + warp * 1.85 + vec2(time * 0.31, 0.0));
    float ribbon = fbm(
      field * 1.82
      + warp * 2.35
      + vec2(-time * 0.18, time * 0.24)
      + 21.7
    );
    float veil = fbm(
      mat2(0.92, -0.38, 0.38, 0.92) * field * 0.58
      + vec2(time * 0.12, -time * 0.16)
      + 42.1
    );

    float density = smoothstep(0.35, 0.82, broad * 0.62 + ribbon * 0.42);
    float filaments = smoothstep(0.58, 0.88, ribbon) * smoothstep(0.25, 0.72, broad);
    float atmosphere = smoothstep(0.22, 0.84, veil);

    vec3 voidColor = vec3(0.007, 0.011, 0.025);
    vec3 navy = vec3(0.039, 0.102, 0.247);
    vec3 violet = vec3(0.180, 0.102, 0.278);
    vec3 teal = vec3(0.102, 0.227, 0.322);

    vec3 nebula = mix(navy, violet, smoothstep(0.28, 0.78, ribbon));
    nebula = mix(nebula, teal, filaments * 0.62 + atmosphere * 0.14);

    float nebulaAlpha = min(
      0.40,
      density * 0.27 + filaments * 0.12 + atmosphere * 0.055
    );
    vec3 color = mix(voidColor, nebula, nebulaAlpha);

    float vignette = smoothstep(1.12, 0.18, length(centered * vec2(0.72, 1.0)));
    color *= 0.54 + vignette * 0.46;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default cosmicFragmentShader;
