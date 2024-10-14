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
uniform vec2 mouse;
uniform float ak;
uniform float dirX;
uniform float dirY;
uniform float satOn;
uniform float proD;
uniform float u_time;
uniform float u_text1;
uniform float u_text2;
uniform float u_scale;
uniform float u_intDir;
uniform float u_intDir2;
uniform float u_sorted;
uniform float u_grain;
uniform float u_feed;
uniform float u_abro;
uniform float scrollOffset;
uniform float zoom;
uniform float u_disP;
uniform float u_boy;
uniform float u_syme;


float random (vec2 st) {
    return fract(sin(dot(st.xy,
      vec2(12.9898,78.233)))*
        43758.5453123);
}

float noised (in vec2 st) {
    vec2 i = floor(st);
    vec2 fu = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
     vec2 u = fu * fu * (3.0 - 1.0 * fu);
     return mix(a, b, u.x) +(c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
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

// fbm (fractional Brownian motion) function to add layers of noise
float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.8;
    vec2 shift = vec2(10.0);
    for (int i = 0; i < 10; i++) {
        value += amplitude * noise(st);
        st = st * 2.0 + shift;
        amplitude *= 0.6;
    }
    return value;
}

vec2 computeDisplacement(vec2 uv, float time) {
    float noiseScale = 1.0;          // Controls particle density
    float noiseSpeed = 0.1 ;           // Controls particle movement speed
    float displacementStrength = 0.0009; // Controls displacement amount

    // Use fbm for detailed noise
    float n = fbm(uv * noiseScale + time * noiseSpeed);

    // Map noise to an angle to create directional displacement
    float angle = n * PI * 2.0;

    // Compute displacement vector based on angle
    vec2 displacement = vec2(cos(angle), sin(angle)) * displacementStrength;

    return displacement;
}

vec2 kaleidoUV(vec2 uv, float segments) {
    float angle = atan(uv.y - 0.5, uv.x - 0.5);
    float radius = length(uv - vec2(0.5));
    angle = mod(angle, 2.0 * PI / segments);
    return vec2(cos(angle), sin(angle)) * radius + 0.5;
}





float edgeDetection(vec2 uv) {
    vec3 texColor = texture2D(img, uv).rgb;
    vec3 texColorRight = texture2D(img, uv + vec2(1.0 / resolution.x, 0.0)).rgb;
    vec3 texColorUp = texture2D(img, uv + vec2(0.0, 1.0 / resolution.y)).rgb;
    float edge = length(texColor - texColorRight) + length(texColor - texColorUp);
    return edge;
}


float grain(vec2 st) {
    return random(st); // Moving random noise for grain
}
void main() {


  vec2 uv = gl_FragCoord.xy / resolution;


    vec2 center = vec2(0.5, 0.5);

    // uv = (uv - center) / zoom + center;
    uv = (uv - mouse) / zoom + mouse;

    uv = mod(uv,1.0);

  uv.y = 1. - uv.y;

  vec2 displacement2 = computeDisplacement(uv, u_time);


  vec2 displacedUV = uv + displacement2;

float pixelSize = 5.0; // Adjust the pixel size
vec2 pixelatedUV = floor(uv * resolution.xy / pixelSize) * pixelSize / resolution.xy;

if(u_syme > 1.0){
uv = kaleidoUV(uv, u_syme); // Use 6 segments for hexagonal symmetry
}

  vec2 offset;
  vec2 pgCol;


  if(u_text1 == 0.0){
   offset = vec2(texture2D(pg2, uv).r * 5. * ak ) * vec2(1./resolution.x, 1./resolution.y) * sin(noised(uv*2.0));  //* ceil(noised(uv/1.0));  //;
  //  offset = vec2(texture2D(pg2, uv).r * 10. * ak ) * vec2(1./resolution.x, 1./resolution.y)  * noised(uv*u_scale);
  }else if(u_text1 == 1.0){
   offset = vec2(texture2D(pg2, uv).r * 5. * ak ) * vec2(1./resolution.x, 1./resolution.y) * noise(uv*u_scale); 
  }else{
   offset = vec2(texture2D(pg2, uv).r * 5. * ak ) * vec2(1./resolution.x, 1./resolution.y);
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



vec2 displacement = texture2D(img, vec2(uv.x,uv.y)).rg * (0.01 + u_disP);

float glitchLine = step(0.99, fract(sin(uv.y * 1000.0 + u_time * 10.0) * SEED));
vec2 glitchOffset = vec2(glitchLine * 0.05, 0.0); // Adjust intensity


    

vec3 c;

if(u_sorted == 1.0){
c = texture2D(img, displacedUV - offset).rgb;
c -= texture2D(img, displacedUV - displacement * u_intDir).rgb * 0.9;
c += texture2D(img, displacedUV  + displacement * u_intDir).rgb * 0.9;
}else{
c = texture2D(img, uv - offset).rgb;
c -= texture2D(img, displacedUV - displacement * u_intDir).rgb * 0.9;
c += texture2D(img, displacedUV  + displacement * u_intDir).rgb * 0.9;

// c -= texture2D(img, pixelatedUV - displacement * u_intDir).rgb * 0.9;
// c += texture2D(img, pixelatedUV  + displacement * u_intDir).rgb * 0.9;

}


// --- Datamosh Effect Using Previous Frame ---

    // Sample the previous frame at current UV
    vec3 prevColor = texture2D(img, uv).rgb;

    // Compute frame difference
    vec3 frameDifference = c - prevColor;

    // Compute motion vector field based on frame difference
    vec2 motionVector = frameDifference.rg * 0.01; // Adjust scaling as needed

    // Apply motion vector to UV coordinates
    vec2 moshUV = uv + motionVector;

    // Ensure moshUV stays within [0.0, 1.0]
    moshUV = mod(moshUV, 1.0);

    // Sample the previous frame with displaced UVs
    vec3 moshColor = texture2D(img, moshUV).rgb;

    // Blend the mosh color with the current color
    float feedbackAmount = u_feed; // Adjust for desired effect
    c = mix(c, moshColor, feedbackAmount);


    // c = clamp(c, 0.0, 1.0);




float crosshairSize = 0.005;
float crosshair = step(abs(uv.x ), crosshairSize) + step(abs(uv.y), crosshairSize) + step(abs(1.0 - uv.x ), crosshairSize) + step(abs(1.0 - uv.y ), crosshairSize);
c = mix(c, vec3(1.0,1.0,1.0) , crosshair);


float crosshairSize2 = 0.0005;
float crosshair2 = step(abs(uv.x ), crosshairSize2) + step(abs(uv.y), crosshairSize2) + step(abs(1.0 - uv.x ), crosshairSize2) + step(abs(1.0 - uv.y ), crosshairSize2);

if(zoom < 0.995 || u_boy == 1.0){
c = mix(c, vec3(0.0) , crosshair2);
}else{
c = mix(c, vec3(1.0) , crosshair2);
}



float edge = edgeDetection(uv);

// Optionally adjust the edge value
// edge = clamp(edge, 0.0, 1.0);

// Blend the edge with the original color

c = mix(c, vec3(0.0,0.0,0.0), edge * 0.09); 

c += vec3(0.002);

float grainEffect = grain(uv) * 0.0015;


if(u_grain == 1.0){
c += vec3(grainEffect);
}




float aberrationAmount = 0.0002; // Adjust for intensity
vec2 aberrationOffset = vec2(aberrationAmount, 0.0);


float r = texture2D(img, uv - offset + vec2(aberrationOffset.x, 0.0)).r;
float g = texture2D(img, uv - offset).g;
float b = texture2D(img, uv - offset - vec2(aberrationOffset.x, 0.0)).b;


vec3 chro = vec3(r, g, b);

if(u_abro == 1.0){

c = mix(c, chro, 0.1);////0.9 bayay iyi
}


// vec3 currentFrame = c;
// vec3 previousFrame = texture2D(img, uv).rgb;
// c = mix(previousFrame, currentFrame, 0.5); // Adjust blending factor

// float dist = distance(uv, vec2(0.5));
// float vignette = smoothstep(0.8, 0.5, dist);
// c *= vignette;




gl_FragColor = vec4(c, 1.0);
}