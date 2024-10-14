#ifdef GL_ES
precision highp float;
#endif
#define PI 3.14159265359
const float PHI = 1.61803398874989484820459;
const float SEED = 43758.0;
uniform vec2 resolution;
uniform sampler2D pg;
uniform sampler2D pg2;
uniform sampler2D img;
uniform float ak;
uniform float dirX;
uniform float dirY;
uniform float satOn;
uniform float proD;
uniform float u_time;
uniform float u_text1;
uniform float u_text2;
uniform float u_scale;
uniform sampler2D previousFrame;
uniform sampler2D asciiTexture;
uniform sampler2D maskTexture;



float random (vec2 st) {
    return fract(sin(dot(st.xy,
      vec2(12.9898,78.233)))*
        43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 fu = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
     vec2 u = fu * fu * (3.0 - 2.0 * fu);
     return mix(a, b, u.x) +(c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}


vec3 quantize(vec3 color, float levels) {
    return floor(color * levels) / levels;
}

// float edgeDetection(vec2 uv) {
//     float edgeThreshold = 0.99;
//     vec3 texColor = texture2D(img, uv).rgb;
//     vec3 texColorRight = texture2D(img, uv + vec2(1.0 / resolution.x, 0.0)).rgb;
//     vec3 texColorUp = texture2D(img, uv + vec2(0.0, 1.0 / resolution.y)).rgb;
//     float edge = length(texColor - texColorRight) + length(texColor - texColorUp);
//     return step(edgeThreshold, edge);
// }

float edgeDetection(vec2 uv) {
    vec3 texColor = texture2D(img, uv).rgb;
    vec3 texColorRight = texture2D(img, uv + vec2(1.0 / resolution.x, 0.0)).rgb;
    vec3 texColorUp = texture2D(img, uv + vec2(0.0, 1.0 / resolution.y)).rgb;
    float edge = length(texColor - texColorRight) + length(texColor - texColorUp);
    return edge;
}

float blurEdge(vec2 uv) {
    float sum = 0.0;
    vec2 texelSize = 1.0 / resolution.xy;

    sum += edgeDetection(uv + vec2(-texelSize.x, -texelSize.y));
    sum += edgeDetection(uv + vec2(0.0, -texelSize.y));
    sum += edgeDetection(uv + vec2(texelSize.x, -texelSize.y));

    sum += edgeDetection(uv + vec2(-texelSize.x, 0.0));
    sum += edgeDetection(uv + vec2(0.0, 0.0));
    sum += edgeDetection(uv + vec2(texelSize.x, 0.0));

    sum += edgeDetection(uv + vec2(-texelSize.x, texelSize.y));
    sum += edgeDetection(uv + vec2(0.0, texelSize.y));
    sum += edgeDetection(uv + vec2(texelSize.x, texelSize.y));

    sum /= 9.0; // Average the values
    return sum;
}




float moirePattern(vec2 uv, float scale) {
    return sin((uv.x + uv.y) * scale) * sin((uv.x - uv.y) * scale);
}


float freqEffect(vec2 uv) {
    float freq = sin(uv.x * 100.0 + u_time / 1.0) * sin(uv.y * 100.0 + u_time / 1.0);
    return freq;
}

float cellularAutomaton(vec2 uv) {
    vec2 cell = floor(uv * resolution.xy / 100.0); // Cell size
    float state = mod(cell.x + cell.y + floor(u_time), 2.0);
    return state;
}

vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  uv.y = 1. - uv.y;

float pixelSize = 5.0; // Adjust the pixel size
vec2 pixelatedUV = floor(uv * resolution.xy / pixelSize) * pixelSize / resolution.xy;

  vec2 offset;
  vec2 pgCol;


  if(u_text1 == 0.0){
   offset = vec2(texture2D(pg2, uv).r * 10. * 10.0 ) * vec2(1./resolution.x, 1./resolution.y) ;  //* ceil(random(uv/1.0));
  }else{
   offset = vec2(texture2D(pg2, uv).r * 10. * 10.0 ) * vec2(1./resolution.x, 1./resolution.y) * noise(uv*u_scale); 
  }
  
  //
  pgCol = vec2(texture2D(pg, uv));
  

if(satOn == 1.0){/////sadece düz
  if(pgCol.x < proD) offset.x *= dirX * -1.;
   else offset.x *= dirX;
  if(pgCol.y < proD) offset.y *= dirY * -1.;
   else  offset.y *= dirY;
}else if(satOn == 2.0){////bu kose
    if(pgCol.x < .5) offset.x *= -1.;
      else if(pgCol.x < 1.) offset.x *= dirX;
    if(pgCol.y < .5) offset.y *= -1.;
      else if(pgCol.y < 1.) offset.y *= dirY;
  }else if(satOn == 3.0){////////bu da hepsi
    if(pgCol.x < .1) offset.x *= -1.;
      else offset.x *= dirX;
    if(pgCol.y < .1) offset.y *= -1.;
      else  offset.y *= dirY;
  }else if(satOn == 4.0){
    float ss = smoothstep(sin(u_time) - 0.006,cos(u_time),uv.y) - smoothstep(cos(u_time),sin(u_time)+ 0.006,uv.y);
    float ss2 = smoothstep(cos(u_time) - 0.006,sin(u_time),uv.x) - smoothstep(sin(u_time),cos(u_time)+ 0.006,uv.x);
   if(pgCol.x < .1) offset.x *=  -1. * ss2;
    else if(pgCol.x < 1.) offset.x *= 1. * ss2;
    if(pgCol.y < .1) offset.y *= -1. * cos(u_time);
    else if(pgCol.y < 1.) offset.y *= 1. * cos(u_time);
    }



float glitchLine = step(0.98, cos(sin((uv.x) * 1000.0) * SEED));
vec2 glitchLineOffset = vec2(0.0, glitchLine * 0.1);

float sortValue = fract(sin(dot(uv.xy, vec2(12.9898,78.233))) * 43758.5453123);
vec2 sortedUV = uv;
sortedUV.y = mix(uv.y, sortValue, 0.01); // Adjust blending factor


vec2 displacement = texture2D(img, uv).rg * 0.1;


// float rippleFrequency = 10.0;
// float rippleAmplitude = 0.005;
// float ripple = sin(distance(uv, vec2(0.5)) * rippleFrequency - u_time * 5.0);
// vec2 rippleUV = uv + normalize(uv - vec2(0.5)) * ripple * rippleAmplitude;
// vec3 c = texture2D(img, rippleUV - offset).rgb;



vec3 c = texture2D(img, uv - offset  * displacement ).rgb;


c -= texture2D(img, uv + ceil(random(uv/1.0)) - offset).rgb;
c += texture2D(img,  uv + ceil(random(uv/1.0)) + offset).rgb;


// float crosshairSize = 0.01;
// float crosshair = step(abs(uv.x ), crosshairSize) + step(abs(uv.y), crosshairSize) + step(abs(1.0 - uv.x ), crosshairSize) + step(abs(1.0 - uv.y ), crosshairSize);
// c = mix(c, vec3(1.0), crosshair);

// float scanlineIntensity = 0.1;
// float scanline = sin(uv.y * resolution.y * PI);
// c *= 1.0 - scanlineIntensity * scanline;

float levels = 50.0; // Adjust the number of levels as desired
c = quantize(c, levels);

// float noiseAmount = 0.05;
// float noiseValue = (random(uv) - 0.5) * noiseAmount;
// c += vec3(noiseValue);



// float moire = moirePattern(uv, 400.0); // Adjust scale
// c += vec3(moire * 0.05); // Adjust intensity



// float syncLine = step(0.5, fract(uv.y * resolution.y / 5.0));
// c *= 1.0 - syncLine * 0.5; // Darken the color

float edge = edgeDetection(uv);
// c = mix(c, vec3(1.0), edge); // Mix with white color

// float edge = blurEdge(uv);

// Optionally adjust the edge value
// edge = clamp(edge, 0.0, 1.0);

// Blend the edge with the original color
c = mix(c, vec3(1.0), edge * 0.09); // Adjust blending factor as needed

// c += vec3(0.01);


gl_FragColor = vec4(c, 1.0);
}