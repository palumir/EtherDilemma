
class StatsView {
	
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
		if($("#statsView")[0] == undefined) $("#" + display).append("<div id='statsView'></div>");
	}
}