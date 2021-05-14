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
  ground = Bodies.rectangle(0, height, width*2, 50, options);

  World.add(world, ground);
}


// function mouseDragged() {
//   boxes.push(new Box(mouseX, mouseY, random(10, 40), random(10, 40)));
// }

function mouseClicked() {
  for (var i = 0; i < 20; i++) {
    boxes.push(new Box (random(width/5)+width/2, random(height/5), random(10,80), random(10,80)));
  }
}

function draw() {
 clear();
  Engine.update(engine);
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].show();
  }
  noStroke(255);
  fill(170);
  rect(0, height - 25, width, 25);
}
