
// Custom JQuery plugins
(function ( $ ) {
	
	// Convert a button to a blockchainButton
    $.fn.blockChainButtonSimple = function(contractFunction) {
        this.click(function() {
			
			// Add our callback and arguments to the array so if the transaction is rejected, our geode cracking GIF resets
			dilemmaUI.pushRejectCallback([function(args) {
				$('#loader').remove();
				$('#dilemmaWrapper').append("<button id='challengeButton'>Play</button>");
				$('#challengeButton').blockChainButtonSimple(dilemmaUI.codeContract.hostChallenge);
			},
			[]]);
			
			// First estimate gas
			contractFunction.estimateGas({from:web3.eth.accounts[0], value: 20000000000000000},
			
			// Callback
			function(error,result) {
					if(!error) {
						
						// Remove play button
						
						// Set loading image and text
						$("#challengeButton").remove();
						$("#dilemmaWrapper").append("<div id='loader'><img width='30px' height='30px' src='images/loading.gif'> Searching For Partner <img width='30px' height='30px' src='images/loading.gif'></div>");
						
						
						// Then call the function
						contractFunction.sendTransaction(
						{from:web3.eth.accounts[0], gas: 250000, value: 20000000000000000},
						
						// Callback
						function (error, result){
							if(!error){
							} 
							else {
								console.log(error);
							}
						});
					}
					else {
						console.log(error);
					}
			});
		});
		
        return this;
    };
	
	
	// Droppable methods
	var droppableMethods = {
        init : function(contractFunction, gas, args = []) {
			
			// Array to store slots
			this.slots = [];
			
			// Javascript is great
			var that = this;
			
			// Click listener
			this.click(function() {
							
				// Format arguments
				var arguments = [];
				arguments.push(web3.eth.accounts[0]);
				arguments.push(that.slots);
				for(var i = 0; i < args.length; i++) arguments.push(args[i]);
				arguments.push({from:web3.eth.accounts[0], gas: gas});
				arguments.push(function (error, result){
					if(!error){
					} 
					else {
						console.log(error);
					}
				});
				
				// Send gas
				contractFunction.sendTransaction.apply(that, arguments);
				})
			return this;
        },
        updateSlots : function(slots) { this.slots = slots; },
    };
	
	// Convert a button to a blockchainButton that submits things in droppable
    $.fn.blockChainButtonDroppable = function(args, gas = 0, blockChainArgs) { 
	
		// If it's an array, we're calling a method
		if(Array.isArray(args)) {
			if(args[0] == "updateSlots") {
				return droppableMethods.updateSlots.apply(this, [args[1]]);
			}
		}
		
		// Otherwise, it's an init call
		return droppableMethods.init.apply(this, [args, gas, blockChainArgs]);
    };

}(jQuery));


// Watch for an $(event), then call $(callBack). If another event with the same $(module) and event fields comes through, it's considered a duplicate
// Requires geodeUI global to be defined by geodeUI
function watchForEvent(event, callback, module) {
	
	// Watch for the event
	event.watch(function(error, result) { 
	
		// If we receive no error
		if(!error) {
					
			// If it's our inventory, and not a duplicate event, update it.
			if(!dilemmaUI.checkForDuplicateEvent(result,module)) {
				callback(result);
			}
		}
		else {
			console.log(error);
		}
	});
}