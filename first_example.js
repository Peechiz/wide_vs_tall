const winWidth = p5.prototype.windowWidth;
const winHeight = p5.prototype.windowHeight;
const rand = p5.prototype.random;
const dist = p5.prototype.dist;

function Rekt(_x, _y, _size, _type) {
  this.x = _x;
  this.y = _y;
  this.c = rand(0,175);
  this.size = _size;
  this.type = _type;
  this.growing = true;

  if (_type === 'wide'){
    this.h = this.size;
    this.w = this.size * 2;
  } else if (_type === 'tall'){
    this.h = this.size * 2;
    this.w = this.size;
  }

  this.updateSize = function() {
    if (this.type === 'wide'){
      this.h = this.size;
      this.w = this.size * 2;
    } else if (this.type === 'tall'){
      this.h = this.size * 2;
      this.w = this.size;
    }
  }

  this.show = function(){
    noStroke();
    fill(this.c);
    rect(this.x,this.y, this.w, this.h);
  }

  this.grow = function(){
    if (this.growing){
      this.size += 1;
      this.updateSize();
    }
  }

  this.edges = function(){
    return (this.x + this.w > winWidth || this.y + this.h > winHeight)
  }
}

var r1;
var rekts = [];

function newRekt() {
  var x = rand(winWidth);
  var y = rand(winHeight);
  var size = 1
  var type = Math.random() > .5 ? 'wide' : 'tall';

  var valid = true;

  rekts.forEach(r => {
    if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h){
      valid = false;
    }
  })
  if (valid) {
    return new Rekt(x, y, size, type)
  } else {
    return null
  }
}

var slider;
var p;
var val = 100;
function setup() {
  var canvas = createCanvas(windowWidth, windowHeight/2);
  canvas.parent("p5canvas");
  background('white');
}

function draw() {

  for (var i = 0; i < 10; i++) {
    var r = newRekt();
    if (r != null) {
      rekts.push(r);
    }

    rekts.forEach((r, indexR) => {
      r.show();
      if (r.growing){
        if (r.edges()){
          r.growing = false;
        } else {
          var overlap = false;
          rekts.forEach((k, indexK) => {
            if ( indexR != indexK ){
              if (collideRectRect(r.x,r.y,r.w,r.h,k.x,k.y,k.w,k.h)){
                overlap = true;
              }
            }
          })
          if (overlap){
            r.growing = false;
          }
        }
        r.grow();
      }
    })

  }

}

function mouseClicked() {
//   ellipse_x = random(0, width);
//   ellipse_y = random(0, height);
}
