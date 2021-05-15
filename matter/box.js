// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/urR596FsU68

function Box(x, y, w, h, heartImage) {
  var options = {
    friction: 0.8,
    restitution: 0.6
  };
  this.body = Bodies.rectangle(x, y, w, h, options);
  this.w = w;
  this.h = h;
  this.r = random(127);
  this.g = random(127);
  this.b = random(127);
  this.image = heartImage;
  World.add(world, this.body);

  this.show = function() {
    var pos = this.body.position;
    var angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    strokeWeight(1);
    stroke(255);
    fill(this.r, this.g, this.b);
    // rect(0, 0, this.w, this.h);
    image(this.image, 0, 0);
    pop();
  };
}