var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 1337;

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

var blockNumber = 0;

io.on('connection', function(socket){
	
	socket.on('chat message', function(address, name, msg){
		
		// Strip HTML
		address = address.replace(/<(?:.|\n)*?>/gm, '');
		name = name.replace(/<(?:.|\n)*?>/gm, '');
		msg = msg.replace(/<(?:.|\n)*?>/gm, '');
		
		// Log the message
		console.log('Chat Message { from: ' + address + ', name: ' + name + ', msg: ' + msg + ' }');
		
		// Emit to partner
		io.emit('chat message', address, name, msg);
	});
	
	socket.on('setBlockNumber', function(blockNum){
		blockNumber = blockNum;
		
		// Emit new block number to all players
		io.emit('getBlockNumber',blockNumber);
	});
	
});

http.listen(port, function(){
	console.log('Listening on port: ' + port);
});