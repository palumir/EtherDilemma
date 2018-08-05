	<?php include('templates/head/head.php'); ?>

	<body>

	<div class="container-full">

		<?php include('templates/header/header.php'); ?>
		
		<?php include('ethereum/DilemmaUI/DilemmaUI.php') ?>
		<?php include('ethereum/DilemmaUI/pages/dilemma/Dilemma.php') ?>
<script>

$.ajax({
    url: 'https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=NIVSKG1ICGAIPM3SJAZG1I3ISMPS395UWS',
    type: 'GET',
    success: function(data){ 
        console.log("fart");
    },
    error: function(data) {
        console.log(data);
    }
});

</script>

</div>
</body>