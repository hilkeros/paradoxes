// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/urR596FsU68

var canvas;
// module aliases
var Engine = Matter.Engine,
  // Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies;

var engine;
var world;
var boxes = [];

var ground;
var heartImage;

function preload() {
  heartImage = loadImage('../greta/heart.png');
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-holder');
  // rectMode(CENTER);
  engine = Engine.create();
  world = engine.world;
  //Engine.run(engine);
  var options = {
    isStatic: true
  };
  ground = Bodies.rectangle(0, height, width * 2, 50, options);

  World.add(world, ground);
}

function mouseClicked() {
  for (var i = 0; i < 6; i++) {
    boxes.push(new Heart(random(width / 5) + width / 2, random(height / 5), random(20, 180)));
  }
}

function draw() {
  clear();
  Engine.update(engine);
  boxes.map(box => box.show());
  noStroke(255);
  fill(170);
  rect(0, height - 25, width, 25);
}

function Heart(x, y, w) {
  var options = {
    friction: 0.1,
    restitution: 0.1
  };
  this.body = Bodies.rectangle(x, y, w, w, options);
  this.w = w;
  World.add(world, this.body);

  this.show = function () {
    var pos = this.body.position;
    var angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    image(heartImage, 0, 0, this.w, this.w);
    pop();
  };
}