function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();
}

function draw() {
  background(0, 100, 200);
  ellipse(mouseX, mouseY, 25, 25);

}
function mouseMoved() {
  socket.emit('mouseMoveEvent', { x: mouseX, y:mouseY });


  // return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
