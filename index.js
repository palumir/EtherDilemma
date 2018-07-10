var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
	io.emit('chat message', msg);
	console.log("msg: " + msg);
  });
});

http.listen(8080, "127.0.0.1");
