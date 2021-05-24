let canvas;

const { Engine, World, Bodies, Svg, Vertices } = Matter;
let engine;
let world;
let hearts = [];
let ground;
let heartImage, purpleHeartImage, blueHeartImage;
let heartVertices;
let path;
let logo;
let header;

let song;
let musicButton;

let videos = [];

function preload() {
  heartImage = loadImage('../greta/heart.png');
  purpleHeartImage = loadImage('../greta/heartpurple.png');
  blueHeartImage = loadImage('../greta/heartblue.png');

  song = loadSound(songUrl);
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-holder');
  rectMode(CENTER);
  engine = Engine.create();
  world = engine.world;
  let options = {
    isStatic: true
  };

  ground = Bodies.rectangle(width / 2, height - 2, width, 8, options);
  World.add(world, ground);
  path = document.getElementById('heart-path');
  heartVertices = Svg.pathToVertices(path);
  heartVertices = decomp.quickDecomp(heartVertices);

  texts.map(createPost);

  let loveButton = select('#love');
  loveButton.mousePressed(showHearts);

  musicButton = select('#music');
  musicButton.mousePressed(toggleSong);

  logo = select('.logo');
  header = select('.header');

  song.addCue(2, showHearts);
  song.addCue(5, hideHearts);
  song.addCue(83, showHearts);
  song.addCue(89, hideHearts);
  song.addCue(94, showHearts);
  song.addCue(100, hideHearts);
  song.onended(songEnded);
}

function draw() {
  clear();
  Engine.update(engine, 1000 / 70);

  hearts.map((heart, index) => {
    heart.show();
    if (heart.isDead()) {
      heart.die();
      hearts.splice(index, 1);
    }
  });

  noStroke();
  fill(255);
  rect(width / 2, height - 10, width, 16);
}

function showHearts() {
  for (let i = 0; i < 6; i++) {
    hearts.push(new Heart(random(width / 2) + width / 4, random(height / 5), 200));
  }

  logo.html('lovebook');
  header.addClass('love');
  setTimeout(hideHearts, 4000);
}

function hideHearts(){
  logo.html('hatebook');
  header.removeClass('love');
}

function toggleSong() {
  if (song.isPlaying()) {
    song.pause();
    videos.map(video => video.pause());
    musicButton.html('play music');

  } else {
    song.play();
    videos.map(sync);
    musicButton.html('pause music');
  }
}

function songEnded() {
  musicButton.html('play music');
}

function sync(video) {
  video.currentTime = song.currentTime();
  video.play();
}

function createPost(text, index) {
  const even = index % 2 === 0;
  const userName = even ? 'hilke' : 'gregory';
  const profilePic = even ? '../greta/images/hilke.png' : '../greta/images/gregory.png';
  const url = even ? videoUrl : videoUrl2;
  
  const postWrapper = createDiv().parent('#posts').class('post');
  const userWrapper = createDiv().parent(postWrapper).class('user-wrapper');
  createImg(profilePic, userName).parent(userWrapper).class('profile-pic');
  createSpan(userName).parent(userWrapper).class('user-name');
  createDiv(text).parent(postWrapper).class('text');

  let videoWrapper = createDiv().parent(postWrapper).class('video');
  let myVideo = createVideo(url);
  myVideo.parent(videoWrapper);
  myVideo.volume(0);
  videos.push(myVideo);
  return postWrapper;
}


/* TO DO:
- better syncing of videos after many pauses
- different heart sizes
- gradual colors */