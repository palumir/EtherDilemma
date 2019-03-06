<?php

// UI for Dilemma (buttons, inventories, etc.)
class DilemmaUI {

	// Constructor
	function __construct() {
		
		// Include the Javascript required globally
		echo "<script src='../../../ethereum/web3/dist/web3.min.js'></script>
			  <script src='//cdn.datatables.net/1.10.16/js/jquery.dataTables.min.js'></script>
			  <script src='../../../ethereum/DilemmaUI/constants/ContractStatics.js'></script>
			  <script src='../../../ethereum/DilemmaUI/constants/EtherScanAPI.js'></script>
			  <script src='../../../ethereum/DilemmaUI/helpers/Cookies.js'></script>
			  <script src='../../../ethereum/DilemmaUI/helpers/Strings.js'></script>
			  <script src='../../../ethereum/DilemmaUI/helpers/BlockChainHelpers.js'></script>
			  <script src='../../../ethereum/DilemmaUI/DilemmaUI.js'></script>";
		
		// Initialize the JS for $(web3) and $(dilemmaUI) variables
		echo '<script>
		
			window.web3 = new Web3(web3.currentProvider)		
				
	 
		// Is Metamask installed?
		if (typeof window.web3 !== "undefined") {

			// Create dilemmaUI global
			var dilemmaUI = new DilemmaUI(window.web3);
			
		} 
		else {
			
			// Create dilemmaUI global
			var dilemmaUI = false;
		}
		
		</script>';
	}
}



?>