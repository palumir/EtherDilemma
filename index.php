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
				$dilemma = new Dilemma();	
			?>

		</main>
		
		<?php include('templates/footer/footer.php'); ?>

	</div>

	</body>
</html>


