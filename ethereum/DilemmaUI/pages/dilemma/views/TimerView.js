
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
		that.timer = setInterval(function() {
			
			// Get the current block number from Etherscan
			$.get(ETHERSCAN_BASE_URL + "/api?module=proxy&action=eth_blockNumber&apikey=" + ETHERSCAN_API_KEY, function(data, status) {
				
					// Set current block number, so we may use it in another callback
					var currentBlockNumber = parseInt(data.result,16);
					
					// Get partner last turn time
					that.dilemmaUI.codeContract.getPartnerLastTurnBlock.call(
						function (error, result) {
							if(!error) {
								
								var partnerLastTurnBlock = parseInt(result);
							
								// Get the last turn time
								that.dilemmaUI.codeContract.getLastTurnBlock.call(
									function (error, result) {
										if(!error) {
											
											// Make result an int
											result = parseInt(result);
											var turnTime = result+8; 
											
											// Make Metamask pop-up if we are on the right block and we haven't popped up before
											if(currentBlockNumber >= turnTime 
											&& (getCookie("turnDataSent") === "false" || getCookie("turnDataSent") == undefined)) {

												// Send the turn data to pop-up MetaMask
												that.controller.sendTurnData();
												
											}
											
											// Lock in
											that.controller.displayDiv[0].innerHTML = "";
											
											// View to show the current block and decision block
											var blockView = "";
											
											// Countdown value
											var countdown = turnTime - currentBlockNumber;
											if(countdown < 0 || partnerLastTurnBlock != result) countdown = 0; // Bottom out @ 0
													
											// Show the blocks
											blockView += "<div id='blockHolder' class='col-sm-12'><div class='cubeText blocks'>BLOCKS</div><div class='countdown'>" + countdown + "</a></div><div class='cubeText remaining'>REMAINING</div></div>";
												
											// Add blockView to the HTML
											that.controller.displayDiv[0].innerHTML += blockView;

											// If we go over 10 blocks, display to report the enemy for AFK, but only once (do not keep resetting this)
											if(currentBlockNumber > partnerLastTurnBlock + 15 && result > partnerLastTurnBlock && partnerLastTurnBlock != that.partnerLastTurnBlock) { 
											
												// Set timestamp
												that.partnerLastTurnBlock = partnerLastTurnBlock;
												
												// Change the update block
												var updateBlock = $('#updateBlock');
												var afkText = $('#afkText');
												var endScreen = $('#endScreen');
												var afkHTML = "<div id='afkText'>It looks like your opponent has gone AFK. <a href=\"#\" id=\"afkReport\">Click here</a> to report them and win the dilemma.</div>";
												if(afkText[0] == undefined && endScreen[0] == undefined) {
													updateBlock.html("<div id='updateBlock' class='col-sm-12' ><div class='title'>AFK!</div>" + afkHTML + "</div>");
													$('#afkReport').blockChainButtonAFK(that.controller.dilemmaUI.codeContract.reportPartnerAFK);
												}
											}

										}
										else console.log(error);
									});
							}
							else console.log(error);
						});
			});
		}, 100);
	}
}