
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
			"use strict";

			// for better performance - to avoid searching in DOM
			var content = $('#content');
			var input = $('#input');
			var status = $('#status');
			
			// my name sent to the server
			var myName = false;

			// if user is running mozilla then use it's built-in WebSocket
			window.WebSocket = window.WebSocket || window.MozWebSocket;

			// if browser doesn't support WebSocket, just show some notification and exit
			if (!window.WebSocket) {
				content.html($('<p>', { text: 'Sorry, but your browser doesn\'t '
											+ 'support WebSockets.'} ));
				input.hide();
				$('span').hide();
				return;
			}

			// open connection
			var connection = new WebSocket('ws://209.97.130.97:1337');

			connection.onopen = function () {
				// first we want users to enter their names
				input.removeAttr('disabled');
				status.text('Choose name:');
			};

			connection.onerror = function (error) {
				// just in there were some problems with conenction...
				content.html($('<p>', { text: 'Sorry, but there\'s some problem with your '
											+ 'connection or the server is down.' } ));
			};

			// most important part - incoming messages
			connection.onmessage = function (message) {
				// try to parse JSON message. Because we know that the server always returns
				// JSON this should work without any problem but we should make sure that
				// the massage is not chunked or otherwise damaged.
				try {
					var json = JSON.parse(message.data);
				} catch (e) {
					console.log('This doesn\'t look like a valid JSON: ', message.data);
					return;
				}

				// NOTE: if you're not sure about the JSON structure
				// check the server source code above
				if (json.type === 'ack') { // first response from the server with user's color
					input.removeAttr('disabled').focus();
					status.text(myName + ': ');
					// from now user can start sending messages
				} else if (json.type === 'message') { // it's a single message
					input.removeAttr('disabled'); // let the user write another message
					addMessage(json.data.author, json.data.text, json.data.address, new Date(json.data.time));
				} else {
					console.log('Hmm..., I\'ve never seen JSON like this: ', json);
				}
			};

			/**
			 * Send mesage when user presses Enter key
			 */
			input.keydown(function(e) {
				if (e.keyCode === 13) {
					var msg = $(this).val();
					if (!msg) {
						return;
					}
					// send the message as an ordinary text
					connection.send(JSON.stringify({ message: msg, address: web3.eth.accounts[0] }));
					$(this).val('');
					// disable the input field to make the user wait until server
					// sends back response

					// we know that the first message sent from a user their name
					if (myName === false) {
						myName = msg;
					}
				}
			});

			/**
			 * This method is optional. If the server wasn't able to respond to the
			 * in 3 seconds then show some error message to notify the user that
			 * something is wrong.
			 */
			setInterval(function() {
				if (connection.readyState !== 1) {
					status.text('Error');
					input.attr('disabled', 'disabled').val('Unable to comminucate '
														 + 'with the WebSocket server.');
				}
			}, 3000);

			/**
			 * Add message to the chat window
			 */
			function addMessage(author, message, address, dt) {
				
				// Only show messages from ourself or our partner
				console.log("MSG address: " + address);
				console.log("Partner: " + that.dilemmaController.partnerAddress);
				console.log("You: " + web3.eth.accounts[0]);
				
				if(address == web3.eth.accounts[0] || address == that.dilemmaController.partnerAddress) {
					var color = "#f40000";
					if(address == web3.eth.accounts[0]) color = "#00add7";
					content.append('<p><span style="color:' + color + '">' + author + '</span> @ ' +
						 + (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':'
						 + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())
						 + ': ' + message + '</p>');
					content[0].scrollTop = content[0].scrollHeight;
				}
			}
		});
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