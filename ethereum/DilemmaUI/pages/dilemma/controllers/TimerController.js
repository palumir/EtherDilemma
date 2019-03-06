
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
		
		// Only send if it has not been sent before
		if(getCookie("turnDataSent") != "true") {
			
			// Turn data has been sent
			setCookie("turnDataSent", "true");
			
			// Get move controller input
			var move = $("#moveSelector .selected")[0];
			
			if(move == undefined) move = 3; // Defaults to miss
			else {
				move = parseInt(move.slot);
			}
			
			// Lock the selectors
			/*var selectors = $(".selectable");
			for(var i = 0; i < selectors.length; i++) {
				selectors[i].classList.add("locked");
			}*/
			
			// Make move
			this.dilemmaUI.codeContract.makeMove.sendTransaction(move, 
				{from:web3.eth.accounts[0], gas: 200000, gasPrice: 5000000000},
				function (error, result){
					if(!error) {
						
						// Add a loading image
						var updateBlock = $('#updateBlock')[0];
						updateBlock.innerHTML = "<div class='title'>Decision Submitted</div><div class='text'><img width='20px' height='20px' src='images/loading.gif'> Waiting for Blockchain <img width='20px' height='20px' src='images/loading.gif'></div>";
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
					
					// Set the variable that a miss has occurred
					that.dilemmaController.hasMissed = true;
					
					// Set that a turn was missed
					var updateBlock = $("#updateBlock")[0];
					
					// Missed turn
					updateBlock.innerHTML = "<div class='title'>Miss!</div><div class='text'>The round has been reset because someone did not 'Submit' quickly enough.</div>";
					
					// Unlock the selectors
					/*var selectors = $(".selectable");
					for(var i = 0; i < selectors.length; i++) {
						selectors[i].classList.remove("locked");
					}*/
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