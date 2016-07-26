// base node + wekinator integration used from https://github.com/noisyneuron/wekOsc

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var osc = require('osc-min');
var dgram = require('dgram');
var path = require('path');

var remoteIp = '127.0.0.1';
var remotePort = 3333;

var udp = dgram.createSocket('udp4');

/// SENDS OSC ///

sendHeartbeat = function(x, y) {
  var buf;

  buf = osc.toBuffer({
    address: "/wek/inputs",
    args: [
      { type: "float", value: x },
      { type: "float", value: y },
      { type: "float", value: Math.random() }
    ]
  });

  return udp.send(buf, 0, buf.length, remotePort, "localhost");
};

/// RECEIVE WS AND TRIGGER OSC SEND ///

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });

  socket.on('mouseMoveEvent', function (data) {
    console.log(data);
    sendHeartbeat(data.x, data.y);
  });

});

/// SERVE WEBPAGE ///

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res,next) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000);

/// RECEIVE OSC ///

var inport = 12000;

console.log("OSC listener running at http://localhost:" + inport);

var sock = dgram.createSocket("udp4", function(msg, rinfo) {
  try {
    var oscmsg = osc.fromBuffer(msg);
    for (var n = 0; n < oscmsg.args.length; n++) {
      console.log(oscmsg.args[n].value);
    }
  } catch (e) {
    return console.log("invalid OSC packet", e);
  }
});

sock.bind(inport);
