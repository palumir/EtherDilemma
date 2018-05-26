

// GeodeUI class to provide an interface between Geode Contracts on Ethereum Network and local Javascript
// Requires web3 to function.
// Requires ContractStatics.js to function
// Requires Interact.js to function
// Requires Pagination.js to function
// Requires Bootstrap.js to function
// Requires Cookies.js to function
// Requires Strings.js to function 
// Requires BlockChainHelpers.js to function
// All of these are included in GeodeUI.php
class DilemmaUI {
	
	// Variables:
	// $web3 = the web3 instance that we're using
	// $codeContract = the loaded code contract
	// $storageContract = the loaded storage contract
	// $rejectCallbacks[] = array that stores callback function and arguments to call if MetaMask transaction is rejected, in the order that transactions are entered
	//
	// $currBlockNum[] = most recent block numbers that we have stored, for each module
	// $recentEvents[] = events from the current block number and module
	
	// Constructor $(web3Instance) is the web3 object
	constructor(web3Instance) {
		
		// Set web3 so we may use it in methods
		this.web3 = web3Instance;
		
		// Load the contracts
		var codeContract = web3.eth.contract(CODE_CONTRACT_ABI);
		this.codeContract = codeContract.at(CODE_CONTRACT_ADDRESS);
		var storageContract = web3.eth.contract(STORAGE_CONTRACT_ABI);
		this.storageContract = storageContract.at(STORAGE_CONTRACT_ADDRESS);
		
		// Initialize some stuff
		this.recentEvents = [];
		this.currBlockNum = [];
		
		// Set a holder variable for $(this) so we can use it in callbacks
		var myself = this;
		
		// Initiate our reject callback array
		this.rejectCallbacks = [];
		
		// Set proper Etherscan API (actual var located in EtherScanAPI constants
		this.web3.version.getNetwork((err, netId) => {
		  switch (netId) {
			case "1":
			  ETHERSCAN_BASE_URL = "https://api.etherscan.io"
			  break
			case "3":
			  ETHERSCAN_BASE_URL = "https://api-ropsten.etherscan.io"
			  break
			default:
			  console.log('This is an unknown/unsupported network.')
		  }
		});
		
		// Yeah probably shouldn't do this but MetaMask gives me no options
		this.hijackLog();
	}
	
	// Push a function and its args to the reject callback list, for when a user rejects on MetaMask
	pushRejectCallback(functionAndArgs) {
		this.rejectCallbacks.push(functionAndArgs);
	}
	
	// Hijack the console log function so we can handle MetaMask rejects
	hijackLog() {
	
		// For callbacks
		var myself = this;
		
		(function(){
			var oldLog = console.log;
			console.log = function (message) {
				
				// Check if user rejected in MetaMask
				if(arguments[0].message != undefined && 
				(arguments[0].message.includes("Error: MetaMask Tx Signature: User denied transaction signature.") // Chrome
				|| arguments[0].message.includes("background.js:1:37411"))) { // Firefox
					
					// Call the most recent callback with it's args and pop it from the array
					if(myself.rejectCallbacks.length > 0) {
						var callBack = myself.rejectCallbacks.pop();
						callBack[0](callBack[1]);
					}
				}
				
				// Just apply the log
				oldLog.apply(console, arguments);
			};
		})();
	}
	
	// Check for duplicate blockchain $(event). Must use this for watching every event.
	// $(moduleName) is the module that is watching for the event, since these are seperate entities
	// Or else duplicate events will fire on block re-synch
	checkForDuplicateEvent(event, moduleName) {
		
		// If the event is from a new block number, reset everything, it's all fresh!
		// ... or if there are no events stored for that module yet
		if(this.recentEvents[moduleName] == undefined || event.blockNumber > this.currBlockNum[moduleName]) {
			this.recentEvents[moduleName] = [];
			this.currBlockNum[moduleName] = event.blockNumber;
		}
		
		// First check if it's a duplicate
		var duplicate = false;
		for(var i = 0; i < this.recentEvents[moduleName].length; i++) 
			if(event.logIndex == this.recentEvents[moduleName][i].logIndex) {
				duplicate = true;
				break;
			}
		
		// Then add it to the list of events
		this.recentEvents[moduleName].push(event);
		
		return duplicate;
		
	}
	
	// Wait for MetaMask account to be set before executing function $(func) to fill $(display)
	// $(myself) is the $(this) variable of $(func)
	waitMetaMask(func, display, myself) {
		
		// Wait until MetaMask account is set
		var accountInterval = setInterval(function() {
				if (web3.eth.accounts[0] !== undefined) {
					func(display, myself);
					clearInterval(accountInterval);
				}
			}
			,100);
	}

}

