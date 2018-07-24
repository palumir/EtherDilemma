<html lang="en">

	<?php include('templates/head/head.php'); ?>

	<body>

	<div class="container-full">

		<?php include('templates/header/header.php'); ?>
		
		<?php include('ethereum/DilemmaUI/DilemmaUI.php') ?>
		<?php include('ethereum/DilemmaUI/pages/dilemma/Dilemma.php') ?>
		<main id="main" role="main" class="container-full">
			<a href='/index.php'><img class='etherDilemma' src='images/logo.png'></a>
			<div id='stats' class='col-sm-12'>
			</div>
		</main>

	</div>

<script src="/ethereum/DilemmaUI/constants/ContractStatics.js"></script>
<script>

	var codeContract = web3.eth.contract(CODE_CONTRACT_ABI);
	codeContract = codeContract.at(CODE_CONTRACT_ADDRESS);
	
	var events = codeContract.allEvents({fromBlock: 0, toBlock: "latest"});
	
	// Print stats div
	function printStatsDiv(logs, yours = false) {
		
		// Variables
		var allies = 0;
		var betrays = 0;
		var calls = 0;
		var duplicities = 0;
		var alliances = 0;
		var betrayals = 0;
		var mistrusts = 0;
		var standoffs = 0;
		var revelations = 0;
		var total = 0;
	
		// Loop through event logs
		for(var i = 0; i < logs.length; i++) {
			
			// Only look at dilemmas that finished
			var event = logs[i];
			if(event.event == "dilemmaFinished") {
				var whoMove = event.args["_whoMove"];
				var partnerMove = event.args["_partnerMove"];
				
				// Tally total results
				if(!yours || web3.eth.accounts[0] == event.args['_who']) {
					total++;
					if(whoMove == 0) allies++;
					if(whoMove == 1) betrays++;
					if(whoMove == 2) calls++;
					if(whoMove == 0 && partnerMove == 0) alliances++;
					if(whoMove == 1 && partnerMove == 1) duplicities++;
					if(whoMove == 2 && partnerMove == 2) standoffs++;
					if((whoMove == 0 && partnerMove == 2) || (whoMove == 2 && partnerMove == 0)) mistrusts++;
					if((whoMove == 1 && partnerMove == 0) || (whoMove == 0 && partnerMove == 1)) betrayals++;
					if((whoMove == 2 && partnerMove == 1) || (whoMove == 1 && partnerMove == 2)) revelations++;
				}
				
			}
		}
		
		// Divide all by two, since we have a dilemma finished for BOTH users in a dilemma
		if(!yours) {
			duplicities = duplicities/2;
			alliances = alliances/2;
			betrayals = betrayals/2;
			mistrusts = mistrusts/2;
			standoffs = standoffs/2;
			revelations = revelations/2;
			total = total/2;
		}
		
		// Update the div
		var displayDiv = $('#stats');
		
		// Block title, text, and div
		var title = "";
		var container = "";
		if(yours) {
			title = "YOUR STATS";
			container = 'yourStats';
		}
		else { 
			title = "GLOBAL STATS";
			container = 'globalStats';
		}
		
		displayDiv.append("<div class='col-sm-6 left centerText'><h2>" + title + "</h2><canvas id='" + container + "'></canvas></div>");
		
		new Chart(document.getElementById(container),{"type":"doughnut","data":{"labels":["Duplicities","Alliances","Betrayals","Mistrusts","Revelations","Standoffs"],"datasets":[{"label":title,"data":[duplicities,alliances,betrayals,mistrusts,revelations,standoffs],"backgroundColor":["#600000","#005266","#009933","#005266","#9e00d2","#600000"]}]}});
		
	}

	// Get all past logs again
	events.get(function(error, logs){ 
		printStatsDiv(logs);
		if(web3.eth.accounts[0] != undefined) printStatsDiv(logs, true);
	});
	
</script>


	</body>
</html>