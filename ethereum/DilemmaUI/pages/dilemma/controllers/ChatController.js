
class ChatController {
	
	// Variables:
	// $view = view for this controller
	// $dilemmaController = dilemmaController controller for current user
	// $displayDiv = div of display everything will be appended to
	
	// Constructor
	constructor(dilemmaUI, dilemmaController) {
		
		// Set web3 so we may use it in methods
		this.dilemmaUI = dilemmaUI;
		
		// Set dilemmaController
		this.dilemmaController = dilemmaController;
	}

	
	// Set view
	setView(view) {
		this.view = view;
	}
		
	// Run JS for chat
	runChat() {
		
		var that = this;
		
		  $(function () {
			  
			// Open socket
			var socket = io.connect('http://etherdilemma.io:1337');
			
			// Add the socket to the dilemma controller
			that.dilemmaController.chatController = that;
			
			// Name
			var nameSet = false;
			var name = "";
			
			// What happens when we submit the chat form
			$('form').submit(function() {
				
				// Don't show messages twice if the user keeps playing (only allow one chat controller to exist)
				if(that == that.dilemmaController.chatController) {
					
					if($('#m').val()=="") return false;
					
					// Set name
					if(!nameSet) {
						var input = $('#m');
						name = input.val();
						$('#sendMessage')[0].innerHTML = "Send Message";
						nameSet = true;
					}
					
					// Otherwise, send message
					else {
						socket.emit('chat message', web3.eth.accounts[0], name, $('#m').val());
					}
					$('#m').val('');
				}
			    return false;
			});
			
			// What happens when we receive a chat message
			socket.on('chat message', function(address, name, msg){
				
				// Don't show messages twice if the user keeps playing (only allow one chat controller to exist)
				if(that == that.dilemmaController.chatController) {
					if(msg=="") return; 
					
					// If it's a relevant address sending the message
					if(address == web3.eth.accounts[0] || address == that.dilemmaController.partnerAddress) {
						var content = $('#messages');
						
						// Get class depending on whose address
						var classType = "betray";
						if(address == web3.eth.accounts[0]) classType = "ally";
						
						// Append message
						content.append($('<li>').html("<div class=" + classType + ">" + name + "</div>" + ": " + msg));
						
						// Make scrollbar go up
						content[0].scrollTop = content[0].scrollHeight;
					}
				}
			});
			
		  });
		
		/*$(function () {
			"use strict";

			// for better performance - to avoid searching in DOM
			var content = $('#content');
			var input = $('#input');
			var status = $('#status');
			
			// name
			var myName = false;
			
			window.WebSocket = window.WebSocket || window.MozWebSocket;

			// open connection
			var connection = new WebSocket('ws://209.97.130.97:1337');

			connection.onopen = function () {
				console.log("ON OPEN TRIGGERED");
				input.removeAttr('disabled');
				status.text('Choose name:');
			};

			connection.onerror = function (error) {
				console.log("ON ERROR TRIGGERED");
				content.html($('<p>', { text: 'Sorry, but there\'s some problem with your '
											+ 'connection or the server is down.' } ));
			};

			// most important part - incoming messages
			connection.onmessage = function (message) {
				// try to parse JSON message. Because we know that the server always returns
				// JSON this should work without any problem but we should make sure that
				// the massage is not chunked or otherwise damaged.
				try {
					console.log("PARSING");
					var json = JSON.parse(message.data);
				} catch (e) {
					console.log('This doesn\'t look like a valid JSON: ', message.data);
					return;
				}
				
				console.log("MOVING ON TO MESSAGE STUFF");

				// NOTE: if you're not sure about the JSON structure
				// check the server source code above
				if (json.type === 'ack') { // first response from the server with user's color
					console.log("ITS AN ACK");
					input.removeAttr('disabled').focus();
					status.text(myName + ': ');
					// from now user can start sending messages
				} else if (json.type === 'message') { // it's a single message
					console.log("ITS A MESSAGE");
					input.removeAttr('disabled'); // let the user write another message
					addMessage(json.data.author, json.data.text, json.data.address, new Date(json.data.time));
				} else {
					console.log('Hmm..., I\'ve never seen JSON like this: ', json);
				}
			};

			input.keydown(function(e) {
				if (e.keyCode === 13) {
					var msg = $(this).val();
					console.log("ITS AN ENTER KEY PRESSED");
					if (!msg) {
						console.log("!MSG");
						return;
					}
					// send the message as an ordinary text
					connection.send(JSON.stringify({ message: msg, address: web3.eth.accounts[0] }));
					console.log("SENT OVER CONNECTION");
					$(this).val('');
					// disable the input field to make the user wait until server
					// sends back response

					// we know that the first message sent from a user their name
					if (myName === false) {
						console.log("SET NAME TO BE MSG");
						myName = msg;
					}
				}
			});

			setInterval(function() {
				if (connection.readyState !== 1) {
					status.text('Error');
					input.attr('disabled', 'disabled').val('Unable to comminucate '
														 + 'with the WebSocket server.');
				}
			}, 3000);

			function addMessage(author, message, address, dt) {
				
				// Only show messages from ourself or our partner
				console.log("MSG address: " + address);
				console.log("You: " + web3.eth.accounts[0]);
				console.log("Partner: " + that.dilemmaController.partnerAddress);
				console.log("Message: " + message);
				
				if(address == web3.eth.accounts[0] || address == that.dilemmaController.partnerAddress) {
					
					console.log("WE GUCCI, IT'S ONE OF US!");
					var color = "#f40000";
					if(address == web3.eth.accounts[0]) color = "#00add7";
					content.append('<p><span style="color:' + color + '">' + author + '</span> @ ' +
						 + (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':'
						 + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())
						 + ': ' + message + '</p>');
				}
			}
		});*/
	}
	
	// Create the actual display with id $(display)
	createDisplay(display) {
		var that = this;
		
		// The DOM element we are accessing
		that.displayDiv = $("#" + display);
		
		// The actual function we want to run
		var fillDisplayFunction = function(display, myself) {
			that.view.appendHTML();
			that.runChat();
		};
		
		// Wait Metamask account injection before running the function
		this.dilemmaController.waitDilemma(
			fillDisplayFunction,
			display,
			this);
	}
}