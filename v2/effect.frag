#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
// uniform vec2 u_mouse;

uniform float scroll_x;
uniform float scroll_y;

uniform sampler2D u_tex0;
uniform sampler2D u_tex1;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float noise1d(float v){
    return cos(v + cos(v * 90.1415) * 100.1415) * 0.5 + 0.5;
}

void main(){
  vec2 coord = gl_FragCoord.xy / u_resolution;
  // turn the image upside down;
  coord.y = 1.0 - coord.y;

  // follow the x_scroll
  coord.x = coord.x + scroll_x / u_resolution.x;

  // add a bit random to the x
  coord.x += sin(u_time / 2.0) * 0.03 * noise1d(u_time / 10000.0);

  // zoom in
  coord = coord / 2.0;

  float mixValue = scroll_y / u_resolution.y;
  vec4 image;
  if (coord.y < mixValue) {
    coord.y = coord.y + 1.0 - mixValue;
    image = texture2D(u_tex0, coord);
  } else {
    coord.y -= mixValue; 
    image = texture2D(u_tex1, coord);
  }

  gl_FragColor = vec4(image);
}