
class MoveView {
	
	// Variables
	// $controller = the controller object for this view
	// 
	
	// Constructor
	constructor(dilemmaUI) {
		this.dilemmaUI = dilemmaUI;
		
	}
	
	// Set controller
	setController(controller) {
		this.controller = controller;
	}
	
		
	// Create table w/ styling in $(display) for $(who)
	createInterface(display) {
			
			// Only create it if it doesn't exist yet
			$("#" + display).append("<div id='moveSelector' class='full-width' ><h3> Think fast! Will you... </h3><div class='selectable cooperate one-half-width' value=0><img src='/images/cooperate.png'>Cooperate</div><div id='centerOr'>or</div><div class='selectable betray one-half-width' value=1><img src='/images/betray.png'>Betray</div></div>");
	}
}