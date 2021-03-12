#ifdef GL_ES
precision mediump float;
#endif

// uniform float u_time;
uniform vec2 u_resolution;
// uniform vec2 u_mouse;

uniform float scroll_x;
uniform float scroll_y;

uniform sampler2D u_tex0;
uniform sampler2D u_tex1;


void main(){
  vec2 coord = gl_FragCoord.xy / u_resolution;
  // turn the image upside down;
  coord.y = 1.0 - coord.y;

  coord.x = coord.x + scroll_x / u_resolution.x;

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