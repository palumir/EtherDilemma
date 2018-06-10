
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
			$("#" + display).append("<div id='moveSelector' class='col-sm-12' ><h3> Solve the dilemma... </h3><div class='selectable ally col-sm-5' value=0><img src='/images/ally.png'>Ally</div><div class='col-sm-2' id='centerOr'>or</div><div class='selectable betray col-sm-5' value=1><img src='/images/betray.png'>Betray</div></div>");
	}
}