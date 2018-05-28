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
		displayObj.append("<h3> What is Ether Dilemma? </h3>");
		displayObj.append("<div>Ether Dilemma is a <a href='https://www.ethereum.org/'>simple Ethereum smart contract</a> based on the <a href='https://en.wikipedia.org/wiki/Prisoner%27s_dilemma'>Prisoner's Dilemma</a>, where each player pays 0.020 Ether to play, and can choose to either <div class='betray'><img src='/images/betray.png'>betray</div> or <div class='cooperate'><img src='/images/cooperate.png'>cooperate</div> with the other player:</div>");
		displayObj.append("<br><div>- If both players <div class='cooperate'><img src='/images/cooperate.png'>cooperate</div>, both players get rewarded &boxh; receiving 0.024 Ether</div>");
		displayObj.append("<div>- If both players <div class='betray'><img src='/images/betray.png'>betray</div>, both players get punished &boxh; receiving only 0.006 Ether</div>");
		displayObj.append("<div>- If one player <div class='betray'><img src='/images/betray.png'>betrays</div> and the other <div class='cooperate'><img src='/images/cooperate.png'>cooperates</div> &boxh; the <div class='betray'><img src='/images/betray.png'>betrayer</div> gets 0.36 Ether and the <div class='cooperate'><img src='/images/cooperate.png'>cooperater</div> gets 0 Ether</div>");
		displayObj.append("<br><div>The game is usually fairly difficult to simulate in an interesting way, because there isn't actually anything of real value at stake. <br><br>That's where Ethereum and <a href='https://metamask.io/'>MetaMask</a> come in. Simply download <a href='https://metamask.io/'>MetaMask</a> as a browser extension and load up some <a href='https://en.wikipedia.org/wiki/Ether'>Ether</a> to play. <div class='cooperate'><img src='/images/cooperate.png'>Cooperate</div>, and receive a reward, or risk it all by <div class='betray'><img src='/images/betray.png'>betraying</div> your opponent.</div>");
		displayObj.append("<br><div>Oh, and you can also <b>chat</b> with your opponent. Good luck!</div></div>");
		
		// Prepend HTML
		if(dilemmaController.contractLocked) displayObj.append("<br>The contract is currently locked, so playing is temporarily disabled. We apologize for the inconvenience.");
		else if(dilemmaController.challengeActive) displayObj.append("<div id='loader'><img width='30px' height='30px' src='images/loading.gif'> Searching For Partner <img width='30px' height='30px' src='images/loading.gif'></div>");
		else displayObj.append("<button id='challengeButton'>Play</button>");
		
		// Make it a block chain button
		$('#challengeButton').blockChainButtonSimple(this.dilemmaUI.codeContract.hostChallenge);
	}
}