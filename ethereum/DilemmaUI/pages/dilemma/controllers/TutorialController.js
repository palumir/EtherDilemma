
class ChallengeController {
	
	// Variables:
	// $view = view for this controller
	// $challenges = cached challenges
	//
	// Constants:
	// $DILEMMA_WRAPPER = wrapper ID for the dilemma interface
	
	// Constructor
	constructor(dilemmaUI) {
		
		// Set web3 so we may use it in methods
		this.dilemmaUI = dilemmaUI;
		
		// Constants
		this.DILEMMA_WRAPPER = "dilemmaWrapper";
		
	}
	
	// Set view
	setView(view) {
		this.view = view;
	}
	
	// Create the actual display with id $(display)
	createDisplay(display) {
		var that = this;
		
		// The actual function we want to run
		var fillDisplayFunction = function(display, myself) {
			
			// Create challenge button
			that.view.createChallengeButton(that.DILEMMA_WRAPPER);
		}
		
		// Wait Metamask account injection before running the function
		this.dilemmaUI.waitMetaMask(
			fillDisplayFunction,
			display,
			this);
	}
}