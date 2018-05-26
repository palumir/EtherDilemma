
class MoveController {
	
	// Variables:
	// $view = view for this controller
	// $dilemma = the dilemma controller, with all global blockchain variables
	
	// Constructor
	constructor(dilemmaUI, dilemmaController) {
		
		// Set web3 so we may use it in methods
		this.dilemmaUI = dilemmaUI;
		
		// Dilemma
		this.dilemmaController = dilemmaController;
	}
	
	// Set view
	setView(view) {
		this.view = view;
	}

	// Create the actual display with id $(display)
	createDisplay(display) {
		var that = this;

		// The actual function we want to run
		var fillDisplayFunction = function(display) {
			
			// Create table
			that.view.createInterface(display);
			
			// Make it selectable
			$("#moveSelector").dilemmaSelectable();
		}
		
		// Wait Metamask account injection before running the function
		this.dilemmaController.waitDilemma(
			fillDisplayFunction,
			display);
	}
}