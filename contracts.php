<html lang="en">

	<?php include('templates/head/head.php'); ?>

	<body>

	<div class="container-full">

		<?php include('templates/header/header.php'); ?>
		
		<?php include('ethereum/DilemmaUI/DilemmaUI.php') ?>
		<?php include('ethereum/DilemmaUI/pages/dilemma/Dilemma.php') ?>
		
		<main id="main" role="main" class="FAQ container-full col-sm-10">
		<a href='/index.php'><img class='etherDilemma' src='images/logo.png'></a>

<div class='col-sm-12'>
<h1>The Smart Contracts</h1>
<p dir="ltr">One of the beauties of the Ethereum blockchain is that everything is public and permanent. Smart contracts cannot be altered once they're live. Hence, the name "smart contract", since they're very reminiscent of legal contracts, because they are permanently bound to the blockchain in their current form.</p>
<p dir="ltr">This is one of the biggest arguments for running games on the Ethereum blockchain (game economies, most notably), because players can see <strong>exactly</strong> how it works. No bullshit.</p>
<p dir="ltr"><a href="https://ropsten.etherscan.io/address/0x4904ea0cf271cba60477871c7591820d3d8776a8#code">Here</a> is a link to our code contract for EtherDilemma, and <a href="https://ropsten.etherscan.io/address/0xf77715d28fe7821377f75695f27433fd187c78dd#code">here</a> is a link to our storage contract for EtherDilemma.</p>
<p dir="ltr">Some notable features of our smart contracts include:</p>
<ol>
<li><p>Core gameplay mechanics: random matchmaking followed by an option to ally, betray or call your opponent on the exact same block. Any early or improper calls to the blockchain will be ignored. Late calls to the blockchain will count as a miss. Same-block timing is compelled by the website front-end.</p></li>
<li><p>Seperation of code and storage contracts. So if any bugs, inefficiencies, or imbalances in gameplay mechanics are spotted going forward, we can fix these issues without affecting the uptime of the game or any of the secure back-end storage for the game.</p></li>
<li><p>Automatic contract locking activated automatically via abuse/bot/malicious behavior detecting mechanisms. Contracts can be easily unlocked by the admin address once issues are resolved via a code contract update.</p></li>
<li><p>AFK (away from keyboard) detection and report feature -- necessary because the blockchain will only run code per transaction, so nothing can automatically remove a player who has gone AFK. Hence, a report feature must exist in any game where two or more player actions are important to one and other.</p></li>
<li><p>Blockchain events triggered on every important gameplay action -- so everything that has ever been done and will ever be done in the game will be publicly accessible event data on the blockchain. Which means there's a lot of really cool stats anybody can pull from EtherDilemma. This is one of the big reasons that we built EtherDilemma on Ethereum, because gathering interesting statistics is typically the <strong>sole</strong> purpose of <a href='https://en.wikipedia.org/wiki/Prisoner%27s_dilemma'>Prisoner's Dilemma</a> experiments.</p></li>
</ol>

</div>
		</main>
		
		<?php include('templates/footer/footer.php'); ?>

	</div>

	</body>
</html>


