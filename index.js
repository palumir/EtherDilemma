var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 1337;

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	
	socket.on('chat message', function(address, name, msg){
		
		// Emit to partner
		io.emit('chat message', address.replace(/<(?:.|\n)*?>/gm, ''), name.replace(/<(?:.|\n)*?>/gm, ''), msg.replace(/<(?:.|\n)*?>/gm, ''));
	});
	
	
});

http.listen(port, function(){
	console.log('listening on *:' + port);
});