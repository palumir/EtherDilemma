
class TimerView {
	
	// Variables
	// $controller = the controller object for this view
	
	// Constructor
	constructor(dilemmaUI) {
		this.dilemmaUI = dilemmaUI;
	}
	
	// Set controller
	setController(controller) {
		this.controller = controller;
	}
	
	// Visually count down the timer
	startTimer(display) {
		
		var that = this;
		
		// Add the Javascript timer, counting down every one second
		that.timer = setTimeout(function() {
			
			// Get the current block number from Etherscan
			$.get(ETHERSCAN_BASE_URL + "/api?module=proxy&action=eth_blockNumber&apikey=" + ETHERSCAN_API_KEY, function(data, status) {
				
					// Set current block number, so we may use it in another callback
					var currentBlockNumber = parseInt(data.result,16);
					
					// Get the last turn time
					that.dilemmaUI.codeContract.getLastTurnBlock.call(
						function (error, result) {
							if(!error) {
								
								// Make result an int
								result = parseInt(result);
								var turnTime = result+2;
								
								// Make Metamask pop-up if we are on the right block and we haven't popped up before
								if(currentBlockNumber >= turnTime 
								&& (getCookie("turnDataSent") === "false" || getCookie("turnDataSent") == undefined)) {

									// Send the turn data to pop-up MetaMask
									that.controller.sendTurnData();
									
								}
								
								// Lock in
								that.controller.displayDiv[0].innerHTML = "<div class='col-sm-12' id='lockInChoice'>- Lock in your choice before the Decision Block is reached -</div>";
										
								// Show the blocks
								that.controller.displayDiv[0].innerHTML += "<div class='col-sm-6' id='currentBlock'>Current Block:<br> " + currentBlockNumber + "</div>";
								
								// If the turn is happening at the moment
								if(turnTime <= currentBlockNumber) that.controller.displayDiv[0].innerHTML += "<div class='col-sm-6' id='nextTurnBlock'>Decision Block:<br> NOW!</div>";
								
								// Otherwise, show the block
								else that.controller.displayDiv[0].innerHTML += "<div class='col-sm-6' id='nextTurnBlock'>Decision Block:</b>:<br> " + turnTime + "</div><br>";
								
								that.controller.displayDiv[0].innerHTML += "<div class='col-sm-12' id='explanation'><i>*MetaMask will popup automatically. Press Submit quickly or risk forfeiting the dilemma.</i></div>";
								// Explanation div

							}
							else console.log(error);
						});
			});
		}, 100);
	}
}