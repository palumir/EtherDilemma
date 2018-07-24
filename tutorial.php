<html lang="en">

	<?php include('templates/head/head.php'); ?>

	<body>

	<div class="container-full">

		<?php include('templates/header/header.php'); ?>
		
		<?php include('ethereum/DilemmaUI/DilemmaUI.php') ?>
		<?php include('ethereum/DilemmaUI/pages/dilemma/Dilemma.php') ?>
		
		<main id="main" role="main" class="FAQ container-full col-sm-10">
		<a href='/index.php'><img class='etherDilemma' src='images/logo.png'></a>

<div class='col-sm-8 tutorial'>
		
<p dir="ltr"><h1>TUTORIAL</h1></p>


<ol type='a' start="1">
	<li dir="ltr">
	<p dir="ltr">You must have MetaMask installed and setup in order to play. Click <a href="http://metamask.io">here</a> to install MetaMask. Click <a href="https://blog.ujomusic.com/how-to-buy-eth-using-metamask-coinbase-ecffe9ede78e">here</a> for a guide on setting up MetaMask and adding ETH to your wallet. </p>
	</li>
</ol>


<ol type='a' start="2">
	<li dir="ltr">
	<p dir="ltr">Click PLAY to begin searching for an opponent. MetaMask will automatically pop up:</p>

	<ol>
		<li dir="ltr">
		<div dir="ltr">The Gas Price should default to a value greater than 0. If Gas Price is set to 0, enter a 1 in the box.</div>
		</li>
		<br>
		<li dir="ltr">
		<div dir="ltr">Click ‘Submit’ </div>
		<br>
		</li>
	</ol>
	</li>
</ol>
		<img src="https://lh4.googleusercontent.com/mljX_BENvaJwHA10dVp1u6CYw67kxI3vGscMB2zBPG8GMhol-JUxHUDRAoNTwvvAJGmtfHPFodty52Xzu8CtIS7S5XW1WS9zViDLMOed87vtng4kOF8cWQaMVTWLw9iTkWTGr3MR" style="height:364px; width:329px; margin-left: auto;
    margin-right: auto;
    display: block;
	margin-bottom: 20px;" />

<ol type='a' start="3">
	<li dir="ltr">
	<p dir="ltr">Opponent found! Your dilemma has begun…</p>
	<ol>
	<li dir="ltr">
	<div dir="ltr">You have until the block countdown is over to lock in your decision - <div class='allyUnderline'>ally</div>, <div class='betrayUnderline'>betray</div>, or <div class='callUnderline'>call</div>. Until the countdown finishes, you are free to change your decision. The countdown varies based on the blockchain, but will take approximately 30-45 seconds. </div>
	<br>
	</li>
	<li dir="ltr">
	<div dir="ltr">Negotiate with your opponent! If you both <div class='allyUnderline'>ally</div>, you both win. If you <div class='callUnderline'>call</div> somebody's <div class='betrayUnderline'>betray</div>, you win. If you <div class='betrayUnderline'>betray</div> an <div class='allyUnderline'>ally</div>, you win a lot. Utilize the chat box to strategize or deceive your opponent. </div>
	<br>
	</li>
	<li dir="ltr">
	<div dir="ltr">Lock in your decision. Your choice is highlighted. Note: Once the block countdown is over, you will not be able to change your decision.</div>
	<br>
	</li>
	<li dir="ltr">
	<div dir="ltr">Once the block countdown is over, MetaMask will automatically pop up. You must accept the transaction immediately or risk forfeiting the dilemma. </div>
	</li>
	</ol>
	</li>
</ol>

<ol type='a' start="4">
	<li dir="ltr">
	<p dir="ltr">The result! Once both played have locked in their decision and the transactions are accepted on the blockchain, you will see the result. </p>
	</li>
</ol>

<ol type='a' start="5">
	<li dir="ltr">
	<p dir="ltr">You can then play again, or click the EtherDilemma logo to return to the homepage. Click <a href='/'>here</a> to return to the homepage and start playing some EtherDilemma! </p>
	</li>
</ol>
<br>
<p dir="ltr"><strong>Note: If you or your opponent fail to accept the transaction in MetaMask, or become unresponsive for 5 consecutive turns, the unresponsive player can be reported AFK by their opponent… thus forfeiting the dilemma. </strong></p>
	

</div>
		</main>
		
		<?php include('templates/footer/footer.php'); ?>

	</div>

	</body>
</html>


