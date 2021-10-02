precision mediump float;

varying vec2 vTexCoord;
uniform sampler2D tex0;
uniform float time;

// Params = (wave frequency in Hz, number of waves per unit distance)
//
vec2 params=vec2(2.5,10.);

// Simple circular wave function
float wave(vec2 pos,float t,float freq,float numWaves,vec2 center){
  float d=length(pos-center);
  d=log(1.+exp(d));
  return 1./(1.+20.*d*d)*
  sin(2.*3.1415*(-numWaves*d+t*freq));
}

// This height map combines a couple of waves
float height(vec2 pos,float t){
  float w;
  w=wave(pos,t,params.x,params.y,vec2(.5,-.5));
  w+=wave(pos,t,params.x,params.y,-vec2(.5,-.5));
  return w;
}

// Discrete differentiation
vec2 normal(vec2 pos,float t){
  return vec2(height(pos-vec2(.01,0),t)-height(pos,t),
  height(pos-vec2(0,.01),t)-height(pos,t));
}

// // Simple ripple effect
// void mainImage(out vec4 fragColor,in vec2 fragCoord){
//   // if (iMouse.z > 0.0) params = 2.0*params*iMouse.xy/iResolution.xy;
//   else params=vec2(2.5,10.);
  
  void main(){
    vec2 uv = vTexCoord;

    vec2 uvn=2.*uv-vec2(1.);
    uv+=normal(uvn,time);
    gl_FragColor=texture2D(tex0,vec2(1.-uv.x,uv.y));
  }