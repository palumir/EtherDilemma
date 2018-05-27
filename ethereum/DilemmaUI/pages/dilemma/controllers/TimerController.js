
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
			
			// Make move
			this.dilemmaUI.codeContract.makeMove.sendTransaction(move, 
				{from:web3.eth.accounts[0], gas: 250000},
				function (error, result){
					if(!error) {
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