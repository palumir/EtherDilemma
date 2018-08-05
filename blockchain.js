var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 1338;

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

var blockNumber = 0;

io.on('connection', function(socket){
	
	socket.on('blockNumber', function(){
		
		$.ajax({
			url: 'https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=NIVSKG1ICGAIPM3SJAZG1I3ISMPS395UWS',
			type: 'GET',
			success: function(data){ 
						
				// Emit to partner
				var number = data['result'];
				blockNumber = number;
				io.emit('blockNumber', data['result']);
			},
			error: function(data) {
				io.emit('blockNumber', blockNumber);
			}
		});
	});
	
	
});

http.listen(port, function(){
	console.log('Listening on port: ' + port);
});