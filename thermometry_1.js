
var CANVAS_WIDTH = 400;
var CANVAS_HEIGHT = 400;
var UNIT_SCALE_X = 50;
var UNIT_SCALE_Y = 50

function setup() {
    var canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
 
  // Move the canvas so it’s inside our <div id="sketch-holder">.
  canvas.parent('sketch-holder');
  
}
  
function draw() {

    drawGrid(CANVAS_WIDTH/UNIT_SCALE_X,CANVAS_HEIGHT/UNIT_SCALE_Y, 0.1);
    drawOrigin(0.4);

   
    let v0 = createVector(0,0);
    let v1 = createVector(1,3);
    let v2 = createVector(3,1);

    let unitVecX = createVector(1,0);

    let s0 = p5.Vector.add(vectorToScreenSpace(v0), [CANVAS_WIDTH/2,CANVAS_HEIGHT/2]);
    let s1 = vectorToScreenSpace(v1)
    let s2 = vectorToScreenSpace(v2)

    let a0 = acos(p5.Vector.dot(v1,unitVecX) / (p5.Vector.mag(v1)))
    let a1 = acos(p5.Vector.dot(v2,unitVecX) / (p5.Vector.mag(v2)))

    let theta = acos(p5.Vector.dot(v1,v2) / (p5.Vector.mag(v1)*p5.Vector.mag(v2)))

    //strokeWeight(4)
    stroke(0,0,0)
    arc(200, 200, 100, 100, -a0, -a1);
    //strokeWeight(0.1)
    
    drawArrow(s0,s1,'red');
    drawArrow(s0,s2,'black');

    noStroke();
    textSize(28)
    text('\u03B8  = ' +  theta.toFixed(2) + ' rad', 150, 220, 240, 45);
    text('\u0394T = ' +  theta.toFixed(2)*6.127 + '\u00B0', 150, 265, 240, 45);

}

function drawOrigin(brightness){

    brightness = (1-brightness);
    stroke(255*brightness, 255*brightness, 255*brightness)


    line(CANVAS_WIDTH/2, 0, CANVAS_WIDTH/2, CANVAS_HEIGHT);
    line(0, CANVAS_HEIGHT/2, CANVAS_WIDTH, CANVAS_HEIGHT/2);

}

function drawGrid(numX, numY, brightness){

    brightness = (1-brightness);

    stroke(255*brightness, 255*brightness, 255*brightness)


    for (let index = 0; index < numX; index++) {
        line(index*CANVAS_WIDTH/numX, 0, index*CANVAS_WIDTH/numX, CANVAS_HEIGHT);
    }
    for (let index = 0; index < numY; index++) {
        line(0, index*CANVAS_HEIGHT/numY, CANVAS_WIDTH, index*CANVAS_HEIGHT/numY);
    }

}

function drawArrow(base, vec, myColor) {
    push();
    stroke(myColor);
    strokeWeight(3);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    let arrowSize = 7;
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
  }

  function vectorToScreenSpace(vec){

    newVec = createVector(vec.x * (UNIT_SCALE_X ), -1* vec.y * (UNIT_SCALE_Y ))
    return newVec;
  }

 