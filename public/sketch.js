function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  // background(0, 100, 200);
}
function mouseMoved() {
  socket.emit('mouseMoveEvent', { x: mouseX, y:mouseY });

  ellipse(mouseX, mouseY, 5, 5);

  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
