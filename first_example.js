const winWidth = p5.prototype.windowWidth;
const winHeight = p5.prototype.windowHeight;
const rand = p5.prototype.random;

const SQUARE_SIZE = 30;
const SPEED = 4;
const GROW_RATE = 5;

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5canvas");
  background('#eee');
}

function Square(size) {
  this.w = size;
  this.h = size;
  this.x = Math.floor(Math.random() * (winWidth - size));
  this.y = Math.floor(Math.random() * (winHeight - size));
  this.speedX = Math.random() * SPEED;
  this.speedY = Math.random() * SPEED;

  this.target = 0;
  this.current = 0;

  this.color = {
    r: rand(255),
    g: rand(255),
    b: rand(255)
  }

  if (Math.random() > .5){
    this.speedX *= -1
  }
  if (Math.random() > .5){
    this.speedY *= -1
  }
}

// const DETECTION_SIZE_X = SQUARE_SIZE/2 + SPEED*2;
// const DETECTION_SIZE_Y = SQUARE_SIZE/2 + SPEED*2 + GROW_RATE;

Square.prototype.detectY = function() {
  return this.h/2 + this.speedY;
}
Square.prototype.detectX = function() {
  return this.w/2 + this.speedX;
}


Square.prototype.getCX = function(){
  return this.x + this.w/2
}
Square.prototype.getCY = function(){
  return this.y + this.h/2
}

Square.prototype.updateLength = function(len){
  this.h = len;
}

Square.prototype.update = function(){
  // bounce sides
  if (this.getCX() >= winWidth - this.detectX() || this.getCX() <= 0 + this.detectX() ){
    this.speedX *= -1
  }
  // bounce top/bottom
  if (this.getCY() >= winHeight - this.detectY() || this.getCY() <= 0 + this.detectY() ){
    this.speedY *= -1
  }

  if (this.target > this.current) {
    this.current += GROW_RATE;
  }
  if (this.current >= this.target) {
    this.target = 0;
    this.current -= 2;
  }
  if (this.current >= 0){
    this.updateLength(SQUARE_SIZE + this.current);
  }

  // update position
  this.x += this.speedX;
  this.y += this.speedY;
}

// make an array of square objects
var squares = [];
for (i=0; i < 50; i++){
  var x = new Square(SQUARE_SIZE)
  squares.push(x)
}
console.log('You made',squares.length, 'squares');
function detectCollision(sq_arr) {

  var squares = [];
  sq_arr.forEach(x => squares.push(x));

  this.resolve = function(arr){
    arr.forEach(x => {
      x.target = x.h + (x.h > SQUARE_SIZE ? 0 : Math.floor(Math.random() * 150));
    })
  }

  function check(arr){
    // if array.length > 1
    if (arr.length > 1) {
      // compare first square with rest of squares
      var collision = [];
      var current = arr.shift();
      var next = arr.filter(sq => {
        var deltaX = Math.abs(current.getCX() - sq.getCX());
        var deltaY = Math.abs(current.getCY() - sq.getCY());
        if (deltaY <= sq.detectY()+current.detectY() && deltaX <= sq.detectX()+ current.detectX() ){
          collision.push(sq);
          return false
        } else {
          // not a collision
          return true
        }
      })
      // if collision
      if (collision.length){
        // send those squares to resolve function
        collision.push(current);
        this.resolve(collision);
      }
      check(next);
    } else { return; } // done checking
  }

  check(squares);
}

function draw() {
  background('#eee');
  squares.map( sqr => {
    c = color(sqr.color.r, sqr.color.g, sqr.color.b);
    fill(c);
    noStroke();
    rect(sqr.x, sqr.y, sqr.w, sqr.h)
  })
  squares.map( sqr => {
    sqr.update();
  })
  detectCollision(squares);
}

function mouseClicked() {
//   ellipse_x = random(0, width);
//   ellipse_y = random(0, height);
}
