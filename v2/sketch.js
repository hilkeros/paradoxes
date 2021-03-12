// a shader variable
let theShader;
let images;
let canvasSize;

function preload(){
  // load the shader
  theShader = loadShader('effect.vert', 'effect.frag');
  
  images = [ 
    loadImage('https://dl.dropboxusercontent.com/s/e46t8kejtmny2ia/01HROSKI_1.png'),
    loadImage('https://dl.dropboxusercontent.com/s/d8osh41xeuwewnz/01HROSKI_2.png'),
    loadImage('https://dl.dropboxusercontent.com/s/2t3eco3jwwo32bp/01HROSKI_3.png'),
    loadImage('https://dl.dropboxusercontent.com/s/3n1bhtpl0inbenx/01HROSKI_4.png'),
    loadImage('https://dl.dropboxusercontent.com/s/u3ig51xp8mznma3/01HROSKI_5.png'),
    loadImage('https://dl.dropboxusercontent.com/s/od8bquyi18vq02e/01HROSKI_6.png'),
    loadImage('https://dl.dropboxusercontent.com/s/58uiy9krxffxn78/01HROSKI_7.png'),
    loadImage('https://dl.dropboxusercontent.com/s/ewbxeikrezxhgh8/01HROSKI_8.png'),
    loadImage('https://dl.dropboxusercontent.com/s/9u5b4d91ymzvjg9/01HROSKI_9.png'),
    loadImage('https://dl.dropboxusercontent.com/s/dmxv0a4hk1v71on/01HROSKI_10.png')
  ];
}

function setup() {
  // shaders require WEBGL mode to work
  // createCanvas(windowWidth, windowHeight, WEBGL);

  canvasSize = 600;
  let canvas = createCanvas(canvasSize, canvasSize, WEBGL);
  canvas.parent('canvas-holder');
  noStroke();
}

function draw() {
  let scrollY = window.pageYOffset;
  let y = scrollY % (canvasSize * 2);
  y = map(y, 0, canvasSize * 2, canvasSize * 2, 0);
  let activeWindowPart = Math.floor(scrollY/(canvasSize * 2));
  let activeImage = activeWindowPart % images.length;

  // console.log(activeImg, activeReset);
  
  // shader() sets the active shader with our shader
  shader(theShader);
  theShader.setUniform("u_resolution", [width * 2.0, height * 2.0]);
  // theShader.setUniform("u_time", millis() / 1000.0); // we divide millis by 1000 to convert it to seconds
  // theShader.setUniform("u_mouse", [mouseX, map(mouseY, 0, height, height, 0)]); // we flip Y so it's oriented properly in our shader

  theShader.setUniform('u_tex0', images[activeImage]);

  // take the first image again if we reached the end of the image list
  if (activeImage === (images.length - 1)) {
    theShader.setUniform('u_tex1', images[0]);
  // else take the next image
  } else {
    theShader.setUniform('u_tex1', images[activeImage+1]);
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
