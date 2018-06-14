
// Timer Controller subclass of GeodeUI.js
// Requires GeodeUI.js to function
class TimerController {
	
	// Variables:
	// $view = view for this controller
	// $dilemmaController = dilemmaController controller for current user
	// $functions = list of functions to call after timer elapses
	// $displayDiv = JQuery element view for this controller 
	// $dilemmaController = dilemma controller of current user
	
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
	
	// Send the turn data to blockchain
	sendTurnData() {
		
		// Turn data has been sent
		setCookie("turnDataSent", "true");
		
		// If the user rejects, pop up MetaMask again
		this.dilemmaUI.pushRejectCallback([function(args) {
			setCookie("turnDataSent","false");
		},
		[this]]);
		
		// Get move controller input
		var move = $("#moveSelector .selected")[0];
		if(move != undefined) {
			move = move.slot;
			if(move == "1") move = true;
			else move = false;
			
			// Lock the selectors
			var selectors = $(".selectable");
			for(var i = 0; i < selectors.length; i++) {
				selectors[i].classList.add("locked");
			}
			
			// Make move
			this.dilemmaUI.codeContract.makeMove.sendTransaction(move, 
				{from:web3.eth.accounts[0], gas: 250000},
				function (error, result){
					if(!error) {
						
						// Add a loading image (DOES NOT WORK, TODO)
						var loader = $('#loader')[0];
						
						if(loader == undefined) $("#dilemmaWrapper").append("<div id='loader'><img width='30px' height='30px' src='images/loading.gif'> Move submitted. Waiting for response from Blockchain. <img width='30px' height='30px' src='images/loading.gif'></div>");
						else loader.innerHTML = "<img width='30px' height='30px' src='images/loading.gif'> Move submitted. Waiting for response from Blockchain. <img width='30px' height='30px' src='images/loading.gif'>";
					}
					else {
						console.log(error);
					}
				});
		}
	}
	
	// Create the actual display with id $(display)
	createDisplay(display) {
		var that = this;
		
		// The DOM element we are accessing
		that.displayDiv = $("#" + display);
		
		// The actual function we want to run
		var fillDisplayFunction = function(display, myself) {
			
			// Start the timer
			that.view.startTimer(display);
			
			// Watch for event to reset timer
			watchForEvent(
			
			// Missed turns
			that.dilemmaUI.codeContract.missedTurn(),
			
			// Function
			function(result) {
				
				// Reset that the current turn data was not sent
				if(result.args["_who"] == web3.eth.accounts[0]) {
					setCookie("turnDataSent","false");
					
					// Set that a turn was missed
					var loader = $("#loader")[0];
					if(loader != undefined) loader.innerHTML = "The turn was missed because either you or your opponent did not press Submit on MetaMask quickly enough. Please try again.";
					
					// Unlock the selectors
					var selectors = $(".selectable");
					for(var i = 0; i < selectors.length; i++) {
						selectors[i].classList.remove("locked");
					}
				}
			},
		
			// Timer module
			"timer");
			
		};
		
		// Wait Metamask account injection before running the function
		this.dilemmaController.waitDilemma(
			fillDisplayFunction,
			display,
			this);
	}
}