
class ChatView {
	
	// Variables
	// $controller = the controller object for this view
	
	// Constructor
	constructor(dilemmaUI) {
		this.dilemmaUI = dilemmaUI;
	}
	
	// Set controller
	setController(controller) {
		this.controller = controller;
	}
	
	// Append HTML to displayDiv
	appendHTML() {
		
		this.controller.displayDiv.append('<div id="chatHolder" class="col-sm-6"><h3 class="col-sm-12"><img src="images/negotiation.png"></h3><ul id="messages"></ul><form action=""><input id="m" autocomplete="off" /><button>Send</button></form></div>');
	}
	
}