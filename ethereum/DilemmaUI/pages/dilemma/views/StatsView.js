
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
		if($("#statsView")[0] == undefined) $("#" + display).append("<div class='col-lg-3 col-xs-12' id='statsView'><img width='30px' height='30px' src='images/loading.gif'> Loading stats from the blockchain. <img width='30px' height='30px' src='images/loading.gif'></div>");
	}
}