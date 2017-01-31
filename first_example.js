const winWidth = p5.prototype.windowWidth;
const winHeight = p5.prototype.windowHeight;
const rand = p5.prototype.random;

const SQUARE_SIZE = 30;
const SPEED = 4;
const DETECTION_SIZE = SQUARE_SIZE/2 + SPEED*2;

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5canvas");
  background('#eee');
}

function Square(size) {
  this.size = size;
  this.x = Math.floor(Math.random() * (winWidth - size));
  this.y = Math.floor(Math.random() * (winHeight - size));
  this.speedX = Math.random() * SPEED;
  this.speedY = Math.random() * SPEED;

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

Square.prototype.getCX = function(){
  return this.x + this.size/2
}
Square.prototype.getCY = function(){
  return this.y + this.size/2
}

Square.prototype.update = function(){
  // bounce sides
  if (this.getCX() >= winWidth - (this.size/2) || this.getCX() <= 0 + (this.size/2)){
    this.speedX *= -1
  }
  // bounce top/bottom
  if (this.getCY() >= winHeight - (this.size/2) || this.getCY() <= 0 + (this.size/2)){
    this.speedY *= -1
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
    // console.log('Collision:', arr.length);
    if (arr.length === 2){

      var deltaX = Math.abs(arr[0].x - arr[1].x);
      var deltaY = Math.abs(arr[0].y - arr[1].y);

      if (deltaX > deltaY){
        var temp = arr[0].speedX;
        arr[0].speedX = arr[1].speedX;
        arr[1].speedX = temp;
      } else if (deltaX === deltaY){
        // collide on diagonal
        var temp = arr[0].speedY;
        arr[0].speedY = arr[1].speedY;
        arr[1].speedY = temp;
        temp = arr[0].speedX;
        arr[0].speedX = arr[1].speedX;
        arr[1].speedX = temp;
      } else {
        var temp = arr[0].speedY;
        arr[0].speedY = arr[1].speedY;
        arr[1].speedY = temp;
      }

    } else {
      console.log('BLAM');
      temp_arr = [];
      arr.forEach(x => { temp_arr.push(x)})
      var shift = temp_arr.shift();
      temp_arr.push(shift);

      for (i=0; i<arr.length; i++){
        arr[i].speedX = temp_arr[i].speedX;
        arr[i].speedY = temp_arr[i].speedY;
      }

    }
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
        if (deltaY <= DETECTION_SIZE && deltaX <= DETECTION_SIZE){
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
  fill('black');
  stroke('white')
  squares.map( sqr => {
    c = color(sqr.color.r, sqr.color.g, sqr.color.b);
    fill(c);
    rect(sqr.x, sqr.y, sqr.size, sqr.size)
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
