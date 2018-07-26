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
		displayObj.append("<br><div class='center'>Thank you to everybody who played the beta!<br><br>We appreciate your interest and your time. <br><br>Please direct any inquiries to EtherDilemma@gmail.com or join us on Discord at <a href='https://discord.gg/ZNbrQbc'>https://discord.gg/ZNbrQbc</a></div>");
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
		middleSection += "<div id='theGame' class='col-sm-12'><h4 class='col-lg-4 col-sm-12 left'><img src='images/theGame.png' class='left'></h4><div class='left col-lg-8 col-sm-12 gameStuff'><div class='left col-lg-4 col-sm-12'><div class='col-sm-12'><img src='images/head.png'></div><div class='col-sm-12'>Match with a random player</div></div><div class='left col-lg-4 col-sm-12'><div class='col-sm-12'><img src='images/cash.png'></div><div class='col-sm-12'>Negotiate your alliance</div></div><div class='left col-lg-4 col-sm-12'><div class='col-sm-12'><img src='images/scale.png'></div><div class='col-sm-12'>Decide Ally, Betray, or Call</div></div></div></div>";
		middleSection += "<div id='theStakes' class='col-sm-12'><h4 class='col-lg-4 col-sm-12 left'><img src='images/theStakes.png' class='left'></h4><div class='left col-lg-8 col-sm-12 stakesText'>Each player must wager <div class='finney' title='" + finneyText + "'>20 finney</div> to start the dilemma</div></div>";
		middleSection += "<div id='thePayout' class='col-sm-12'><h4 class='col-lg-4 col-sm-12 left'><img src='images/thePayout.png' class='left'></h4><div class='payouts col-lg-8 col-sm-12 left'><div class='col-lg-4 col-sm-12 left'><img src='images/Alliance-Left.png' title='-20 from wager + 26 from bank = +6 net finney' class='left'><img src='images/Alliance-Right.png' title='-20 from wager + 26 from bank = +6 net finney' class='left'></div><div class='col-lg-4 col-sm-12 left'><img src='images/Betrayal-Left.png' title='-20 from wager + 36 from bank = +16 net finney' class='left'><img src='images/Betrayal-Right.png' title='-20 from wager + 0 from bank = -20 net finney' class='left'></div><div class='col-lg-4 col-sm-12 left'><img src='images/Duplicity-Left.png' title='-20 from wager + 4 from bank = -16 net finney' class='left'><img src='images/Duplicity-Right.png' title='-20 from wager + 4 from bank = -16 net finney' class='left'></div><div class='col-lg-4 col-sm-12 left'><img src='images/Mistrust-Left.png' title='-20 from wager + 29 from bank = +9 net finney' class='left'><img src='images/Mistrust-Right.png' title='-20 from wager + 17 from bank = -3 net finney' class='left'></div><div class='col-lg-4 col-sm-12 left'><img src='images/Revelation-Left.png' title='-20 from wager + 23 from bank = +3 net finney' class='left'><img src='images/Revelation-Right.png' title='-20 from wager + 17 from bank = -3 net finney' class='left'></div><div class='col-lg-4 col-sm-12 left'><img src='images/Standoff-Left.png' title='-20 from wager + 17 from bank = -3 net finney' class='left'><img src='images/Standoff-Right.png' title='-20 from wager + 17 from bank = -3 net finney' class='left'></div></div></div>";
		middleSection += "</div>"; // End gameStuff Div
		
		displayObj.append(middleSection);
		displayObj.append("<div class='col-sm-7' id='bottomText'><button id='challengeButton' title='Please install and login to MetaMask to play Ether Dilemma'>PLAY</button><br>Please download <a href='http://metamask.io'>MetaMask</a> to play Ether Dilemma. See the <a href='/faq.php'>FAQ</a> for more information on installing MetaMask.</div>");
		displayObj.append("<a target='_blank' class='discord' href='https://discord.gg/ZNbrQbc'><img src='/images/discord.png' style='height:75px; width:75px'></a>");
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