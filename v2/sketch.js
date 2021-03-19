let theShader;
// let theSong;
let images;
let canvasSize;
let selfScroll = 0;
let selfScrollSpeed = 0.4;

let playingSound = false;
let color = 0;
let sumLow = 0;
let sumMid = 0;
let sumHigh = 0;
let analyser;
let spectrum;

let songData;
let song;
let sceneIndex = 0;
let loop_length = '4m';

let valueLogger;

function preload(){
  theShader = loadShader('effect.vert', 'effect.frag');
  // theSong = loadSound('https://dl.dropboxusercontent.com/s/gp14ftdrq5nexw8/paradoxes.mp3');
  
  songData = loadJSON('../json/paradoxes3.json');
  
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
  setSquareCanvas();
  let canvas = createCanvas(canvasSize, canvasSize, WEBGL);
  canvas.parent('canvas-holder');
  noStroke();

  analyser = new Tone.Analyser;
  Tone.Master.connect(analyser);
  
  Tone.Transport.bpm.value = 90;
  song = new Song(songData);

  valueLogger = select('#values');

}

function mouseClicked(){
  if (playingSound == false) {
    // theSong.play();
    playingSound = true;
    Tone.Transport.start();
    song.startScene(0);
    select('#song-instructions').html('starting the music... Click again to stop');
  } else {
    playingSound = false;
    Tone.Transport.stop();
    select('#song-instructions').html('click again to restart the music');
  }
}

function draw() {
  let scrollX = window.pageXOffset;
  let scrollY = window.pageYOffset;
  let y = scrollY % (canvasSize * 2);
  y = y + selfScroll;
  y = map(y, 0, canvasSize * 2, canvasSize * 2, 0);

  let activeWindowPart = Math.floor(scrollY/(canvasSize * 2));
  let activeImage = activeWindowPart % images.length;

  
  shader(theShader);
  theShader.setUniform("u_resolution", [width * 2.0, height * 2.0]);
  theShader.setUniform("u_time", millis() / 1000); // we divide millis by 1000 to convert it to seconds
  // theShader.setUniform("u_mouse", [mouseX, map(mouseY, 0, height, height, 0)]); // we flip Y so it's oriented properly in our shader

  theShader.setUniform('u_tex0', images[activeImage]);

  // take the first image again if we reached the end of the image list
  if (activeImage === (images.length - 1)) {
    theShader.setUniform('u_tex1', images[0]);
  // else take the next image
  } else {
    theShader.setUniform('u_tex1', images[activeImage+1]);
  }

  theShader.setUniform('scroll_x', scrollX);
  theShader.setUniform('scroll_y', y);
  // rect gives us some geometry on the screen
  rect(0,0,width,height);

  // scroll down a bit automatically
  selfScroll += selfScrollSpeed;

  
  if (playingSound) {
    sceneIndex = round(scrollY/1000);
    song.startScene(sceneIndex);
  }

  // adjust colors to the music;
  spectrum = analyser.getValue();
  setColorBySpectrum();
  let red = color * 1.0;
  if (red < 0){red = 0};
  let green = red * 0.4;
  let blue = red * 0.3;
  theShader.setUniform('red', red);
  theShader.setUniform('green', green);
  theShader.setUniform('blue', blue);

  displayValues(displayAsRGB(red, green, blue));
  displaySceneCounter(sceneIndex);

  // print(analysis);
  
  // print out the framerate
  //  print(frameRate());
}

function windowResized(){
  setSquareCanvas();
  resizeCanvas(windowWidth, windowHeight);
}

function setSquareCanvas(){
  if (windowWidth > windowHeight){
    canvasSize = windowWidth;
  } else {
    canvasSize = windowHeight;
  } 
}

function setColorBySpectrum(){
  let third = spectrum.length / 3;

  for(i = 0; i < spectrum.length; i++){
    let bin = spectrum[i];
    bin = isFinite(bin) ? bin : 0;
    if (i < third) {
    sumLow = sumLow + bin;
    } else if (i < 2 * third){
    sumMid = sumMid + bin;
    } else {
    sumHigh = sumHigh + bin;
    }
  }

  let averageLow = abs(sumLow / third);
  let averageMid = abs(sumMid / third);
  let averageHigh = abs(sumHigh / third);
  let sumBeat = averageLow + averageHigh/3.5;
  // print(sumBeat);
  color = map(sumBeat, 80, 120, 0.0, 0.4);
  sumLow = 0;
  sumMid = 0;
  sumHigh = 0;
}

function displayValues(value){
  valueLogger.html(value);
}

function displaySceneCounter(value){
  select('#scene-counter').html(value)
}

function displayAsRGB(r, g, b){
  return 'R: ' + parseInt(r * 255) + ' G: ' + parseInt(g * 255) + ' B: ' + parseInt(b * 255);
}