// Duel view, subclass of GeodeUI.js
// Requires GeodeUI.js to function
class ChallengeView {
	
	// Variables
	// $controller = the controller object for this view
	
	// Constructor
	constructor(geodeUI) {
		this.geodeUI = geodeUI;
	}
	
	// Set controller
	setController(controller) {
		this.controller = controller;
	}
}