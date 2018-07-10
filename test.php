
				
<html lang="en">

	<?php include('templates/head/head.php'); ?>
	<body>

	<div class="container-full">

		<?php include('templates/header/header.php'); ?>
		
		<?php include('ethereum/DilemmaUI/DilemmaUI.php') ?>
		<?php include('ethereum/DilemmaUI/pages/dilemma/Dilemma.php') ?>

		<?php 
			$dilemmaUI = new DilemmaUI();
		?>
		<main id="main" role="main" class="container-full">
			
			<?php
				
				// Include the Javascript required
				echo   "<script src='../../../ethereum/DilemmaUI/pages/dilemma/controllers/ChallengeController.js'></script>
						<script src='../../../ethereum/DilemmaUI/pages/dilemma/views/ChallengeView.js'></script>
						<script src='../../../ethereum/DilemmaUI/pages/dilemma/controllers/DilemmaController.js'></script>
						<script src='../../../ethereum/DilemmaUI/pages/dilemma/controllers/TimerController.js'></script>
						<script src='../../../ethereum/DilemmaUI/pages/dilemma/views/TimerView.js'></script>
						<script src='../../../ethereum/DilemmaUI/pages/dilemma/views/MoveView.js'></script>
						<script src='../../../ethereum/DilemmaUI/pages/dilemma/controllers/MoveController.js'></script>
						<script src='../../../ethereum/DilemmaUI/pages/dilemma/controllers/ChatController.js'></script>
						<script src='../../../ethereum/DilemmaUI/pages/dilemma/views/ChatView.js'></script>
						<script src='../../../ethereum/DilemmaUI/pages/dilemma/views/WarningView.js'></script>";
				
				// HTML
				echo   '<div id="dilemmaWrapper" class="col-sm-12 col-m-6">';
				
				// Fill up the HTML with JS
				echo   "<script>
						// Load global dilemma blockchain stuff
						var dilemmaController = new DilemmaController(dilemmaUI);
						dilemmaController.createDisplay('dilemmaWrapper', false);
						</script>";
			
			?>

		</main>

	</div>

	</body>
</html>


