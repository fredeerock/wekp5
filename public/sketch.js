var socket;

function setup() {
  socket = io.connect(window.location.origin);
  createCanvas(windowWidth, windowHeight);
  noCursor();

  socket.on('ping', function (data) {
    console.log(data);
  });

  socket.on('outputData',
    function(data) {

      r = map(data.args[0].value, 0, 1, 0, 255);
      g = map(data.args[1].value, 0, 1, 0, 255);
      b = map(data.args[2].value, 0, 1, 0, 255);

      for(var n = 0; n < data.args.length; n++) {
        println(n + ": " + data.args[n].value);
      }
    }
  );

}

var r = 100;
var g = 100;
var b = 100;

function draw() {
  background(r, g, b);
  ellipse(mouseX, mouseY, 25, 25);
}

function mouseMoved() {
  socket.emit('inputData', { x: mouseX, y:mouseY });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
