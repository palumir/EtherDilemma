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
		displayObj.empty();
		displayObj.append("<a href='/index.php'><img class='etherDilemma' src='images/logo.png'></a>");
		displayObj.append("<div id='trusted'>The blockchain can be trusted... can you?</div>");
		displayObj.append("<div id='gameStuff' class='col-sm-7'><div id='theGame'><h4><img src='images/theGame.png'></h4><div class='col-sm-12'><div class='left'>Click <div class='play'>PLAY</div></div><div class='arrows'>>></div><div class=' left'>NEGOTIATE</div><div class='arrows'>>></div><div class='left'><div class='ally'><img src='images/ally.png' title='" + allyText + "' >ALLY</div> or <div class='betray'><img src='images/betray.png' title='" + betrayText + "'>BETRAY</div></div></div></div><div id='theStakes'><h4><img src='images/theStakes.png'></h4><div>Each player must wager <div class='finney' title='" + finneyText + "'>20 finney</div> to start the dilemma</div></div><div id='thePayout' class='col-sm-12'><h4><img src='images/thePayout.png'></h4><div id='payoutSection' class='col-sm-12'><div class='col-sm-4'><img src='images/Ally-Ally.png'></div><div class='col-sm-4'><img src='images/Betray-Ally.png'></div><div class='col-sm-4'><img src='images/Betray-Betray.png'></div></div></div></div>");
		displayObj.append("<div class='col-sm-7' id='bottomText'><button id='challengeButton' title='Please install and login to MetaMask to play Ether Dilemma'>PLAY</button><br>Please download <a href='http://metamask.io'>MetaMask</a> to play Ether Dilemma. See the <a href='/faq.php'>FAQ</a> for more information on installing MetaMask.</div>");
		createFooter(display);
				
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
	
	}
}