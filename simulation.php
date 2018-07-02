<?php

// Constants
$cost = 40;
$betrayalPayout = 36;
$alliancePayout = 48;
$duplicityPayout = 12;
$numberOfDilemmas = 10000;
$betrayalChance = 0.42;
$allianceChance = 0.23;
$duplicityChance = 0.35;

// Variables
$contractFinney = 200; // 200 finney to start

// Check 
for($i = 0; $i < $numberOfDilemmas; $i++) {
	
	// Get a random number between 1 and 100
	$percentage = rand(1,100);
	
	// Add the cost
	$contractFinney += $cost;
	
	// Subtract the payout (random payout, given percentages)
	if($percentage < 100*$betrayalChance) {
		$contractFinney -= $betrayalPayout;
	}
	else if($percentage < 100*($betrayalChance + $allianceChance)) {
		$contractFinney -= $alliancePayout;
	}
	else if($percentage < 100*($betrayalChance + $allianceChance + $duplicityChance)) {
		$contractFinney -= $duplicityPayout;
	}
}

// Output some numbers
echo "After " . $numberOfDilemmas . " iterations, there is " . $contractFinney . " finney left in the contract.";

?>