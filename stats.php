<html lang="en">

	<?php include('templates/head/head.php'); ?>

	<body>

	<div class="container-full">

		<?php include('templates/header/header.php'); ?>
		
		<?php include('ethereum/DilemmaUI/DilemmaUI.php') ?>
		<?php include('ethereum/DilemmaUI/pages/dilemma/Dilemma.php') ?>
		<main id="main" role="main" class="container-full">
			<a href='/index.php'><img class='etherDilemma' src='images/logo.png'></a>
			<div id="appendToMe"><button id='allStats'>All Time</button><button id='weekStats'>1 Week</button><button id='24hStats'>24 Hours</button><button id='1hrStats'>1 Hour</button></div>
			<div id='stats' class='col-sm-12' style='text-align:center; margin-top:15px;'>
			<img width='30px' height='30px' src='images/loading.gif'> Loading stats from the blockchain. This may take a moment. <img width='30px' height='30px' src='images/loading.gif'>
			</div>
		</main>

	</div>

<script src="/ethereum/DilemmaUI/constants/ContractStatics.js"></script>
<script>

	var codeContract = web3.eth.contract(CODE_CONTRACT_ABI);
	codeContract = codeContract.at(CODE_CONTRACT_ADDRESS);
	
	var events = codeContract.allEvents({fromBlock: 0, toBlock: "latest"});
	
	// Print stats div
	function printStatsDiv(logs, yours = false /* your stats or global? */, window = 0 /* in hours */) {
		
		// Convert window to milliseconds from hours
		var window = window*60*60;
		var now = Math.round(Date.now()/1000);
		
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
			if(event.event == "dilemmaFinished" && (window == 0 || parseInt(event.args["_timeStamp"]) > now - window)) {
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
		var titleMoves = "";
		var container = "";
		var containerMoves = "";
		if(yours) {
			title = "PERSONAL OUTCOME STATS";
			titleMoves = "PERSONAL CHOICE STATS";
			container = 'yourStats';
			containerMoves = 'yourMoveStats';
		}
		else { 
			title = "WORLDWIDE OUTCOME STATS";
			titleMoves = "WORLDWIDE CHOICE STATS";
			container = 'globalStats';
			containerMoves = 'globalMoveStats';
		}
		
		displayDiv.append("<div id='totalStats' class='col-sm-6 left centerText'><h2>" + title + "</h2><canvas id='" + container + "'></canvas><h2>" + titleMoves + "</h2><canvas id='" + containerMoves + "'></canvas></div>");
		
		new Chart(document.getElementById(container),{"type":"doughnut","data":{"labels":["Alliances","Betrayals","Duplicities","Mistrusts","Revelations","Standoffs"],"datasets":[{"label":title,"data":[duplicities,alliances,betrayals,mistrusts,revelations,standoffs],"backgroundColor":["#005266","#009933","#600000","#005266","#9e00d2","#600000"]}]}});
		new Chart(document.getElementById(containerMoves),{"type":"doughnut","data":{"labels":["Allies","Betrays","Calls"],"datasets":[{"label":title + " MOVES","data":[allies,betrays,calls],"backgroundColor":["#00add7","#f40000","#9e00d2"]}]}});
		
	}
	
	function newDiv() {
		if(web3 == undefined) $('#appendToMe').append("<div id='stats' class='col-sm-12'>Please install MetaMask to see stats for EtherDilemma. Stats are pulled directly from the blockchain through MetaMask.</div>");
		else {
			var totalStats = $('#stats');
			if(totalStats[0] != undefined) totalStats.remove();
			$('#appendToMe').append("<div id='stats' class='col-sm-12'></div>");
		}
	}
	
	function newStats(logs, window) {
		printStatsDiv(logs, false, window);
		if(web3.eth.accounts[0] != undefined) printStatsDiv(logs, true, window);
		else {
			$('#stats').append("<div id='totalStats' class='col-sm-6 left centerText'><h2>PERSONAL STATS</h2>Please log-in to MetaMask to see your personal stats.</div>");
		}
	}
	
	var globalLogs = "";

	// Get all past logs again
	events.get(function(error, logs){ 
	
		// Delete stats div and redraw it to begin with
		globalLogs = logs;
		newDiv();
		newStats(logs,0);
		
		$('#allStats')[0].onclick = function() {
			newDiv();
			newStats(globalLogs,0);
		};
		$('#weekStats')[0].onclick = function() {
			newDiv();
			newStats(globalLogs,24*7);
		};
		$('#24hStats')[0].onclick = function() {
			newDiv();
			newStats(globalLogs,24);
		};
		$('#1hrStats')[0].onclick = function() {
			newDiv();
			console.dir(globalLogs);
			newStats(globalLogs,1);
		};
	});
	
</script>

<?php include('templates/footer/footer.php'); ?>
	</body>
</html>