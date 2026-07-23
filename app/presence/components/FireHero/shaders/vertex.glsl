precision highp float;

varying vec2 vUv;

void main() {
  vUv = uv;
  // The geometry is a clip-space plane. It remains full-screen while the
  // apparent camera travel happens inside the volume in the fragment shader.
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
