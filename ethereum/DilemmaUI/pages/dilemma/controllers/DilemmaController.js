// Some JQuery helpers, specific to Current dilemma and dilemma Selector
(function ( $ ) {
	
	// A dropdown, similar to above, but with clickable dilemmas (for current user)
	$.fn.dilemmaSelectable = function() {
		var that = this;
		
		if(this.initialized != true) {
			this.initialized = true;
			
			// Set the selected div in the dropdown
			this.selectedDiv = 1; // Defaults to the second option
					
			// Get first div
			var firstDiv = $(that);
			
			// Set childnodes, so we may use them
			this.childNodes = firstDiv[0].childNodes;
			
			// Add a click listener for each child div
			var y = 0;
			for(var i = 0; i < this.childNodes.length; i++) {
				
				// Current div
				var currentDiv = this.childNodes[i];
				
				if(currentDiv.classList.contains("selectable")) {
				
					// First one is selected by default
					//if(y == this.selectedDiv) currentDiv.classList.add("selected");
					
					// Add clickable class 
					currentDiv.classList.add("clickable");
					
					// Set the slot on the div, so we can use it later
					currentDiv.slot = y;
					
					// Add click listener
					$(currentDiv).click(function() {
						
						if(!this.classList.contains("locked")) {
							
							// Set our selected div to be the slot that was clicked
							that.selectedDiv = this.slot;
							
							// Change the update user block to reflect our choice
							if(that.selectedDiv == 0) $('#updateBlock').html("<div id='updateBlock' class='col-sm-12' ><div class='title'>You have selected:</div><div class='text'><div class='allyUnderline'>ALLY</div></div></div>");
							else if(that.selectedDiv == 1) $('#updateBlock').html("<div id='updateBlock' class='col-sm-12' ><div class='title'>You have selected:</div><div class='text'><div class='betrayUnderline'>BETRAY</div></div></div>");
							else if(that.selectedDiv == 2) $('#updateBlock').html("<div id='updateBlock' class='col-sm-12' ><div class='title'>You have selected:</div><div class='text'><div class='callUnderline'>CALL</div></div></div>");
							
							// Add class to the moveSelector
							var moveSelector = $('#moveSelector');
							moveSelector.removeClass('betraySelected');
							moveSelector.removeClass('callSelected');
							moveSelector.removeClass('allySelected');
							if(that.selectedDiv == 0) moveSelector.addClass('allySelected');
							if(that.selectedDiv == 1) moveSelector.addClass('betraySelected');
							if(that.selectedDiv == 2) moveSelector.addClass('callSelected');
							
							// Remove selected CSS from other divs
							for(var x = 0; x < that.childNodes.length; x++) {
								that.childNodes[x].classList.remove("selected");
							}
							
							// Set new selected CSS
							for(x = 0; x < that.childNodes.length; x++) {
								if(that.childNodes[x].slot == that.selectedDiv)  {
									that.childNodes[x].classList.add("selected");
								}
							}
						}
						
					});
					y++;
				}
			}
		}
		
	}
}(jQuery));


// Dilemma Controller subclass of dilemmaUI.js
// Requires dilemmaUI.js to function
class DilemmaController {
	
	// Variables:
	// $partnerAddress = partner address for the dilemma
	// $dilemmaActive = whether or not the dilemma is actually active
	// $storageLocked = whether the storage contract is locked. If locked, you cannot play.
	// $blocksUntilTurn = blocks until turn must go through
	// $blocksUntilAFK = blocks until AFK goes through
	// $hasMissed = has there been a miss in this dilemma?
	// $blocksUntilTurnAfterMiss = blocks until turn must go through AFTER a miss occurs
	// $chatController = the chat controller
	
	// Constructor
	constructor(dilemmaUI) {
		
		var that = this;
		
		// Set web3 so we may use it in methods
		this.dilemmaUI = dilemmaUI;
		
		// Create dilemma UI even if MetaMask is not installed
		if(dilemmaUI == false) that.createChallengeDisplay('dilemmaWrapper'); 
		
		// If it's installed create the correct UI but only after MetaMask
		else dilemmaUI.waitMetaMask(function() {

			that.dilemmaUI.codeContract.getPartnerAddress.call(
			function (error, result){
				if(!error){
					that.partnerAddress = result;
				} 
				else {
					console.log(error);
				}
			});
			
			that.dilemmaUI.codeContract.getBlocksUntilAFK.call(
			function (error, result){
				if(!error){
					that.blocksUntilAFK = parseInt(result);
				} 
				else {
					console.log(error);
				}
			});
			
			that.dilemmaUI.codeContract.getBlocksToDecideAfterMiss.call(
			function (error, result){
				if(!error){
					that.blocksUntilTurnAfterMiss = parseInt(result);
				} 
				else {
					console.log(error);
				}
			});
			
			that.dilemmaUI.codeContract.getBlocksToDecide.call(
			function (error, result){
				if(!error){
					that.blocksUntilTurn = parseInt(result);
				} 
				else {
					console.log(error);
				}
			});
			
			that.dilemmaUI.codeContract.hasMissed.call(web3.eth.accounts[0],
			function (error, result){
				if(!error){
					that.hasMissed = result;
				} 
				else {
					console.log(error);
				}
			});
			
			that.dilemmaUI.codeContract.isDilemmaActive.call(
			function (error, result){
				if(!error){
					that.dilemmaActive = result;
				} 
				else {
					console.log(error);
				}
			});
			
			that.dilemmaUI.codeContract.isChallengeActive.call(
			function (error, result){
				if(!error){
					that.challengeActive = result;
				} 
				else {
					console.log(error);
				}
			});
			
			that.dilemmaUI.storageContract.isLocked.call(
			function (error, result){
				if(!error){
					that.contractLocked = result;
				} 
				else {
					console.log(error);
				}
			});
			
			},
			"",
			this);
	}
	
	// Create Dilemma view
	createDilemmaDisplay(display) {
		
		// Reset some cookie stuff
		setCookie("turnDataSent", "false");
		
		// Acquire display JQuery object
		var displayObj = $("#" + display);
		
		// Because particles.js screws up margins, sorry.
		displayObj.append("<div class='col-sm-12' id='emptySpace'></div>");
				
		// Warning (click MetaMask etc)
		var warningView = new WarningView(dilemmaUI);
		warningView.createDisplay(display);
		
		// Display attack selector
		var statsView = new StatsView(dilemmaUI);
		var statsController = new StatsController(dilemmaUI, this);
		statsView.setController(statsController);
		statsController.setView(statsView);
		statsController.createDisplay(display);
		
		// Create "Timer" div
		displayObj.append("<div class='col-sm-12' id='turnTimer'></div>");
		
		// Append timer
		this.timerController = new TimerController(dilemmaUI, this);
		var timerView = new TimerView(dilemmaUI);
		this.timerController.setView(timerView);
		timerView.setController(this.timerController);
		this.timerController.createDisplay("turnTimer");
		
		// Start "Your Move Panel" div
		displayObj.append("<div class='col-sm-12' id='yourMovePanel'>");
		
		// Display attack selector
		var moveView = new MoveView(dilemmaUI, this);
		var moveController = new MoveController(dilemmaUI, this);
		moveView.setController(moveController);
		moveController.setView(moveView);
		moveController.createDisplay("yourMovePanel");
		
		// End the "Your Move Panel" div
		displayObj.append("</div>");
		
		// Create "Chat" div
		displayObj.append("<div class='col-sm-12' id='chatWrapper'></div>");
		
		var chatView = new ChatView(dilemmaUI);
		var chatController = new ChatController(dilemmaUI, this);
		chatView.setController(chatController);
		chatController.setView(chatView);
		chatController.createDisplay('chatWrapper');
		
	}
	
	// Create challenge view
	createChallengeDisplay(display, disabled = false) {
		
		// Reset some cookie stuff
		setCookie("turnDataSent", "false");
		
		// Create challenge stuff
		var challengeView = new ChallengeView(dilemmaUI);
		var challengeController = new ChallengeController(dilemmaUI);
		challengeView.setController(challengeController);
		challengeController.setView(challengeView);
		challengeController.createDisplay('dilemmaWrapper', disabled);
	}
	
	// Create end view
	createEndDisplay(display, result) {
		
		// Disconnect the socket
		if(this.socket != undefined) this.socket.disconnect();
		
		// Calculate the payout from the result
		var payout = result.args["_payout"]/1000000000000000;
		var title = "";
		var endMessage = "";
		var yourMoveImage = "";
		var theirMoveImage = "";
		var tooltipText = "";
		
		// Get the right images
		if(result.args["_whoMove"] == 0) yourMoveImage = "<img src='/images/Results-Ally-Icon.png'>";
		if(result.args["_whoMove"] == 1) yourMoveImage = "<img src='/images/Results-Betray-Icon.png'>";
		if(result.args["_whoMove"] == 2) yourMoveImage = "<img src='/images/Results-Call-Icon.png'>";
		if(result.args["_partnerMove"] == 0) theirMoveImage = "<img src='/images/Results-Ally-Icon.png'>";
		if(result.args["_partnerMove"] == 1) theirMoveImage = "<img src='/images/Results-Betray-Icon.png'>";
		if(result.args["_partnerMove"] == 2) theirMoveImage = "<img src='/images/Results-Call-Icon.png'>";
		
		// Change the background color
		var background = $('#background');
		background.removeClass();
		
		// Acquire display JQuery object
		var displayObj = $("#" + display);
		
		// You went AFK
		if(result.args['_whoIsAFK'] == 1) { 
			title = "AFK";
			endMessage = "You went AFK and lost by default!";
			tooltipText = "-20 from player + 36 from bank = +16 net finney";
			background.addClass("red");
		}
		
		// They went AFK
		else if(result.args['_whoIsAFK'] == 2) { 
			title = "AFK";
			endMessage = "Your partner went AFK and you won by default!";
			tooltipText = "-20 from player + 0 from bank = -20 net finney";
			background.addClass("green");
		}
		
		// Double Betray
		else if(result.args["_whoMove"] == 1 && result.args["_partnerMove"] == 1) { 
			title = "Duplicity";
			endMessage = "You and your opponent have both betrayed!";
			tooltipText = "-20 from player + 4 from bank = -16 net finney";
			background.addClass("red");
		}
		
		// Double Ally
		else if(result.args["_whoMove"] == 0 && result.args["_partnerMove"] == 0) { 
			title = "Alliance";
			endMessage = "You have successfully allied your opponent!";
			tooltipText = "-20 from player + 26 from bank = +6 net finney";
			background.addClass("blue");
		}
		
		// Double Call
		else if(result.args["_whoMove"] == 2 && result.args["_partnerMove"] == 2) { 
			title = "Standoff";
			endMessage = "You and your opponent have both called!";
			tooltipText = "-20 from player + 17 from bank = -3 net finney";
			background.addClass("red");
		}
		
		// You Betray them, they Ally
		else if(result.args["_whoMove"] == 1 && result.args["_partnerMove"] == 0) { 
			title = "Betrayal";
			endMessage = "You have successfully betrayed your opponent!";
			tooltipText = "-20 from player + 36 from bank = +16 net finney";
			background.addClass("green");
		}
		
		// You Ally them, they Betray
		else if(result.args["_whoMove"] == 0 && result.args["_partnerMove"] == 1) {
			title = "Betrayal";
			endMessage = "You have been betrayed by your opponent!"; 
			tooltipText = "-20 from player + 0 from bank = -20 net finney";
			background.addClass("red");
		}
		
		// You Call them, they Betray
		else if(result.args["_whoMove"] == 2 && result.args["_partnerMove"] == 1) {
			title = "Revelation";
			endMessage = "You have exposed your opponent!"; 
			tooltipText = "-20 from player + 23 from bank = +3 net finney";
			background.addClass("purple");
		}
		
		// You Call them, they Ally
		else if(result.args["_whoMove"] == 2 && result.args["_partnerMove"] == 0) {
			title = "Mistrust";
			endMessage = "You have incorrectly predicted your opponent's betrayal!"; 
			tooltipText = "-20 from player + 17 from bank = -3 net finney";
			background.addClass("red");
		}
		
		// You Ally them, they Call
		else if(result.args["_whoMove"] == 0 && result.args["_partnerMove"] == 2) {
			title = "Mistrust";
			endMessage = "Your opponent has incorrectly predicted your betrayal!"; 
			tooltipText = "-20 from player + 29 from bank = +9 net finney";
			background.addClass("blue");
		}
		
		// You Betray them, they Call
		else if(result.args["_whoMove"] == 1 && result.args["_partnerMove"] == 2) {
			title = "Revelation";
			endMessage = "You have been exposed by your opponent!"; 
			tooltipText = "-20 from player + 17 from bank = -3 net finney";
			background.addClass("red");
		}
		
		// Edit the display
		displayObj.append("<a href='/index.php'><img class='etherDilemma' src='images/logo.png'></a>");
		
		// Append your move and their's
		displayObj.append("<div id='yourMove'><h3>YOU</h3>" + yourMoveImage + "</div>");
		displayObj.append("<div id='theirMove'><h3>YOUR OPPONENT</h3>" + theirMoveImage + "</div>");
	
		// Append end messages
		displayObj.append("<div id='endScreen' class='col-md-12 col-lg-8'><h3>" + title + "</h3><div id='endMessage'>" + endMessage + "</div><div id='awarded' class='col-sm-7'>You have been awarded <div title='" + tooltipText + "' class='finney'>" + payout + " finney</div>.</div></div>");
		displayObj.append("<br><button id='challengeButton' class='challengeButtonEnd'>PLAY AGAIN</button>");
		
		// Add tooltip javascript
		$( document ).tooltip({
		  position: {
			my: "center bottom-10",
			at: "center top",
			using: function( position, feedback ) {
			  $( this ).css( position );
			  $( "<div>" )
				.addClass( "arrow" )
				.addClass( feedback.vertical )
				.addClass( feedback.horizontal )
				.appendTo( this );
			}
		  }
		});
		
		// Make it a block chain button
		$('#challengeButton').blockChainButtonChallenge(this.dilemmaUI.codeContract.hostChallenge);
		
	}
	
	// Watch for events
	watchForEvents(display) {
			
		var that = this;
		
		// Watch for dilemma events
		watchForEvent(
		
		// Dilemma started event
		that.dilemmaUI.codeContract.dilemmaStarted(),
		
		// Function
		function(result) {
			
			// Current user or their partner
			if(web3.eth.accounts[0] == result.args["_who"]) {
				
				// Get partner address first
				that.dilemmaUI.codeContract.getPartnerAddress.call(
				function (error, result){
					if(!error){
						that.partnerAddress = result;
						that.hasMissed = false;
						
						// Recreate display
						$("#" + display).empty();
						that.createDilemmaDisplay(display);
					} 
					else {
						console.log(error);
					}
				});


				
			}
		},
	
		// Module
		"dilemma");
		
		// Watch for dilemma events
		watchForEvent(
		
		// Dilemma started event
		that.dilemmaUI.codeContract.dilemmaFinished(),
		
		// Function
		function(result) {
			
			// Current user or their partner
			if(web3.eth.accounts[0] == result.args["_who"]) {

				// Clear timer
				clearInterval(that.timerController.view.timer);
				
				// Recreate display
				$("#" + display).empty();
				that.createEndDisplay(display, result);
				
			}
		},
	
		// Module
		"dilemma");
		
		// Watch for challenge hosted
		watchForEvent(
		
		// Dilemma started event
		that.dilemmaUI.codeContract.challengeHosted(),
		
		// Function
		function(result) {
			
			// Current user
			if(web3.eth.accounts[0] == result.args["_who"]) {
				
				that.challengeActive = true;
				that.changeToPlayButton(display);
			}
		},
	
		// Module
		"dilemma");
		
		// Watch for challenge cancelled
		watchForEvent(
		
		// Dilemma started event
		that.dilemmaUI.codeContract.challengeCanceled(),
		
		// Function
		function(result) {
			
			// Current user
			if(web3.eth.accounts[0] == result.args["_who"]) {
				
				that.challengeActive = false;
				that.changeToPlayButton(display);
			}
		},
	
		// Module
		"dilemma");

	}
	
	// Change bottom text to play button
	changeToPlayButton(display) {
		
		console.log(web3.eth.accounts[0]);
			
			var displayObj = $("#bottomText");
		
			// Prepend HTML
			if(this.contractLocked) displayObj[0].outerHTML = "<div id='bottomText'>The contract is currently locked, so playing is temporarily disabled. We apologize for the inconvenience.</div>";
			else if(this.challengeActive) { 
				if(displayObj[0] == undefined) displayObj = $("#loader");
				if(displayObj[0] != undefined) displayObj[0].outerHTML =  "<div id='loader'><img width='30px' height='30px' src='images/loading.gif'> Searching for partner. <a href='' onclick='return false;' id='cancelSearch'>Click here</a> to cancel. <img width='30px' height='30px' src='images/loading.gif'></div>";
				$('#cancelSearch').blockChainButtonCancel(this.dilemmaUI.codeContract.cancelChallenge);
			}
			else { 
				if(displayObj[0] == undefined) displayObj = $("#loader");
				displayObj[0].outerHTML = "<button id='challengeButton'>PLAY</button>";
			}
			
			// Make it a block chain button
			$('#challengeButton').blockChainButtonChallenge(this.dilemmaUI.codeContract.hostChallenge);
	}
	
	// Create display
	createDisplay(display, disabled = false) {
		
		var that = this;
				
		// Create challenge button, but without having MetaMask loaded
		that.createChallengeDisplay(display, disabled); 
		
		this.waitDilemma(function() {
			
			// Show matchmaker (challenge display)
			if(!that.dilemmaActive) that.changeToPlayButton(display);
			
			// Otherwise we are in a dilemma
			else { 
				$("#" + display).empty();
				that.createDilemmaDisplay(display);
			}
			
			// Watch for events
			that.watchForEvents(display);
		},
		display);
	}
	
	// Wait for Dilemma variables to load, then run $(func) on $(display)
	waitDilemma(func, display) {
		
		var that = this;

		// Wait until MetaMask account is set
		var accountInterval = setInterval(function() {
				if(that.partnerAddress !== undefined && that.dilemmaActive !== undefined && that.contractLocked != undefined && that.challengeActive != undefined && that.hasMissed != undefined && that.blocksUntilTurn != undefined && that.blocksUntilTurnAfterMiss != undefined && that.blocksUntilAFK != undefined) {
					func(display);
					clearInterval(accountInterval);
				}
			}
			,100);
	}
	
	
}