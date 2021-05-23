var path;
var canvas;
const { Engine, World, Bodies, Svg, Vertices } = Matter;

var engine;
var world;
var hearts = [];
var ground;
var heartImage;
var heartVertices;

function preload() {
  heartImage = loadImage('../greta/heart.png');
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-holder');
  rectMode(CENTER);
  engine = Engine.create();
  world = engine.world;
  var options = {
    isStatic: true
  };
  ground = Bodies.rectangle(width/2, height-10, width, 20, options);

  World.add(world, ground);
  path = document.getElementById('heart-path');
  heartVertices = Svg.pathToVertices(path);
  heartVertices = decomp.quickDecomp(heartVertices);
}

function touchStarted() {
  showHearts();
}

function showHearts() {
  for (var i = 0; i < 6; i++) {
    hearts.push(new Heart(random(width / 2) + width / 4, random(height / 5), 200));
  }
}

function draw() {
  clear();
  Engine.update(engine, 1000/70);
  hearts.map(heart => heart.show());
  noStroke();
  fill(170);
  rect(width/2, height-20, width, 40);
}

function Heart(x, y, w) {
  var options = {
    friction: 0.1,
    restitution: 0.8
  };

  this.w = w;
  let scaledVertices = Vertices.scale(heartVertices, this.w/200, this.w/200);
  this.body = Bodies.fromVertices(x, y, scaledVertices);
 
  World.add(world, this.body);

  this.show = function () {
    var pos = this.body.position;
    var angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    stroke(255);
    imageMode(CENTER);
    image(heartImage, 0, 0, this.w, this.w);
    pop();
  };
}
