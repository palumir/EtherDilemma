
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
		
		this.controller.displayDiv.append('<div id="content"></div><div><span id="status">Connecting...</span><input type="text" id="input" disabled="disabled" /></div>');
	}
	
}