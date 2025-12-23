const fragment = /* glsl */ `
  const int LIGHTNING_PARTS = 10;

  uniform float iTime;
  uniform vec3 iResolution;

  float hash(float x) {
    return fract(21654.6512 * sin(385.51 * x));
  }

  float hash(vec2 p) {
    return fract(21654.65155 * sin(35.51 * p.x + 45.51 * p.y));
  }

  float lhash(float x, float y) {
    float h = 0.0;

    for(int i = 0;i < 5;i++) {
      h += (fract(21654.65155 * float(i) * sin(35.51 * x + 45.51 * float(i) * y * (5.0 / float(i))))* 2.0 - 1.0) / 10.0;
    }
    return h / 5.0 + 0.02;
    return (fract(21654.65155 * sin(35.51 * x + 45.51 * y))* 2.0 - 1.0) / 20.0;
  }

  float noise(vec2 p) {
    vec2 fl = floor(p);
    vec2 fr = fract(p);

    fr.x = smoothstep(0.0,1.0,fr.x);
    fr.y = smoothstep(0.0,1.0,fr.y);

    float a = mix(hash(fl + vec2(0.0,0.0)), hash(fl + vec2(1.0,0.0)),fr.x);
    float b = mix(hash(fl + vec2(0.0,1.0)), hash(fl + vec2(1.0,1.0)),fr.x);

    return mix(a,b,fr.y);
  }


  float distanceToSegment( vec2 a, vec2 b, vec2 p ) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );

    return length( pa - ba*h );
  }

  float fbm(vec2 p) {
    float v = 0.0, f = 1.0, a = 0.5;

    for(int i = 0;i < 5; i++)
    {
      v += noise(p * f) * a;

      f *= 2.0;
      a *= 0.5;
    }

    return v;
  }

  float lightning2(vec2 ls, vec2 le, float intensity,vec2 uv) {
    float f = 1.0;

    for(int i = 0;i < LIGHTNING_PARTS;i++) {
      vec2 ltemp1 = mix(ls,le,float(i) / float(LIGHTNING_PARTS));
      vec2 ltemp2 = mix(ls,le,float(i+1) / float(LIGHTNING_PARTS));
      float h3= fract(21654.65155 * sin(35.51 * ls.x));
      float lh1 = lhash(ltemp1.y, iTime);
      float lh2 = lhash(ltemp2.y, iTime);
      ltemp1.x += lh1;
      ltemp2.x += lh2;

      if(i == 0)
        f = min(f,distanceToSegment(ls, ltemp2, uv ));
      //else if(i == LIGHTNING_PARTS - 1)
        //f = min(f,distanceToSegment(ltemp1, le, uv ));
      else
        f = min(f,distanceToSegment(ltemp1, ltemp2, uv ));
      //if(abs(h3) > 0.07 && intensity > 0.1)
        //f = min(f,lightning(ltemp1, vec2(mix(ltemp1, le, 0.5) + vec2(lh1 * 3.0 - h3 * 5.0,h3 * 5.0)),intensity * 0.5,uv));

      //	f = min(f,distanceToSegment(ltemp1, vec2(mix(ltemp1, le, 0.5) + vec2(lh1 * 3.0 - h3 * 5.0,h3 * 5.0)),uv));
    }

    return f;
  }

  float lightning(vec2 ls, vec2 le, float intensity,vec2 uv) {
    if(intensity < 0.3)
      return 1.0;

    float f = 1.0;

    for(int i = 0;i < LIGHTNING_PARTS;i++) {
      vec2 ltemp1 = mix(ls,le,float(i) / float(LIGHTNING_PARTS));
      vec2 ltemp2 = mix(ls,le,float(i+1) / float(LIGHTNING_PARTS));
      float h3 = fract(22654.65155 * ls.x * sin(3542.51 * ltemp1.y * le.y)) - sqrt(ltemp1.y) + 0.6;
      float lh1 = lhash(ltemp1.y + ltemp1.x, iTime);
      float lh2 = lhash(ltemp2.y + ltemp2.x, iTime);
      ltemp1.x += lh1;
      ltemp2.x += lh2;

      if(i == 0)
        f = min(f,distanceToSegment(ls, ltemp2, uv ));
      else
        f = min(f,distanceToSegment(ltemp1, ltemp2, uv ));
      if(h3 > 0.9)
        f = min(f,sqrt(float(i + 2)) * lightning2(ltemp1, vec2(le.x + ltemp1.y + sqrt(h3) - 1.0 + lh1 * 7.0,le.y),intensity * 0.5,uv)) ;
    }

    return f;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;

    // Slow, organic drift of the gradient center
    vec2 center = vec2(0.5, 0.5);
    center.x += sin(iTime * 0.3) * 0.4;
    center.y += cos(iTime * 0.4) * 0.35;

    // Distance from drifting center
    float dist = distance(uv, center);

    // Add noise for subtle variation and "breathing"
    vec2 noiseCoord = uv * 2.0 + vec2(iTime * 0.15, iTime * 0.1);
    float noiseVal = fbm(noiseCoord) * 0.3;

    // Create radial gradient with noise
    float gradient = dist - noiseVal;
    gradient = smoothstep(0.0, 1.5, gradient);

    // Electric blue and black palette
    vec3 electricBlue = vec3(0.0, 0.0, 1.0);
    vec3 black = vec3(0.0, 0.0, 0.0);

    // Mix colors with breathing effect
    float breathe = sin(iTime * 0.2) * 0.5 + 0.5;
    vec3 col = mix(electricBlue, black, gradient);
    col = mix(col, black, breathe * 0.3); // Add subtle breathing

    // Soft vignette for cinematic feel
    float vignette = smoothstep(0.7, 0.3, dist);
    col *= vignette * 0.7 + 0.3;

    gl_FragColor = vec4(col, 1.0);
  }
`

export default fragment
