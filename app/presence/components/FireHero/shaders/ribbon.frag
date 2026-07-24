precision highp float;

uniform float uTime;
uniform float uTravel;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uPointerPresence;
uniform float uScrollSpeed;
uniform float uWhiteHotFlare;
uniform float uRaySteps;
uniform float uDetail;
uniform float uMotionScale;

varying vec2 vUv;

/*__NOISE__*/
/*__COMPOSITING__*/

const int MAX_RAY_STEPS = 24;

float ribbonDensity(vec3 point, vec3 flow, float depth) {
  vec3 q = point;
  float depthFlow = 0.14 + depth * 0.035;
  q.xy += flow.xy * depthFlow;
  q.x += sin(q.y * 0.91 + q.z * 0.41) * 0.19;
  q.y += sin(q.x * 0.57 - q.z * 0.33) * 0.11;

  // Anisotropic sampling stretches the zero-crossings into long, folding
  // sheets instead of producing cloud-like blobs or recognizable flames.
  vec3 broadPoint = vec3(
    q.x * 0.67 + q.y * 0.14,
    q.y * 1.31,
    q.z * 0.43
  );
  float broad = snoise(broadPoint + vec3(1.7, -2.1, 0.0));
  float field = broad;

  if (uDetail > 0.05) {
    vec3 finePoint = vec3(
      q.x * 1.43 - q.y * 0.20,
      q.y * 2.17,
      q.z * 0.83
    );
    float fine = snoise(finePoint + vec3(-4.3, 3.1, 6.7));
    field = mix(broad, broad * 0.73 + fine * 0.27, uDetail);
  }

  float fold = field + sin(q.x * 0.43 + q.y * 0.17 + q.z * 0.23) * 0.16;
  float ridge = max(1.0 - abs(fold), 0.0);
  ridge *= ridge;
  ridge *= ridge;

  float brokenEdge = 0.68 + 0.32 * sin(
    q.y * 1.37 - q.z * 0.51 + broad * 2.2
  );
  float hollowCore = smoothstep(0.30, 0.78, ridge);
  return hollowCore * max(brokenEdge, 0.0);
}

void main() {
  vec2 centered = vUv * 2.0 - 1.0;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 sceneUv = vec2(centered.x * aspect, centered.y);
  vec2 pointer = uPointer * vec2(aspect, 1.0);

  vec3 rayOrigin = vec3(0.0, 0.0, -2.45);
  vec3 rayDirection = normalize(vec3(sceneUv * 0.69, 1.58));
  vec3 flow = curlNoise(
    vec3(sceneUv * 0.54, uTravel * 0.18 + uTime * 0.015 * uMotionScale)
  );

  vec3 accumulated = vec3(0.0);
  float accumulatedAlpha = 0.0;
  float jitter = hash12(gl_FragCoord.xy) * 0.72;
  float stepSpan = 3.65 / max(uRaySteps, 1.0);

  for (int index = 0; index < MAX_RAY_STEPS; index++) {
    float sampleIndex = float(index);
    if (sampleIndex >= uRaySteps) continue;

    float distanceAlongRay = 0.31 + (sampleIndex + jitter) * stepSpan;
    vec3 point = rayOrigin + rayDirection * distanceAlongRay;
    point.z += uTravel;

    vec2 pointerDelta = sceneUv - pointer * 0.72;
    float pointerFalloff = exp(-dot(pointerDelta, pointerDelta) * 1.24);
    float pointerDepth = 1.0 / (1.0 + distanceAlongRay * 0.16);
    point.xy += pointer * pointerFalloff * pointerDepth * 0.18 * uPointerPresence;
    point.xy += vec2(-pointerDelta.y, pointerDelta.x) *
      pointerFalloff * 0.035 * uPointerPresence;

    float autonomousDrift = uTime * 0.033 * uMotionScale;
    point.x += sin(point.z * 0.38 + autonomousDrift) * 0.10;
    point.y += cos(point.z * 0.31 - autonomousDrift * 0.8) * 0.07;

    float density = ribbonDensity(point, flow, distanceAlongRay);
    float nearFade = smoothstep(0.30, 0.78, distanceAlongRay);
    float farFade = 1.0 - smoothstep(2.85, 3.95, distanceAlongRay);
    density *= nearFade * farFade;

    float scrollHeat = 1.0 + uScrollSpeed * 0.20;
    float heat = clamp(density * 1.33 * scrollHeat, 0.0, 1.0);
    float hotCore = smoothstep(0.58, 0.96, heat);
    heat = clamp(heat + hotCore * uWhiteHotFlare * 0.25, 0.0, 1.0);

    float absorption = density * (5.8 / max(uRaySteps, 1.0));
    float sampleAlpha = (1.0 - exp(-absorption)) * farFade;
    sampleAlpha *= 1.0 - accumulatedAlpha;

    vec3 sampleColor = emberTemperature(heat, uWhiteHotFlare);
    accumulated += sampleColor * sampleAlpha;
    accumulatedAlpha += sampleAlpha;
  }

  float grain = hash12(
    gl_FragCoord.xy + vec2(floor(uTime * 8.0), floor(uTime * 5.0))
  );
  vec3 color = compositeEmberVolume(
    accumulated,
    accumulatedAlpha,
    centered,
    uWhiteHotFlare,
    grain
  );

  gl_FragColor = vec4(color, 1.0);
}
