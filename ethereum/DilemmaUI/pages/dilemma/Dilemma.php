<?php

// UI for dilemma
class Dilemma {
	
	// Constructor -- DilemmaUI needs to be constructed first
	function __construct() {
		
		// Include the Javascript required
		echo   "<script src='http://etherdilemma.io:1337/socket.io/socket.io.js'></script>
				<script src='../../../ethereum/DilemmaUI/pages/dilemma/controllers/ChallengeController.js'></script>
				<script src='../../../ethereum/DilemmaUI/pages/dilemma/views/ChallengeView.js'></script>
				<script src='../../../ethereum/DilemmaUI/pages/dilemma/controllers/DilemmaController.js'></script>
				<script src='../../../ethereum/DilemmaUI/pages/dilemma/controllers/TimerController.js'></script>
				<script src='../../../ethereum/DilemmaUI/pages/dilemma/views/TimerView.js'></script>
				<script src='../../../ethereum/DilemmaUI/pages/dilemma/views/MoveView.js'></script>
				<script src='../../../ethereum/DilemmaUI/pages/dilemma/controllers/MoveController.js'></script>
				<script src='../../../ethereum/DilemmaUI/pages/dilemma/controllers/ChatController.js'></script>
				<script src='../../../ethereum/DilemmaUI/pages/dilemma/views/ChatView.js'></script>
				<script src='../../../ethereum/DilemmaUI/pages/dilemma/views/WarningView.js'></script>
				<script src='../../../ethereum/DilemmaUI/pages/dilemma/views/StatsView.js'></script>
				<script src='../../../ethereum/DilemmaUI/pages/dilemma/controllers/StatsController.js'></script>";
		
		// HTML
		echo   '<div id="dilemmaWrapper" class="col-sm-12 col-m-6">';
		
		// Fill up the HTML with JS
		echo   "<script>
				// Load global dilemma blockchain stuff
				var dilemmaController = new DilemmaController(dilemmaUI);
				dilemmaController.createDisplay('dilemmaWrapper', true); // Disabled, for now
				</script>";

		
	}
}