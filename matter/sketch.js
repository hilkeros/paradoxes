var path;
var canvas;
const { Engine, World, Bodies, Svg, Vertices } = Matter;

var engine;
var world;
var hearts = [];
var ground;
var heartImage, purpleHeartImage, blueHeartImage;
var heartVertices;

function preload() {
  heartImage = loadImage('../greta/heart.png');
  purpleHeartImage = loadImage('../greta/heartpurple.png');
  blueHeartImage = loadImage('../greta/heartblue.png');
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

  hearts.map((heart, index) => {
    heart.show();
    if (heart.isDead()){
      heart.die();
      hearts.splice(index, 1);
    }
  });

  noStroke();
  fill(255);
  rect(width/2, height-20, width, 40);
}

function Heart(x, y, w) {
  var options = {
    friction: 0.4,
    restitution: 0.4
  };

  this.lifespan = 255;
  this.w = w;
  let scaledVertices = Vertices.scale(heartVertices, this.w/200, this.w/200);
  this.body = Bodies.fromVertices(x, y, scaledVertices, options);
 
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
    tint(255, this.lifespan);
    image(lifespanToHeartImage(this.lifespan), 0, 0, this.w, this.w);
    pop();

    this.lifespan = this.lifespan - 80/this.lifespan;
  };

  this.isDead = function () {
    return this.lifespan < 0;
  }

  this.die = function () {
    World.remove(world, this.body);
  }
}

function lifespanToHeartImage(lifespan){
  if (lifespan <= 100) {
    return blueHeartImage;
  } else if (lifespan <= 150) {
    return purpleHeartImage;
  }
  return heartImage;

}
