// base node + wekinator integration used from https://github.com/noisyneuron/wekOsc

/// WEB SERVER VARIABLES ///

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var path = require('path');

/// WS AND OSC VARIABLES ///

var io = require('socket.io')(server);
var osc = require('osc-min');
var dgram = require('dgram');
var udp = dgram.createSocket('udp4');

/// PORTS AND URLS ///

var remoteIP = '127.0.0.1';
var inputPort = 3333;
var webpagePort = 3000;
var outputPort = 12000;

console.log("IP Address: " + remoteIP);
console.log("OSC output port: " + outputPort);
console.log("OSC input port: " + inputPort);
console.log("Webpage port: " + webpagePort);

/// SENDS OSC ///

inputDeviceData = function(x, y) {
  var buf;
  buf = osc.toBuffer({
    address: "/wek/inputs",
    args: [
      { type: "float", value: x },
      { type: "float", value: y },
      { type: "float", value: Math.random() }
    ]
  });

  return udp.send(buf, 0, buf.length, inputPort, remoteIP);
};

/// RECEIVE WS AND TRIGGER OSC SEND ///

io.on('connection', function (socket) {
  socket.emit('ping', "WebSocket link works");

  socket.on('inputData', function (data) {
    console.log(data);
    inputDeviceData(data.x, data.y);
  });

  /// RECEIVE OSC ///

  // var oscmsg;

  var sock = dgram.createSocket("udp4", function(msg, rinfo) {
    try {
      var oscmsg = osc.fromBuffer(msg);

      for (var n = 0; n < oscmsg.args.length; n++) {
        console.log(oscmsg.args[n].value);
      }

      socket.emit('outputData', oscmsg);

    } catch (e) {
      return console.log("invalid OSC packet", e);
    }
  });

  sock.bind(outputPort);

});

/// SERVE WEBPAGE ///

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res,next) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(webpagePort);
