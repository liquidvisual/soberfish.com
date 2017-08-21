<?php

	session_start();

	//----------------------------------------------
	// Cross Domain
	// http://stackoverflow.com/questions/10143093/origin-is-not-allowed-by-access-control-allow-origin
	//----------------------------------------------

	header('Access-Control-Allow-Origin: *');
	//header('Content-Type: application/json');

	echo 'session: '.$_SESSION["room_id"];


?>