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
	
	// Create disabled screen
	createDisabledScreen(display) {
		var displayObj = $("#" + display);
		displayObj.empty();
		displayObj.append("<a href='/index.php'><img class='etherDilemma' src='images/logo.png'></a>");
		displayObj.append("<div id='trusted'>The blockchain can be trusted... can you?</div>");
		displayObj.append("<br><div class='center'>Thank you to everybody who played the beta!<br><br>We appreciate your interest and your time. <br><br>Please direct any inquiries to EtherDilemma@gmail.com or join us on Discord at <a href='https://discord.gg/sB8rVns'>https://discord.gg/sB8rVns</a></div>");
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
		
		// Build middle section
		var middleSection = "<div id='gameStuff' class='col-sm-7'>";
		middleSection += "<div id='theGame' class='col-sm-12'><h4 class='col-lg-4 col-sm-12 left'><img src='images/theGame.png' class='left'></h4><div class='left col-lg-8 col-sm-12 gameStuff'><div class='left col-lg-4 col-sm-12'><div class='col-sm-12'><img src='images/head.png'></div><div class='col-sm-12'>Match with a random player</div></div><div class='left col-lg-4 col-sm-12'><div class='col-sm-12'><img src='images/cash.png'></div><div class='col-sm-12'>Negotiate your alliance</div></div><div class='left col-lg-4 col-sm-12'><div class='col-sm-12'><img src='images/scale.png'></div><div class='col-sm-12'>Decide Ally or Betray</div></div></div></div>";
		middleSection += "<div id='theStakes' class='col-sm-12'><h4 class='col-lg-4 col-sm-12 left'><img src='images/theStakes.png' class='left'></h4><div class='left col-lg-8 col-sm-12 stakesText'>Each player must wager <div class='finney' title='" + finneyText + "'>20 finney</div> to start the dilemma</div></div>";
		middleSection += "<div id='thePayout' class='col-sm-12'><h4 class='col-lg-4 col-sm-12 left'><img src='images/thePayout.png' class='left'></h4><div class='payouts col-lg-8 col-sm-12 left'><div class='col-lg-4 col-sm-12 left'><img src='images/alliance.png' class='left'></div><div class='col-lg-4 col-sm-12 left'><img src='images/betrayal.png' class='left'></div><div class='col-lg-4 col-sm-12 left'><img src='images/duplicity.png' class='left'></div><div class='col-lg-4 col-sm-12 left'><img src='images/mistrust.png' class='left'></div><div class='col-lg-4 col-sm-12 left'><img src='images/revelation.png' class='left'></div><div class='col-lg-4 col-sm-12 left'><img src='images/standoff.png' class='left'></div></div></div>";
		middleSection += "</div>"; // End gameStuff Div
		
		displayObj.append(middleSection);
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