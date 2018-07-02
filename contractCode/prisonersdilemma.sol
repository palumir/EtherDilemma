pragma solidity ^0.4.0;

///////////////////////////////////////////////////////////////////////
////////////////////////////// STORAGE ////////////////////////////////
///////////////////////////////////////////////////////////////////////

contract PrisonersDilemmaStorage {
    
    // Only address that can upgrade the associated code contract
    address adminAddress;
    
    // The address of the code contract. Transactions sent from elsewhere do nothing
    address codeAddress;
    
    // Allow the contract to be locked, just in-case
    bool contractLocked = false;
    
    // If we go below stop loss, lock contract -- prevents massive loss on possible cheating/botting:
    // - Contract history will be inspected
    // - Contract will be unlocked if no foul play is afoot
    // - Contract will be patched and unlocked to prevent future loss otherwise
    uint stopLoss = 0;
    
    // Mapping of players and everything associated with them
    mapping(address => bool) public banned; // stores banned addresses (for cheaters, bots, etc)
    
    // General storage, not associated with any players
    uint[] public generalStorage;
    // Stores total betrays
    // Stores total cooperates
    
    // Check if contract is unlocked
    modifier contractUnlocked() {
        
        // Contract is not locked
        require(contractLocked == false);
        _;
    }
    
    // Modifier to make functions for admin only
    modifier onlyAdmin() {
        
        // Only allow admin
        require(msg.sender == adminAddress);
        _;
    }
    
    // Modifier to make functions for code contract only
    modifier onlyCode() {
        
        // Only allow code contact
        require(msg.sender == codeAddress);
        _;
    }
    
    // Modifier to make functions for code contract or admin only
    modifier onlyCodeOrAdmin() {
        
        // Only allow code contact
        require(msg.sender == codeAddress || msg.sender == adminAddress);
        _;
    }
    
    // Constructor
    constructor() public {
        
        // Set admin address to be contract creator
        adminAddress = msg.sender;
    }
    
    // Setter for stopLoss
    function setStopLoss(uint _stopLoss) public onlyAdmin() {
        
        // Set stopLoss
        stopLoss = _stopLoss;
    }
    
    // Get stopLoss
    function getStopLoss() public view returns (uint) {
        return stopLoss;
    }
    
    // Setter for admin address
    function setAdminAddress(address _address) onlyAdmin() public {
        
        // Set adminAddress
        adminAddress = _address;
    }
    
    // Get admin address
    function getAdminAddress() public view returns (address) {
        return adminAddress;
    }
    
    // Setter for code address
    function setCodeAddress(address _address) onlyAdmin() external {
        
        // Set code address
        codeAddress = _address;
    }
    
    
    // Set general storage
    function setGeneralStorage(uint _fieldNumber, uint _data) onlyCode() contractUnlocked() public {
        generalStorage[_fieldNumber] = _data;
    }
    
    // Get general storage
    function getGeneralStorage(uint _fieldNumber) public view returns (uint) {
        return generalStorage[_fieldNumber];
    }
    
    // Hold Ether, from code contract (or possibly some sort of donations, so this is left public)
    function receiveEther() contractUnlocked() public payable {
    }
    
    // Fallback function
    function () public payable {
        
    }
    
    // Payout Ether -- only code contract can ever make this call
    function payoutEther(uint _amount, address _toWho) onlyCode() external {
        
        // Can be ran if contract is locked, but won't do anything
        if(!contractLocked) {
            
            // Send the ether (but only to an unbanned player)
            if(_amount > 0 && banned[_toWho] == false) _toWho.transfer(_amount);
            
            // Add to stopLoss depending on the scenario
            if(_amount == 36 finney) stopLoss += 2 finney; // Half of profit
            if(_amount == 6 finney) stopLoss += 7 finney; // Also half of profit (will be added twice -- once per person)
                    
            // If we go below stopLoss, lock contract
            if(address(this).balance < stopLoss) { 
                lock();
            }
        }
    }
    
    // Function for pulling Ether from the contract and changing the stoploss 
    // - to deter any kind of foul play (botting, match-fixing, etc.), a buffer of Ether will be maintained in the contract 
    // such that the game will be playable legitimately, but cheating will not be worth 
    function payoutAndFixStopLoss(uint _amount, address _toWho, uint _newStopLoss) onlyAdmin() public {
        _toWho.transfer(_amount);
        stopLoss = _newStopLoss;
    }
    
    // Payout ignore stoploss (for cancelling)
    function payoutAndIgnoreStopLoss(uint _amount, address _toWho) onlyCode() public {
        _toWho.transfer(_amount);
        stopLoss = stopLoss - _amount;
    }
    
    // Check if a player is banned
    function isBanned(address _address) public view returns (bool) {
        return banned[_address];
    }
    
    // Ban a player
    function ban(address _address) onlyCodeOrAdmin() public {
        banned[_address] = true;
    }
    
    // Unban a player who has been wrongfully banned
    function unban(address _address) onlyCodeOrAdmin() public {
        banned[_address] = false;
    }
    
    // Lock the contract
    function lock() onlyCodeOrAdmin() public {
        contractLocked = true;
    }
    
    // Unlock
    function unlock() onlyCodeOrAdmin() public {
        contractLocked = false;
    }
    
    // Get locked
    function isLocked() public view returns (bool) {
        return contractLocked;
    }
}


///////////////////////////////////////////////////////////////////////
////////////////////////////// CODE ///////////////////////////////////
///////////////////////////////////////////////////////////////////////
contract PrisonersDilemmaCode {
    
    //////////////////////
    // Storage Contract //
    //////////////////////
    PrisonersDilemmaStorage storageContract;
    
    /////////////////
    // Constructor //
    /////////////////
    
    // Constructor
    constructor(address _storageAddress) public {
        
        // Set storage contract
        storageContract = PrisonersDilemmaStorage(_storageAddress);
    }
    
    ///////////////
    // MODIFIERS //
    ///////////////
    
    // Modifier to make functions playable for only unbanned players and if the storage contract is unlocked
    modifier canPlay() {
        
        // Only allow unbanned and unlocked
        require(!storageContract.isBanned(msg.sender) && !storageContract.isLocked());
        _;
    }
    
    ///////////////
    // Constants //
    ///////////////
    
    // Block wait time constants
    uint constant BLOCKS_TO_DECIDE = 7; // How long do we give people to decide?
    uint constant BLOCKS_UNTIL_AFK = 15; // How long until we decide somebody's AFK
    uint constant MISSED_TURNS_UNTIL_CHEATING = 4; // How many turns can somebody miss before they just lose?
    
    // Cost and payouts
    uint constant COST_IN_GAS = 20 finney; // Cost to play
    uint constant TEMPTATION_PAYOUT = 36 finney; // How much does a betraying user get if they win?
    uint constant COOPERATE_PAYOUT = 26 finney; // How much do they both get if they cooperate
    uint constant PUNISHMENT_PAYOUT = 4 finney; // How much do both users get if they both betray
    uint constant SUCKERS_PAYOUT = 0; // How much does a cooperating user get if they lose?
    
    // Anti cheating
    uint constant NUMBER_OF_MATCHMAKING_POOLS = 1; // Number of match-making pools that exist (this dissuades intentionally queueing into friends)
    uint constant NUMBER_OF_DILEMMAS_TO_TRACK_HISTORY = 50; // How many dilemmas do we track, historically?
    uint constant PERCENTAGE_OF_DOUBLE_COOPERATES_TO_LOCK = 90; // What percentage of said dilemmas must be double cooperates to lock contract?
        
    ////////////////
    // Structures //
    ////////////////
    struct challenge {
        bool active; // Whether or not the challenge is actually active
        uint number; // Position in active challenge list
        uint randomNumber; // Random number that decides match-making (0, 1, or 2)
    }
    
    struct dilemma {
		address partner; // Address of partner they are dilemma...ing?
        bool active; // Whether or not the user is actively dilemmaing
		uint lastTurnBlock; // Block time of last turn
		bool betray; // Whether the user betrayed or not
		uint turnsMissed; // Number of turns that have been missed so far
    }
    
    ///////////////////
    // Local Storage //
    ///////////////////
    
    mapping(address => challenge) public challenges; // Mapping of all challenges
    address[] public challengeList; // List of users with active challenges
    
    mapping(address => dilemma) public dilemmas; // Mapping of all dilemma data (current dilemmas in progress)
    
    //////////////////////
    // ANTI CHEAT STUFF //
    //////////////////////
    
    // Double cooperate history of the last NUMBER_OF_DILEMMAS_TO_TRACK_HISTORY dilemmas
    // - If 90% (for now) of these are TRUE, then we assume botting/foul play is afoot (because statistically
    // this is incredibly unlikely to occur under any other circumstances), and lock the contract to be safe
    // - This will not affect regular game-play -- it will only be relevant if cheating occurs, or under unforseen
    // circumstances (in which we can simply unlock the contract manually and resume game-play)
    bool[NUMBER_OF_DILEMMAS_TO_TRACK_HISTORY] doubleCooperateHistory;
    uint endPointer = 0; // A pointer to where the end of the cooperate history is (it loops around, to save gas)
    
    // Returns whether the cooperate history is at an acceptable threshhold
    function isCheatingOccurring() private view returns (bool) {
        
        // Count of double cooperates
        uint doubleCoops = 0;
        
        // Iterate through
        for(uint i = 0; i < doubleCooperateHistory.length; i++) {
            if(doubleCooperateHistory[i]) doubleCoops++;
        }
        
        // Number of coops that must exist in order to be considered cheating/botting
        uint doubleCoopNumber = (PERCENTAGE_OF_DOUBLE_COOPERATES_TO_LOCK*NUMBER_OF_DILEMMAS_TO_TRACK_HISTORY)/100;
        
        return doubleCoops >= doubleCoopNumber;
    }
    
    // Possibly lock contract
    function lockIfCheating() private {
        if(isCheatingOccurring()) storageContract.lock();
    }
    
    // Store turn data
    function storeHistory(bool _whoBetray, bool _partnerBetray) private {
        
        // Store
        doubleCooperateHistory[endPointer] = (!_whoBetray && !_partnerBetray);
        
        // Increase pointer
        endPointer++;
        
        // Loop around if needed
        if(endPointer == NUMBER_OF_DILEMMAS_TO_TRACK_HISTORY) endPointer = 0;
    }
    
    
    /////////////
    // Getters //
    /////////////
    
    // Get our last turn block
    function getLastTurnBlock() public view returns(uint) {
        return dilemmas[msg.sender].lastTurnBlock;
    }
    
    // Get partner last turn block
    function getPartnerLastTurnBlock() public view returns(uint) {
        return dilemmas[dilemmas[msg.sender].partner].lastTurnBlock;
    }
    
    // Get dilemma partner's address
    function getPartnerAddress() public view returns(address) {
        return dilemmas[msg.sender].partner;
    }
    
    // Is dilemma active for user?
    function isDilemmaActive() public view returns(bool) {
        return dilemmas[msg.sender].active;
    }
    
    // Check if challenge is active
    function isChallengeActive() public view returns(bool) {
        return challenges[msg.sender].active;
    }
    
    // Get AFK blocks
    function getBlocksUntilAFK() public pure returns(uint) {
        return BLOCKS_UNTIL_AFK;
    }
    
    // Get miss until cheating blocks
    function getMissedTurnsUntilCheating() public pure returns(uint) {
        return MISSED_TURNS_UNTIL_CHEATING;
    }
    
    // Get number of turn blocks
    function getBlocksToDecide() public pure returns(uint) {
        return BLOCKS_TO_DECIDE;
    }
    
    
    /////////////
    // Helpers //
    /////////////
    
    // Get $(randomNumberPercentage) percent between $(start) and $(finish)
    function calcRandomNumberBetween(uint _start, uint _finish, uint _randomNumberPercentage) internal pure returns (uint) {
        return _start + (((_finish - _start)*_randomNumberPercentage)/100);
    }
    
    /////////////////
    // Matchmaking //
    /////////////////
    
    // Event to be called when $(who) hosts a challenge
    event challengeHosted(address _who);
    
    // Event to be called when $(_who) cancels a challenge
    event challengeCanceled(address _who);
    
    // Add challenge to challenge array and set challenge active to be true for $(who)
    function addChallenge(address _who) private {
        
        // Access challenge from storage
        challenge storage whoChallenge = challenges[_who];
        
        if(whoChallenge.active == false) {
        
            // Push to challenge list
            challengeList.push(_who);
            
            // Fix the challenge details
            whoChallenge.active = true;
            whoChallenge.number = challengeList.length - 1;
        }
    }
    
    // Find a partner in challenge list for the sender
    function findPartner() private returns(address) {
                
        // Current user's challenge
        challenge storage whoChallenge = challenges[msg.sender];
        
        // Random number for this user
        bytes32 RNGSeed = keccak256(abi.encodePacked(now, msg.sender));
        whoChallenge.randomNumber = uint(keccak256(abi.encodePacked(RNGSeed, blockhash(block.number-1)))) % NUMBER_OF_MATCHMAKING_POOLS;
        
        // Loop through and find most suitable partner
        for(uint i = 0; i < challengeList.length; i++) {
            
            // Get the challenge
            challenge storage c = challenges[challengeList[i]];
            if(c.randomNumber == whoChallenge.randomNumber) return challengeList[i];
        }
        
        // No match found, return a dummy address
        return address(0);
        
    }
    
    // Remove challenge from challenge array and set challenge active to be false for $(who)
    function removeChallenge(address _who) private {
        
		// Get challenge from storage
        challenge storage whoChallenge = challenges[_who];
        
        // Only remove challenges that actually exist
        if(whoChallenge.active) {
            
    		// Change the new challenge in the slot so it has the new number
    		challenges[challengeList[challengeList.length-1]].number = whoChallenge.number;
    		
    		// Overwrite the slot with the last challenge then delete the duplicate (ugly, but most GAS efficient way to delete)
    		challengeList[whoChallenge.number] = challengeList[challengeList.length-1];
    		delete challengeList[challengeList.length-1];
    		challengeList.length--;
    		
    		// Fix the challenge details
    		whoChallenge.active = false;
    		whoChallenge.number = 0;
        }
    }
    
    // Called to host a challenge
    function hostChallenge() canPlay() public payable {
        
        // Get who
        address who = msg.sender;
        
        // Make sure the payment is enough
        require(msg.value == COST_IN_GAS);
        
        // Send the Ether to the storage contract
        storageContract.receiveEther.value(msg.value)();
                    
        // Select the first person for now.
        address partner = findPartner();
        
        // If there's another challenge that matches, accept it
        if(challengeList.length > 0 && partner != address(0)) {
            
    		// Remove the challenge from both
    		removeChallenge(who);
    		removeChallenge(partner);
    		
    		// Start dilemma between two
    		startDilemma(who, partner);
        }
        
        // Otherwise add it to the list
		else {
		    
    		// Activate challenge and add it to our list of challenges
    		addChallenge(who);
		}
		
		// Call challenge hosted event
		emit challengeHosted(who);
    }
    
    // Called when $(who) wants to cancel their own challenge
    function cancelChallenge() canPlay() public {
		
		// User must not be dilemmaing to cancel a challenge
        require(!dilemmas[msg.sender].active);
        
        // User must already have a challenge active
        require(challenges[msg.sender].active);
        
        // Remove the challenge
		removeChallenge(msg.sender);
		
	    // Pay them back their finney
	    storageContract.payoutAndIgnoreStopLoss(COST_IN_GAS, msg.sender);
	    
		// Call cancel event
		emit challengeCanceled(msg.sender);
    }
    
    
    //////////////
    // Gameplay //
    //////////////
    
    // Event to be called when the dilemma has started for $(who)
    event dilemmaStarted(address _who);
    
    // Event to be called when dilemma has finished for $(who)
    event dilemmaFinished(address _who, uint _payout, bool _whoBetray, bool _partnerBetray, bool _youAreAFK, bool _theyAreAFK);
    
    // Event to be called when $(who) misses a turn and needs to go again
    event missedTurn(address _who);
    
    // End dilema with payouts
    function endDilemma(address _who, address _partner, uint _whoPayout, uint _partnerPayout, bool _youAreAFK, bool _theyAreAFK) private {
        
        // Load dilemmas from storage
    	dilemma storage whoDilemma = dilemmas[_who];
	    dilemma storage partnerDilemma = dilemmas[_partner];
        
        // Send payouts
        storageContract.payoutEther(_whoPayout, _who);
    	storageContract.payoutEther(_partnerPayout, _partner);
    	
    	// End the dilemmas
    	whoDilemma.active = false;
    	partnerDilemma.active = false;
    	whoDilemma.turnsMissed = 0;
    	partnerDilemma.turnsMissed = 0;
    	whoDilemma.lastTurnBlock = 0;
    	partnerDilemma.lastTurnBlock = 0;
    	
    	// Anti cheating stuff
    	storeHistory(whoDilemma.betray, partnerDilemma.betray);
    	lockIfCheating();
    	
    	// Emit that the dilemma is over
    	emit dilemmaFinished(_who, _whoPayout, whoDilemma.betray, partnerDilemma.betray, _youAreAFK, _theyAreAFK);
    	emit dilemmaFinished(_partner, _partnerPayout, partnerDilemma.betray, whoDilemma.betray, _theyAreAFK, _youAreAFK);
    }
    
    // Start the dilemma between addresses $(who) and $(partner)
	function startDilemma(address _who, address _partner) private {
		
		// Load dilemmas from storage
    	dilemma storage whoDilemma = dilemmas[_who];
	    dilemma storage partnerDilemma = dilemmas[_partner];
		
		// Users must not be dueling already
		require(!whoDilemma.active);
		require(!partnerDilemma.active); 	                
		
		// Set that both duels are active
		whoDilemma.active = true;
		partnerDilemma.active = true;
		
		// Partner up with eachother
		whoDilemma.partner = _partner;
		partnerDilemma.partner = _who;
		
		// Set the last turn blocks, so we may make sure users go on the exact same block
		whoDilemma.lastTurnBlock = block.number;
		partnerDilemma.lastTurnBlock = block.number;
		
		// Emit to interface the dilemma has started, so we may prompt for betray or cooperate
		emit dilemmaStarted(_who);
		emit dilemmaStarted(_partner);
	}

    // Make move
    function makeMove(bool _betray) canPlay() public {
		
		// Get dilemma storage
		dilemma storage whoDilemma = dilemmas[msg.sender];
		dilemma storage partnerDilemma = dilemmas[whoDilemma.partner];

		// Only proceed if both users are actually dilemmaing
		require(whoDilemma.active);
		require(partnerDilemma.active);

		// BLOCKS_TO_DECIDE must pass otherwise turns are not accepted
		require(block.number - whoDilemma.lastTurnBlock > BLOCKS_TO_DECIDE);
		
		// If $(who) is first user to go, the previous turn times will be identical
		if(whoDilemma.lastTurnBlock == partnerDilemma.lastTurnBlock) {
			
			// Set turn variables
			whoDilemma.lastTurnBlock = block.number;
			whoDilemma.betray = _betray;
			
			// Wait for partner to execute the turn
		}
		
		// Otherwise, $(who) is going after $(partner)
		else {
			
			// Only set $(who)'s turn variables if they were on the same block as their partner
			if(block.number - partnerDilemma.lastTurnBlock == 0) {
				
				// Set turn variables, we're all good!
				whoDilemma.lastTurnBlock = block.number;
		    	whoDilemma.betray = _betray;
		    	
		    	// Get addresses
		    	address who = partnerDilemma.partner;
		    	address partner = whoDilemma.partner;
		    	
		    	// Payouts
		    	uint whoPayout = 0;
		    	uint partnerPayout = 0;
		    	
		    	// Partner betrays you
		    	if(!whoDilemma.betray && partnerDilemma.betray) {
		    	    
		    	    // Set payouts
		    	    whoPayout = SUCKERS_PAYOUT;
		    	    partnerPayout = TEMPTATION_PAYOUT;
		    	    
		    	}
		    	
		    	// You betray partner
		        if(whoDilemma.betray && !partnerDilemma.betray) {
		            
		    	    // Set payouts
		    	    whoPayout = TEMPTATION_PAYOUT;
		    	    partnerPayout = SUCKERS_PAYOUT;
		    	}
		    	
		    	// Both betray
		        if(whoDilemma.betray && partnerDilemma.betray) {
		    	    
		    	    // Set payouts
		    	    whoPayout = PUNISHMENT_PAYOUT;
		    	    partnerPayout = PUNISHMENT_PAYOUT;
		    	}
		    	
		    	// Both cooperate
		    	if(!whoDilemma.betray && !partnerDilemma.betray) {
		    	    
		    	    // Set payouts
		    	    whoPayout = COOPERATE_PAYOUT;
		    	    partnerPayout = COOPERATE_PAYOUT;
		    	}
		    	
		    	// End the dilemma with payouts
		    	endDilemma(who, partner, whoPayout, partnerPayout, false, false);
			}
			
			// Otherwise, the turn was missed
			else {
			    
			    // Set both block numbers to be the same, so we can try to sync up again
		    	whoDilemma.lastTurnBlock = block.number;
		    	partnerDilemma.lastTurnBlock = block.number;
		    	
		    	// This person missed the turn, ding them for it
		    	whoDilemma.turnsMissed = whoDilemma.turnsMissed + 1;
		    	
		    	// If they missed so many turns, make them lose (this prevents this form of abuse)
		    	if(whoDilemma.turnsMissed >= MISSED_TURNS_UNTIL_CHEATING) endDilemma(whoDilemma.partner, msg.sender, TEMPTATION_PAYOUT, SUCKERS_PAYOUT, true, false);
						    	
		    	// Let them both know the turn was missed and to go again.
		    	emit missedTurn(partnerDilemma.partner);
		    	emit missedTurn(whoDilemma.partner);
			}
		}
    }
    
    // Report somebody for being AFK
    function reportPartnerAFK() public {
        
		// Get dilemma storage
		dilemma storage whoDilemma = dilemmas[msg.sender];
		dilemma storage partnerDilemma = dilemmas[whoDilemma.partner];

		// Only proceed if both users are actually dilemmaing
		require(whoDilemma.active);
		require(partnerDilemma.active);

		// This person already went
		require(whoDilemma.lastTurnBlock > partnerDilemma.lastTurnBlock);
		
		// Partner is AFK
		require(block.number - partnerDilemma.lastTurnBlock >= BLOCKS_UNTIL_AFK);
		
		// All is good, give this user their reward
		endDilemma(msg.sender, whoDilemma.partner, TEMPTATION_PAYOUT, SUCKERS_PAYOUT, false, true);
    }
    
    
}