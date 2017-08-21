<?php

	// session_start();

	//----------------------------------------------
	// Cross Domain
	// http://stackoverflow.com/questions/10143093/origin-is-not-allowed-by-access-control-allow-origin
	//----------------------------------------------

	header('Access-Control-Allow-Origin: *');
	// header('Content-Type: application/json'); // important

	//----------------------------------------------
	// VARIABLES
	//----------------------------------------------

	$player_id = $_GET['playerID'];
	$card_id   = $_GET['cardID'];

	//----------------------------------------------
	// CHECK FOR SESSION DATA
	//----------------------------------------------

	if (isset($player_id)) {

		$room_id_arr = explode('-', $player_id);
		$room_id = end($room_id_arr);

		$filename = "rooms/$room_id.json";

		//==============================================
		// IF ROOM EXISTS: OPEN AND DECODE ROOM JSON
		//==============================================

		if (file_exists($filename)) {

			$room_json_str = file_get_contents($filename);
			$room_data_arr = json_decode($room_json_str, true);

			array_push($room_data_arr['room']['cards_in_play'], $card_id);
			// $room_data_arr['room']['cards_in_play'][] = $card_id; // shorthand

			$str = json_encode($room_data_arr, JSON_PRETTY_PRINT);
			file_put_contents($filename, $str);

			echo $room_id; //$cards_in_play_arr;

		//==============================================
		// EXIT IF NO ROOM EXISTS
		//==============================================

		} else {
			die("Error: that room doesnt exist");
		}

	//----------------------------------------------
	// NEEDS ROOM_ID IN SESSION DATA TO CONTINUE
	//----------------------------------------------

	} else {
		die("Error: no player data");
	}

//--
?>