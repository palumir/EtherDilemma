class ChallengeView {
	
	// Variables
	// $controller = the controller object for this view
	// $table = table of challenges
	
	// Constructor
	constructor(dilemmaUI) {
		this.dilemmaUI = dilemmaUI;
	}
	
	// Set controller
	setController(controller) {
		this.controller = controller;
	}
	
	// Create challenge button
	createChallengeButton(display) {
		
		var displayObj = $("#" + display);
		displayObj.append("<img class='etherDilemma' src='images/logo.png'>");
		displayObj.append("<div id='trusted'>The blockchain can be trusted, but can you be trusted?</div>");
		displayObj.append("<div id='gameStuff'><div id='theGame'><h4><img src='images/theGame.png'></h4><div>1. Hit <div class='play'>PLAY</div> to be matched with a random stranger</div><div>2. Negotiate with your opponent</div><div>3. Choose <div class='ally'><img src='images/ally.png'>ALLY</div> or <div class='betray'><img src='images/betray.png'>BETRAY</div></div></div><div id='theStakes'><h4><img src='images/theStakes.png'></h4><div>Each player must wager <div class='finney'>20 finney</div> to start the dilemma</div></div><div id='thePayout' class='col-sm-12'><h4><img src='images/thePayout.png'></h4><div id='payoutSection' class='col-sm-12'><div id='allyAlly' class='col-sm-4'><table class='col-sm-11'><tr><td class='first'><img src='images/ally.png'></td><td><img src='images/ally.png'></td></tr><tr><td class='first'>+24 finney</td><td>+24 finney</td></tr></table></div><div id='betrayAlly' class='col-sm-4'><table class='col-sm-11'><tr><td class='first'><img src='images/betray.png'></td><td><img src='images/ally.png'></td></tr><tr><td class='first'>+36 finney</td><td>+0 finney</td></tr></table></div><div id='betrayBetray' class='col-sm-4'><table class='col-sm-11'><tr><td class='first'><img src='images/betray.png'></td><td><img src='images/betrayLeft.png'></td></tr><tr><td class='first'>+6 finney</td><td>+6 finney</td></tr></table></div></div></div>");
		
		// Prepend HTML
		if(dilemmaController.contractLocked) displayObj.append("<br>The contract is currently locked, so playing is temporarily disabled. We apologize for the inconvenience.");
		else if(dilemmaController.challengeActive) displayObj.append("<div id='loader'><img width='30px' height='30px' src='images/loading.gif'> Searching For Partner <img width='30px' height='30px' src='images/loading.gif'></div>");
		else displayObj.append("<button id='challengeButton'>PLAY</button>");
		
		// Make it a block chain button
		$('#challengeButton').blockChainButtonChallenge(this.dilemmaUI.codeContract.hostChallenge);
	}
}