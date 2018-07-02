class WarningView {
	
	// Variables
	
	// Constructor
	constructor(dilemmaUI) {
		this.dilemmaUI = dilemmaUI;
	}
	
	// Set controller
	setController(controller) {
		this.controller = controller;
	}
	
	// Create challenge button
	createDisplay(display) {
		$('#' + display).append("<div id='metaMaskWarning'><img src='/images/exclamation.png' width='40px' height='80px'><div class='line1'>MetaMask will pop-up automatically</div><div class='line2'>Press Submit <b>IMMEDIATELY</b></div><div>");
	}
}