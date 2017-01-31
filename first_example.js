const winWidth = p5.prototype.windowWidth;
const winHeight = p5.prototype.windowHeight;

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5canvas");
  background('#eee');
}

function Square(w,h) {
  this.w = w;
  this.h = h;
  this.x = Math.floor(Math.random() * winWidth);
  this.y = Math.floor(Math.random() * winHeight);

  this.speedX = Math.random() * 8;
  this.speedY = Math.random() * 8;
}

Square.prototype.update = function(){
  // bounce sides
  if (this.x >= winWidth || this.x <= 0){
    this.speedX *= -1
  }
  // bounce top/bottom
  if (this.y >= winHeight || this.y <= 0){
    this.speedY *= -1
  }
  // update position
  this.x += this.speedX;
  this.y += this.speedY;
}

// make an array of square objects
var squares = [];
for (i=0; i < 50; i++){
  var x = new Square(5,5)
  squares.push(x)
}
console.log('You made',squares.length, 'squares');

function detectCollision(sq_arr) {

  var squares = [];
  sq_arr.forEach(x => squares.push(x));

  this.resolve = function(arr){
    console.log('Collision:', arr.length);
  }

  function check(arr){
    // if array.length > 1
    if (arr.length > 1) {
      // compare first square with rest of squares
      var collision = [];
      var current = arr.shift();
      var next = arr.filter(sq => {
        // return to next of NOT in collision with arr[1]
        if (Math.abs(current.x - sq.x) <= 5 && Math.abs(current.y - sq.y) <= 5){
          collision.push(sq)
          return
        } else {
          // not a collision
          return sq
        }
      })
      // if collision
      if (collision.length){
        // send those squares to resolve function
        collision.push(arr[0]);
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
  // stroke('white')
  squares.map( sqr => {
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
