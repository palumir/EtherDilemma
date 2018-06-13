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
		
		// Text, so we don't have to keep writing it
		var finneyText = 'A finney is 1/1000 of an ETH';
		var allyText = 'Ally';
		var betrayText = 'Betray';
		
		var displayObj = $("#" + display);
		displayObj.empty();;
		displayObj.append("<a href='/index.php'><img class='etherDilemma' src='images/logo.png'></a>");
		displayObj.append("<div id='trusted'>The blockchain can be trusted, but can you?</div>");
		displayObj.append("<div id='gameStuff' class='col-sm-6'><div id='theGame'><h4><img src='images/theGame.png'></h4><div>1. Hit <div class='play'>PLAY</div> to be matched with a random stranger</div><div>2. Negotiate with your opponent</div><div>3. Choose <div class='ally'><img src='images/ally.png' title='" + allyText + "' >ALLY</div> or <div class='betray'><img src='images/betray.png' title='" + betrayText + "'>BETRAY</div></div></div><div id='theStakes'><h4><img src='images/theStakes.png'></h4><div>Each player must wager <div class='finney' title='" + finneyText + "'>20 finney</div> to start the dilemma</div></div><div id='thePayout' class='col-sm-12'><h4><img src='images/thePayout.png'></h4><div id='payoutSection' class='col-sm-12'><div id='allyAlly' class='col-sm-4'><table class='col-sm-11'><tr><td class='first'><img src='images/ally.png' title='" + allyText + "'></td><td><img src='images/ally.png' title='" + allyText + "'></td></tr><tr><td class='first' title='" + finneyText + "'>+24 finney</td><td title='" + finneyText + "'>+24 finney</td></tr></table></div><div id='betrayAlly' class='col-sm-4'><table class='col-sm-11'><tr><td class='first'><img src='images/betray.png' title='" + betrayText + "'></td><td><img src='images/ally.png' title='Ally'></td></tr><tr><td class='first' title='" + finneyText + "'>+36 finney</td><td title='" + finneyText + "'>+0 finney</td></tr></table></div><div id='betrayBetray' class='col-sm-4'><table class='col-sm-11'><tr><td class='first'><img src='images/betray.png' title='" + betrayText + "'></td><td><img src='images/betrayLeft.png' title='" + betrayText + "'></td></tr><tr><td class='first' title='" + finneyText + "'>+6 finney</td><td title='" + finneyText + "'>+6 finney</td></tr></table></div></div></div>");
		
		// Add tooltip javascript
		$( document ).tooltip({
		  position: {
			my: "center bottom-10",
			at: "center top",
			using: function( position, feedback ) {
			  $( this ).css( position );
			  $( "<div>" )
				.addClass( "arrow" )
				.addClass( feedback.vertical )
				.addClass( feedback.horizontal )
				.appendTo( this );
			}
		  }
		});
	
		displayObj.append("<div id='bottomText'><br>Please download and log-in to <a href='http://metamask.io'>MetaMask</a> to play Ether Dilemma. Please read the <a href='/faq.php'>frequently asked questions</a> for more information.</div>");
	}
}