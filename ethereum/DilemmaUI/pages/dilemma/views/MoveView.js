
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
			if($('#moveSelector')[0]==undefined) {
				$("#" + display).append("<div id='moveSelector' class='col-sm-12' ><div class='selectable ally col-sm-6' value=0></div><div class='selectable betray col-sm-6' value=1></div></div>");
				$("#" + display).append("<div id='updateBlock' class='col-sm-12' ><div class='title'>Choose Wisely</div><div class='text'><div class='allyUnderline'>ALLY</div> or <div class='betrayUnderline'>BETRAY</div></div></div>");
			}
	}
}