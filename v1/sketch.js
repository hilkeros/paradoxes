// a shader variable
let theShader;
let images;

function preload(){
  // load the shader
  theShader = loadShader('effect.vert', 'effect.frag');
  
  images = [loadImage('../numberimages/number1.png'),
  loadImage('../numberimages/number2.png'),
  loadImage('../numberimages/number3.png')
  ];
}

function setup() {
  // shaders require WEBGL mode to work
  // createCanvas(windowWidth, windowHeight, WEBGL);
  let canvas = createCanvas(400, 400, WEBGL);
  canvas.parent('canvas-holder');
  noStroke();
}

function draw() {
  let scrollY = window.pageYOffset;
  let y = scrollY % 800;
  y = map(y, 0, 800, 800, 0);
  let activeImg = Math.floor(scrollY/800);
  if (activeImg > 2) { activeImg = 2};

  // console.log(activeImg);
  
  // shader() sets the active shader with our shader
  shader(theShader);
  theShader.setUniform("u_resolution", [width * 2.0, height * 2.0]);
  // theShader.setUniform("u_time", millis() / 1000.0); // we divide millis by 1000 to convert it to seconds
  // theShader.setUniform("u_mouse", [mouseX, map(mouseY, 0, height, height, 0)]); // we flip Y so it's oriented properly in our shader

  theShader.setUniform('u_tex0', images[activeImg]);
  if (activeImg < 2) {
    theShader.setUniform('u_tex1', images[activeImg + 1]);
  }

  theShader.setUniform('scroll_y', y);
  // rect gives us some geometry on the screen
  rect(0,0,width,height);
  
  // print out the framerate
  //  print(frameRate());
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
