import Song from './song.js';
import { displayAsRGB, displayText, setColorBySpectrum, setSquareCanvas } from './helpers.js';
import bodyImages from './bodyImages.js';

let theShader;
// let theSong;
let images;
let canvasSize;
let selfScroll = 0;
let selfScrollSpeed = 0.4;

let color = 0;
let analyser;
let spectrum;

let playingSound = false;
let songData;
let song;
let sceneIndex = 0;
let loop_length = '4m';

new p5(function(p5){
  p5.preload = function(){
    theShader = p5.loadShader('effect.vert', 'effect.frag');
    // theSong = loadSound('https://dl.dropboxusercontent.com/s/gp14ftdrq5nexw8/paradoxes.mp3');
    
    songData = p5.loadJSON('../json/paradoxes3.json');
    
    images = bodyImages.map(url => { return p5.loadImage(url) });
  }

  p5.setup = function(){
    canvasSize = setSquareCanvas(p5);
    let canvas = p5.createCanvas(canvasSize, canvasSize, p5.WEBGL);
    canvas.parent('canvas-holder');
    p5.noStroke();
  
    analyser = new Tone.Analyser;
    Tone.Master.connect(analyser); 
    Tone.Transport.bpm.value = 90;
    song = new Song(songData, loop_length);
  }

  p5.mouseClicked = function(){
    if (playingSound == false) {
      // theSong.play();
      playingSound = true;
      Tone.Transport.start();
      song.startScene(0);
      displayText(p5, '#song-instructions', 'starting the music... Click again to stop');
    } else {
      playingSound = false;
      Tone.Transport.stop();
      displayText(p5, '#song-instructions', 'click again to restart the music');
    }
  }

  p5.draw = function(){
    let scrollX = window.pageXOffset;
    let scrollY = window.pageYOffset;
    let y = scrollY % (canvasSize * 2);
    y = y + selfScroll;
    let shaderY = p5.map(y, 0, canvasSize * 2, canvasSize * 2, 0);
    
    // scroll down a bit automatically

    // if((shaderY/(width * 2.0)) > -0.5){ selfScroll += selfScrollSpeed };
    if(y < (canvasSize * 2)){ selfScroll += selfScrollSpeed };
  
    // displaySceneCounter(`scrollY: ${scrollY} y: ${parseInt(y)} c: ${canvasSize * 2} s: ${(shaderY/(width * 2.0)).toFixed(4)}`);
  
    let activeWindowPart = Math.floor(scrollY/(canvasSize * 2));
    let activeImage = activeWindowPart % images.length;
  
    
    p5.shader(theShader);
    theShader.setUniform("u_resolution", [p5.width * 2.0, p5.height * 2.0]);
    theShader.setUniform("u_time", p5.millis() / 1000);
    // theShader.setUniform("u_mouse", [mouseX, map(mouseY, 0, height, height, 0)]);
  
    theShader.setUniform('u_tex0', images[activeImage]);
  
    // take the first image again if we reached the end of the image list
    if (activeImage === (images.length - 1)) {
      theShader.setUniform('u_tex1', images[0]);
    // else take the next image
    } else {
      theShader.setUniform('u_tex1', images[activeImage+1]);
    }
  
    theShader.setUniform('scroll_x', scrollX);
    theShader.setUniform('scroll_y', shaderY);

    // rect gives us some geometry on the screen
    p5.rect(0, 0, p5.width, p5.height);
   
    if (playingSound) {
      sceneIndex = p5.round(scrollY/1000);
      song.startScene(sceneIndex);
    }
  
    // adjust colors to the music;
    spectrum = analyser.getValue();
    color = setColorBySpectrum(p5, spectrum);
    let red = color * 1.0;
    if (red < 0){red = 0};
    let green = red * 0.4;
    let blue = red * 0.3;
    theShader.setUniform('red', red);
    theShader.setUniform('green', green);
    theShader.setUniform('blue', blue);
  
    displayText(p5, '#values', displayAsRGB(red, green, blue));
    displayText(p5, '#scene-counter', `scene: ${sceneIndex}`);
  }

  p5.windowResized = function(){
    canvasSize = setSquareCanvas(p5);
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  }


});
