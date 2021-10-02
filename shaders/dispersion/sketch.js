//this variable will hold our shader object
let simpleShader;

function preload(){
  // a shader is composed of two parts, a vertex shader, and a fragment shader
  // the vertex shader prepares the vertices and geometry to be drawn
  // the fragment shader renders the actual pixel colors
  // loadShader() is asynchronous so it needs to be in preload
  // loadShader() first takes the filename of a vertex shader, and then a frag shader
  // these file types are usually .vert and .frag, but you can actually use anything. .glsl is another common one
  simpleShader = loadShader('basic.vert', 'basic.frag');
  pupImg = loadImage('../ripple/dog.jpg');
  // pupImg = loadImage('https://dl.dropboxusercontent.com/s/e46t8kejtmny2ia/01HROSKI_1.png');
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
}

function draw() {  
  // shader() sets the active shader with our shader
  shader(simpleShader);
  simpleShader.setUniform('tex0', pupImg);
  simpleShader.setUniform('time', frameCount * 0.01);
  simpleShader.setUniform('iResolution', [width, height]);

  // rect gives us some geometry on the screen
  rect(0,0,width, height);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}