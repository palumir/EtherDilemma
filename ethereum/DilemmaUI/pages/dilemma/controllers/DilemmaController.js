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
					if(y == this.selectedDiv) currentDiv.classList.add("selected");
					
					// Add clickable class 
					currentDiv.classList.add("clickable");
					
					// Set the slot on the div, so we can use it later
					currentDiv.slot = y;
					
					// Add click listener
					$(currentDiv).click(function() {
						
						// Set our selected div to be the slot that was clicked
						that.selectedDiv = this.slot;
						
						// Remove selected CSS from other divs
						for(var x = 0; x < that.childNodes.length; x++) {
							that.childNodes[x].classList.remove("selected");
						}
						
						// Set new selected CSS
						for(x = 0; x < that.childNodes.length; x++) {
							if(that.childNodes[x].slot == that.selectedDiv) that.childNodes[x].classList.add("selected");
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
	
	// Constructor
	constructor(dilemmaUI) {
		
		var that = this;
		
		// Set web3 so we may use it in methods
		this.dilemmaUI = dilemmaUI;
		
		// Get the partner address
		this.dilemmaUI.waitMetaMask(function() {

			that.dilemmaUI.codeContract.getPartnerAddress.call(
			function (error, result){
				if(!error){
					that.partnerAddress = result;
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
		
		// Acquire display JQuery object
		var displayObj = $("#" + display);
		
		// Start "Your Move Panel" div
		displayObj.append("<div id='yourMovePanel'>");
		
		// Display attack selector
		var moveView = new MoveView(dilemmaUI, this);
		var moveController = new MoveController(dilemmaUI, this);
		moveView.setController(moveController);
		moveController.setView(moveView);
		moveController.createDisplay("yourMovePanel");
		
		// End the "Your Move Panel" div
		displayObj.append("</div>");

		// Create "Timer" div
		displayObj.append("<div class='col-sm-12' id='turnTimer'></div>");
		
		// Append timer
		this.timerController = new TimerController(dilemmaUI, this);
		var timerView = new TimerView(dilemmaUI);
		this.timerController.setView(timerView);
		timerView.setController(this.timerController);
		this.timerController.createDisplay("turnTimer");
		
		// Create "Chat" div
		displayObj.append("<div id='chatWrapper'></div>");
		
		var chatView = new ChatView(dilemmaUI);
		var chatController = new ChatController(dilemmaUI, this);
		chatView.setController(chatController);
		chatController.setView(chatView);
		chatController.createDisplay('chatWrapper');
		
	}
	
	// Create challenge view
	createChallengeDisplay(display) {
		
		// Reset some cookie stuff
		setCookie("turnDataSent", "false");
		
		// Create challenge stuff
		var challengeView = new ChallengeView(dilemmaUI);
		var challengeController = new ChallengeController(dilemmaUI);
		challengeView.setController(challengeController);
		challengeController.setView(challengeView);
		challengeController.createDisplay('dilemmaWrapper');
	}
	
	// Create end view
	createEndDisplay(display, result) {
		
		// Reset some cookie stuff
		setCookie("turnDataSent", "false");
		
		// Acquire display JQuery object
		var displayObj = $("#" + display);
		
		// Create HTML
		if(result.args["_whoBetray"] && result.args["_partnerBetray"]) displayObj.append("<div id='endScreen'><h3>You both betrayed!</h3>You received the punishment payout of: " + result.args["_payout"]/1000000000000000000 + "  Ether</div>");
		if(!result.args["_whoBetray"] && !result.args["_partnerBetray"]) displayObj.append("<div id='endScreen'><h3>You both cooperated!</h3>You received the reward of: " + result.args["_payout"]/1000000000000000000 + " Ether</div>");
		if(result.args["_whoBetray"] && !result.args["_partnerBetray"]) displayObj.append("<div id='endScreen'><h3>You successfully betrayed!</h3>You received the temptation payout of: " + result.args["_payout"]/1000000000000000000 + " Ether</div>");
		if(!result.args["_whoBetray"] && result.args["_partnerBetray"]) displayObj.append("<div id='endScreen'><h3>You got betrayed!</h3>You received the sucker's payout of: " + result.args["_payout"]/1000000000000000000 + " Ether</div>");
		displayObj.append("<br><div id='homepageReturn'><a href='/'>Click here to return to the homepage.</a></div>");
		
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

				// Recreate display
				$("#" + display).empty();
				that.createDilemmaDisplay(display);
				
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
				clearInterval(that.timerController.timer);
				
				// Recreate display
				$("#" + display).empty();
				that.createEndDisplay(display, result);
				
			}
		},
	
		// Module
		"dilemma");
	}
	
	// Create display
	createDisplay(display, watching = false) {
		
		var that = this;
		
		this.waitDilemma(function() {
			
			// Clear the display at first
			$("#" + display).empty();
			
			// Show matchmaker (challenge display)
			if(!that.dilemmaActive) that.createChallengeDisplay(display);
			
			// Otherwise we are in a dilemma
			else that.createDilemmaDisplay(display);
			
			// Watch for events
			if(!watching) {
				that.watchForEvents(display);
			}
		},
		display);
	}
	
	// Wait for Dilemma variables to load, then run $(func) on $(display)
	waitDilemma(func, display) {
		
		var that = this;
		
		// Wait until MetaMask account is set
		var accountInterval = setInterval(function() {
				if(that.partnerAddress !== undefined && that.dilemmaActive !== undefined && that.contractLocked != undefined && that.challengeActive != undefined) {
					func(display);
					clearInterval(accountInterval);
				}
			}
			,100);
	}
	
	
}