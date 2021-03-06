
// Set the fast gas price
var fastGasPrice = 9000000000; // Defaults to 5, updated by API call

// Pull from Etherchain
$.get("https://www.etherchain.org/api/gasPriceOracle", function(data) {
	fastGasPrice = data.fast*1000000000;
});

// Custom JQuery plugins
(function ( $ ) {
	
	// Convert a button to a blockchainButton
    $.fn.blockChainButtonChallenge = function(contractFunction) {
        this.click(function() {

			// First estimate gas
			contractFunction.estimateGas({from:web3.eth.accounts[0], value: 20000000000000000, gasPrice: fastGasPrice},
			
			// Callback
			function(error,result) {
					if(!error) {
						
						// Then call the function
						contractFunction.sendTransaction(
						{from:web3.eth.accounts[0], gas: 200000, value: 20000000000000000, gasPrice: fastGasPrice},
						
						// Callback
						function (error, result){
							if(!error){
								
								// Remove play button
								$("#challengeButton")[0].outerHTML = "<div id='loader'><img width='20px' height='20px' src='images/loading.gif'> Searching for partner <img width='20px' height='20px' src='images/loading.gif'></div>";
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
	
	// Convert link to anti AFK link
	$.fn.blockChainButtonAFK = function(contractFunction) {
        this.click(function() {
						
						// Then call the function
						contractFunction.sendTransaction(
						{from:web3.eth.accounts[0], gas: 200000, gasPrice: fastGasPrice},
						
						// Callback
						function (error, result){
							if(!error){
								
								// Remove play button
								$("#updateBlock").html("<div id='updateBlock'><div class='title'>Report Submitted</div><div class='text'><img width='20px' height='20px' src='images/loading.gif'> Waiting for Blockchain <img width='20px' height='20px' src='images/loading.gif'></div></div>");
							} 
							else {
															
								console.log(error);
							}
						});
			});
		
        return this;
    };
	
	// Convert link cancel link
	$.fn.blockChainButtonCancel = function(contractFunction) {
        this.click(function() {
						
						// Then call the function
						contractFunction.sendTransaction(
						{from:web3.eth.accounts[0], gas: 150000, gasPrice: fastGasPrice},
						
						// Callback
						function (error, result){
							if(!error){
								
								// Remove play button
								$("#loader").html("<div id='loader'><img width='30px' height='30px' src='images/loading.gif'> Cancelling search, please wait <img width='30px' height='30px' src='images/loading.gif'></div>");
							} 
							else {
															
								console.log(error);
							}
						});
			});
		
        return this;
    };
	

}(jQuery));


// Watch for an $(event), then call $(callBack). If another event with the same $(module) and event fields comes through, it's considered a duplicate
// Requires geodeUI global to be defined by geodeUI
function watchForEvent(event, callback, module) {
		
	event.options.fromBlock = 'latest';
	event.options.toBlock = 'latest';
	
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