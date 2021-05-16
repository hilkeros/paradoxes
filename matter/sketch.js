const d = "M484,443s92.75-58.07,110.09-116.83C603,296,598,243,544,243c-49.55,0-58.61,42.56-60,51.93-1.39-9.37-10.45-51.93-60-51.93-54,0-59,53-50.09,83.17C391.25,384.93,484,443,484,443Z";
var canvas;
const { Engine, World, Bodies } = Matter;

var engine;
var world;
var hearts = [];
var ground;
var heartImage;

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
}

function mouseClicked() {
  showHearts();
}

function touchStarted() {
  showHearts();
}

function showHearts() {
  for (var i = 0; i < 6; i++) {
    hearts.push(new Heart(random(width / 2) + width / 4, random(height / 5), random(20, 80)));
  }
}

function draw() {
  clear();
  Engine.update(engine, 1000/120);
  hearts.map(heart => heart.show());
  noStroke();
  fill(170);
  rect(width/2, height-5, width, 10);
}

function Heart(x, y, w) {
  var options = {
    friction: 0.8,
    restitution: 0.1
  };
  this.body = Bodies.polygon(x, y, 3, w, options);
  this.w = w;
  World.add(world, this.body);

  this.show = function () {
    var pos = this.body.position;
    var angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    stroke(255);
    // polygon(0, 0, this.w, 3);
    imageMode(CENTER);
    image(heartImage, 0, 0, this.w * 2, this.w * 2);
    pop();
  };
}

function polygon(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}