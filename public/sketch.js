function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();
}

var od;



function draw() {
  background(100);

  ellipse(mouseX, mouseY, 25, 25);

}

function mouseMoved() {
  socket.emit('inputData', { x: mouseX, y:mouseY });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
