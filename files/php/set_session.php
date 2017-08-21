<?php

	session_start();

	//----------------------------------------------
	// Cross Domain
	// http://stackoverflow.com/questions/10143093/origin-is-not-allowed-by-access-control-allow-origin
	//----------------------------------------------

	header('Access-Control-Allow-Origin: *');
	//header('Content-Type: application/json');



	$_SESSION["room_id"] = 'rand-'.mt_rand(100000, 999999);;

	echo $_SESSION["room_id"];


?>