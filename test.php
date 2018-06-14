<?php

// Constants
$cost = 40;
$betrayAllyPayout = 36;
$allyAllyPayout = 48;
$betrayBetrayPayout = 12;
$numberOfDilemmas = 100;
$betrayAllyChance = 0.5;
$allyAllyChance = 0.25;
$betrayBetrayChance = 0.25;

// Variables
$contractFinney = 200; // 200 finney to start

// Check 
for($i = 0; $i < $numberOfDilemmas; $i++) {
	
	// Get a random number between 1 and 100
	$percentage = rand(1,100);
	
	// Add the cost
	$contractFinney += $cost;
	
	// Subtract the payout (random payout, given percentages)
	if($percentage < 100*$betrayAllyChance) {
		$contractFinney -= $betrayAllyPayout;
	}
	else if($percentage < 100*($betrayAllyChance + $allyAllyChance)) {
		$contractFinney -= $allyAllyPayout;
	}
	else if($percentage < 100*($betrayAllyChance + $allyAllyChance + $betrayBetrayChance)) {
		$contractFinney -= $betrayBetrayPayout;
	}
}

// Output some numbers
echo "After " . $numberOfDilemmas . " iterations, there is " . $contractFinney . " finney left in the contract.";


?>