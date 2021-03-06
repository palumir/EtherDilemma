
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
	createDisplay(display, disabledScreen = false) {
		var that = this;

		// Create challenge button, but without having MetaMask loaded
		if(!disabledScreen) that.view.createChallengeButton(that.DILEMMA_WRAPPER);
		else that.view.createDisabledScreen(that.DILEMMA_WRAPPER)
	}
}