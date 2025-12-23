// 3D Perlin noise for mirror-like reflections
const cnoise = /* glsl */ `
  vec4 permute(vec4 x) {
      return mod(((x*34.0)+1.0)*x, 289.0);
  }
  vec4 taylorInvSqrt(vec4 r) {
      return 1.79284291400159 - 0.85373472095314 * r;
  }
  vec3 fade(vec3 t) {
      return t*t*t*(t*(t*6.0-15.0)+10.0);
  }

  float cnoise(vec3 P) {
    vec3 Pi0 = floor(P);
    vec3 Pi1 = Pi0 + vec3(1.0);
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P);
    vec3 Pf1 = Pf0 - vec3(1.0);
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 / 7.0;
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 / 7.0;
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);

    return 2.2 * n_xyz;
  }
`

const fragment = /* glsl */ `
  uniform float time;
  uniform sampler2D cardTexture;
  uniform sampler2D outline;
  uniform float fresnelMax;
  uniform float fresnelMultiplier;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  float PI = 3.141529;

  ${cnoise}

  // Noise functions from main page strikes shader
  float hash(vec2 p) {
    return fract(21654.65155 * sin(35.51 * p.x + 45.51 * p.y));
  }

  float noise(vec2 p) {
    vec2 fl = floor(p);
    vec2 fr = fract(p);

    fr.x = smoothstep(0.0, 1.0, fr.x);
    fr.y = smoothstep(0.0, 1.0, fr.y);

    float a = mix(hash(fl + vec2(0.0, 0.0)), hash(fl + vec2(1.0, 0.0)), fr.x);
    float b = mix(hash(fl + vec2(0.0, 1.0)), hash(fl + vec2(1.0, 1.0)), fr.x);

    return mix(a, b, fr.y);
  }

  float fbm(vec2 p) {
    float v = 0.0, f = 1.0, a = 0.5;

    for(int i = 0; i < 5; i++) {
      v += noise(p * f) * a;
      f *= 2.0;
      a *= 0.5;
    }

    return v;
  }

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    // Very subtle animated normal perturbation for shimmer effect
    vec2 perturbCoord = vUv * 3.0 + vec2(time * 0.2, time * 0.15);
    float perturbation = fbm(perturbCoord) * 0.08;
    vec3 perturbedNormal = normalize(normal + vec3(perturbation * 0.05, perturbation * 0.05, 0.0));

    // Create curved normal for smooth polished surface
    vec3 uvNormal = normalize(vec3((vUv - 0.5) * 0.9, 1.0));
    vec3 mixedNormal = normalize(mix(perturbedNormal, uvNormal, 0.6));

    // Fresnel calculation for polished glossy surface with minimal animation
    float fresnel = abs(dot(viewDir, mixedNormal));
    fresnel = fresnelMax - fresnel * fresnelMultiplier;

    // Add minimal animated variation to fresnel for shimmer
    float fresnelShimmer = sin(time * 1.5 + vUv.x * 10.0 + vUv.y * 8.0) * 0.02;
    fresnel += fresnelShimmer;
    fresnel = clamp(fresnel, 0.0, 1.0);

    // Main page radial spotlight lighting (copied from strikes shader)
    vec2 center = vec2(0.5, 0.5);
    center.x += sin(time * 0.3) * 0.4;
    center.y += cos(time * 0.4) * 0.35;

    // Distance from drifting center
    float dist = distance(vUv, center);

    // Add noise for subtle variation and "breathing"
    vec2 noiseCoord = vUv * 2.0 + vec2(time * 0.15, time * 0.1);
    float noiseVal = fbm(noiseCoord) * 0.3;

    // Create radial gradient with noise - smaller spotlight area
    float gradient = dist - noiseVal;
    gradient = smoothstep(0.0, 0.7, gradient);

    // Soft vignette for cinematic feel
    float vignette = smoothstep(0.7, 0.3, dist);

    // Rich dark black metallic surface colors
    vec3 baseColor = vec3(0.12, 0.12, 0.12);  // Darker grey for richer black
    vec3 darkBaseColor = vec3(0.02, 0.02, 0.02);  // Very deep black
    vec3 highlightColor = vec3(0.35, 0.35, 0.35);  // Subtle highlights for shine

    // Blend base color with fresnel for glossy effect
    vec3 shaded = mix(darkBaseColor, baseColor, fresnel);

    // Apply main page radial gradient and vignette
    shaded = mix(shaded * 1.5, shaded * 0.3, gradient);  // Brighter in center, darker at edges
    shaded *= vignette * 0.7 + 0.3;  // Apply vignette like main page

    // Spherical UV mapping for mirror-like reflections (like human figure)
    float phi = acos(vNormal.y);
    float angle = atan(vNormal.x, vNormal.z);
    vec2 fakeUv = vec2(dot(vec3(1.0), vNormal), dot(vec3(-1.0, 0.0, 1.0), vNormal));
    fakeUv = fract(fakeUv + vec2(time / 100.0, time / 50.0));
    vec2 sphericalUv = vec2((angle + PI) / (2.0 * PI), phi / PI);

    // Sample reflection texture with animated noise
    vec4 reflection = texture2D(outline, sphericalUv + 0.2 * cnoise(vec3(fakeUv * 0.2, time / 2.0)));

    // Blend reflection very subtly to preserve card text visibility
    shaded = mix(shaded, reflection.rgb * baseColor, fresnel * 0.08);

    // Add minimal animated specular highlights for shimmer
    vec2 specCoord = vUv + vec2(sin(time * 0.8) * 0.3, cos(time * 0.6) * 0.3);
    float specNoise = fbm(specCoord * 4.0) * 0.5;
    float specular = pow(fresnel, 3.0) * specNoise;
    vec3 specularHighlight = highlightColor * specular * 0.1;
    shaded += specularHighlight;

    // Sample card texture and use alpha channel for masking
    // Brightness-based masking can't compensate for alpha transparency baked into texture pixels
    vec4 txt = texture2D(cardTexture, vUv);
    float textMask = txt.a;  // Use alpha channel directly
    vec3 color = mix(shaded, txt.rgb, textMask);

    gl_FragColor = vec4(color, 1.0);
  }
`

export default fragment
