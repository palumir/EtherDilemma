
class StatsController {
	
	// Variables:
	// $view = view for this controller
	// $dilemma = the dilemma controller, with all global blockchain variables
	
	// Constructor
	constructor(dilemmaUI, dilemmaController) {
		
		// Set web3 so we may use it in methods
		this.dilemmaUI = dilemmaUI;
		
		// Dilemma
		this.dilemmaController = dilemmaController;
	}
	
	// Set view
	setView(view) {
		this.view = view;
	}
	
	// Load stats
	loadStats(display) {
				
		var that = this;
		
		// watch for an event with {some: 'args'}
		var events = dilemmaUI.codeContract.allEvents({fromBlock: 3000000, toBlock: "latest"});
		
		// Variables
		var allies = 0;
		var betrays = 0;
		var calls = 0;

		// Get all past logs again
		events.get(function(error, logs){ 
		
			// Loop through event logs
			for(var i = 0; i < logs.length; i++) {
				
				// Only look at dilemmas that finished
				var event = logs[i];
				if(event.event == "dilemmaFinished") {
					
					// Tally up results for partner
					if(event.args["_who"] == that.dilemmaController.partnerAddress) {
						if(event.args["_whoMove"] == 0) allies++;
						else if(event.args["_whoMove"] == 1) betrays++;
						else if(event.args["_whoMove"] == 2) calls++;
					}
				}
			}
			
			// Load the stats and create fancy HTML
			var statsHTML = "<div class='centerText'>Your opponent's history:<br><canvas id='theirStats'></canvas></div>";
		
			// Set the div
			$("#" + display)[0].innerHTML = statsHTML;
			
			new Chart(document.getElementById('theirStats'),{"type":"doughnut","data":{"labels":["Ally","Betray","Call"],"datasets":[{"label":"Your opponent's stats:","data":[allies,betrays,calls],"backgroundColor":["#00add7","#f40000","#9e00d2"]}]}});
			
			console.log(allies);
			
		});
		
	}

	// Create the actual display with id $(display)
	createDisplay(display) {
		var that = this;

		// The actual function we want to run
		var fillDisplayFunction = function(display) {
			
			// Create table
			that.view.createInterface(display);
			
			// Load stats into table
			that.loadStats('statsView');
		}
		
		// Wait Metamask account injection before running the function
		this.dilemmaController.waitDilemma(
			fillDisplayFunction,
			display);
	}
}