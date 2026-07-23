vec3 emberTemperature(float heat, float flare) {
  vec3 black = vec3(0.0196);
  vec3 deep = vec3(0.20, 0.025, 0.010);
  vec3 red = vec3(0.52, 0.085, 0.025);
  vec3 ember = vec3(0.91, 0.33, 0.16);
  vec3 gold = vec3(1.0, 0.64, 0.31);
  vec3 bone = vec3(0.929);

  vec3 color = mix(black, deep, smoothstep(0.02, 0.22, heat));
  color = mix(color, red, smoothstep(0.18, 0.45, heat));
  color = mix(color, ember, smoothstep(0.40, 0.72, heat));
  color = mix(color, gold, smoothstep(0.68, 0.91, heat));

  float whiteCore = smoothstep(0.78, 1.0, heat) * (0.18 + flare * 0.82);
  return mix(color, bone, whiteCore);
}

vec3 compositeEmberVolume(
  vec3 volume,
  float opacity,
  vec2 centeredUv,
  float flare,
  float grain
) {
  vec3 background = vec3(0.0196, 0.0165, 0.0145);
  float vignette = 1.0 - smoothstep(0.18, 1.45, length(centeredUv));
  vec3 color = background + volume * (0.88 + vignette * 0.16);

  // The flare lifts existing hot material; the background never flashes.
  color += volume * flare * opacity * 0.10;
  color *= 0.80 + vignette * 0.20;
  color += (grain - 0.5) * 0.012 * (0.25 + opacity);
  return max(color, vec3(0.0));
}
