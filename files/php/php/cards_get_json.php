<?php
	//----------------------------------------------
	// Cross Domain
	// http://stackoverflow.com/questions/10143093/origin-is-not-allowed-by-access-control-allow-origin
	//----------------------------------------------

	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json');

	//----------------------------------------------
	// GET CARD LIBRARY JSON
	//----------------------------------------------

	$cards_json_str   = file_get_contents('cards.json');
	echo $cards_json_str;
?>