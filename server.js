var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 1337;
const https = require('https');

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

var blockNumber = 0;

var $ = require('jquery');

// Get the block number
function intervalFunc() {
	/* api.etherscan.io live*/
	/* ropsten.etherscan.io test */
	
	"use strict";
	
	https.get('https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=BPTZH8Z2RVE1ZRSHZEBET72NNIREUIFHJ6', (resp) => {
	  let data = '';

	  // A chunk of data has been recieved.
	  resp.on('data', (chunk) => {
		data += chunk;
	  });

	  // The whole response has been received. Print out the result.
	  resp.on('end', () => {
		blockNumber = parseInt(data.result,16);
		console.log(data);
		io.emit('setBlockNumber',blockNumber);
	  });

	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
}

setInterval(intervalFunc, 250);

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
	
});

http.listen(port, function(){
	console.log('Listening on port: ' + port);
});