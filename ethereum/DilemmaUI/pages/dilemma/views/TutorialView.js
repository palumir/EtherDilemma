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
		displayObj.append("<h3 class='etherDilemma'>Ether Dilemma</h3>");
		displayObj.append("<div id='trusted'>The blockchain can be trusted, but can you be trusted?</div>");
		displayObj.append("<div id='theGame'><h4>- The Game -</h4><div>Step 1. Hit <div class='play'>PLAY</div> to be matched against a random stranger</div><div>Step 2. You'll then have ~30 sec to negotiate with your opponent before deciding... <div class='ally'>ALLY</div> or <div class='betray'>BETRAY</div></div>");
		displayObj.append("<div id='theStakes'><h4>- The Stakes -</h4><div>Each player must wager 20 finney to start the dilemma</div></div>");
		displayObj.append("<div id='thePayout' class='col-sm-12'><h4>- The Payout -</h4><div id='allyAlly' class='col-sm-4'><div class='aboveText'>ALLY | ALLY</div><div>Each player receives 24 finney</div></div><div id='betrayAlly' class='col-sm-4'><div class='aboveText'>BETRAY | ALLY</div><div>The betrayer receives 36 finney. The ally receives nothing.</div></div><div id='betrayBetray' class='col-sm-4'><div class='aboveText'>BETRAY | BETRAY</div><div>Each player receives 6 finney</div></div></div>");
		
		// Prepend HTML
		if(dilemmaController.contractLocked) displayObj.append("<br>The contract is currently locked, so playing is temporarily disabled. We apologize for the inconvenience.");
		else if(dilemmaController.challengeActive) displayObj.append("<div id='loader'><img width='30px' height='30px' src='images/loading.gif'> Searching For Partner <img width='30px' height='30px' src='images/loading.gif'></div>");
		else displayObj.append("<button id='challengeButton'>PLAY</button>");
		
		// Make it a block chain button
		$('#challengeButton').blockChainButtonSimple(this.dilemmaUI.codeContract.hostChallenge);
	}
}