<script>

	// Locally defined constants for the contracts, for now
	const CODE_CONTRACT_ADDRESS = "0xe5559612eeb9fc8eb8dc4954927fea4a571c4c4d";
	const CODE_CONTRACT_ABI = [
		{
			"constant": false,
			"inputs": [],
			"name": "cancelChallenge",
			"outputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [],
			"name": "hostChallenge",
			"outputs": [],
			"payable": true,
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [],
			"name": "init",
			"outputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_betray",
					"type": "bool"
				}
			],
			"name": "makeMove",
			"outputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"name": "_who",
					"type": "address"
				}
			],
			"name": "missedTurn",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"name": "_who",
					"type": "address"
				}
			],
			"name": "dilemmaStarted",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"name": "_who",
					"type": "address"
				}
			],
			"name": "challengeCanceled",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"name": "_who",
					"type": "address"
				}
			],
			"name": "challengeHosted",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"name": "_who",
					"type": "address"
				},
				{
					"indexed": false,
					"name": "_payout",
					"type": "uint256"
				},
				{
					"indexed": false,
					"name": "_whoBetray",
					"type": "bool"
				},
				{
					"indexed": false,
					"name": "_partnerBetray",
					"type": "bool"
				}
			],
			"name": "dilemmaFinished",
			"type": "event"
		},
		{
			"constant": false,
			"inputs": [],
			"name": "reportPartnerAFK",
			"outputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"name": "_storageAddress",
					"type": "address"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"constant": true,
			"inputs": [
				{
					"name": "",
					"type": "uint256"
				}
			],
			"name": "challengeList",
			"outputs": [
				{
					"name": "",
					"type": "address"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [
				{
					"name": "",
					"type": "address"
				}
			],
			"name": "challenges",
			"outputs": [
				{
					"name": "active",
					"type": "bool"
				},
				{
					"name": "number",
					"type": "uint256"
				},
				{
					"name": "randomNumber",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [
				{
					"name": "",
					"type": "address"
				}
			],
			"name": "dilemmas",
			"outputs": [
				{
					"name": "partner",
					"type": "address"
				},
				{
					"name": "active",
					"type": "bool"
				},
				{
					"name": "lastTurnBlock",
					"type": "uint256"
				},
				{
					"name": "betray",
					"type": "bool"
				},
				{
					"name": "turnsMissed",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "getLastTurnBlock",
			"outputs": [
				{
					"name": "",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "getPartnerAddress",
			"outputs": [
				{
					"name": "",
					"type": "address"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "getPartnerLastTurnBlock",
			"outputs": [
				{
					"name": "",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "isChallengeActive",
			"outputs": [
				{
					"name": "",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "isDilemmaActive",
			"outputs": [
				{
					"name": "",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		}
	];

	var codeContract = web3.eth.contract(CODE_CONTRACT_ABI);
	codeContract = codeContract.at(CODE_CONTRACT_ADDRESS);
	
	// watch for an event with {some: 'args'}
	var events = codeContract.allEvents({fromBlock: 3449295, toBlock: 3450032});
	events.watch(function(error, result){
	});

	// Get all past logs again
	events.get(function(error, logs){ 
	
		// Variables
		var duplicities = 0;
		var alliances = 0;
		var betrayals = 0;
	
		// Loop through event logs
		for(var i = 0; i < logs.length; i++) {
			
			// Only look at dilemmas that finished
			var event = logs[i];
			if(event.event == "dilemmaFinished") {
				var whoBetray = event.args["_whoBetray"];
				var partnerBetray = event.args["_partnerBetray"];
				
				// Tally up results
				if(whoBetray && partnerBetray) duplicities++;
				else if(!whoBetray && !partnerBetray) alliances++;
				else betrayals++;
			}
		}
		
		// Divide all by two, since we have a dilemma finished for BOTH users in a dilemma
		duplicities = duplicities/2;
		alliances = alliances/2;
		betrayals = betrayals/2;
		
		// Total
		var total = betrayals + duplicities + alliances;
		
		// Log
		console.log("Total: " + total);
		console.log("Duplicities: " + ((duplicities/total)*100) + "%");
		console.log("Alliances: " + ((alliances/total)*100) + "%");
		console.log("Betrayals: " + ((betrayals/total)*100) + "%");
	
	});

	// would stop and uninstall the filter
	events.stopWatching();
	
</script>