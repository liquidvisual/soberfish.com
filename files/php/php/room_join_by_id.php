<?php

	session_start();

	//----------------------------------------------
	// Cross Domain
	// http://stackoverflow.com/questions/10143093/origin-is-not-allowed-by-access-control-allow-origin
	//----------------------------------------------

	header('Access-Control-Allow-Origin: *');
	//header('Content-Type: application/json');

	//----------------------------------------------
	// VARIABLES
	//----------------------------------------------

	$room_id = $_GET['roomID']; // change to POST !!!

	//----------------------------------------------
	// POST VAR OR ARGUMENT SENT VIA ROOM_CREATE?
	// BOTH JOIN AND ROOM CREATE PASS THROUGH THIS
	//
	// 1. POST: stores info and returns
	// 2. ARGUMENT: returns info only
	//----------------------------------------------

	if (isset($room_id)) join_room($room_id);

	//----------------------------------------------
	// JOIN ROOM
	//----------------------------------------------

	function join_room($unique_room_id) {

		$filename = "rooms/$unique_room_id.json";

		if (file_exists($filename)) {

			//==============================================
			// OPEN AND DECODE ROOM JSON
			//==============================================

			$room_json_str = file_get_contents($filename);
			$room_data_arr = json_decode($room_json_str, true);

			//==============================================
			// DETERMINE PLAYER COUNT, ASSIGN THEN STORE
			// IN SESSION VAR TO PREVENT DOUBLE UPS
			//==============================================

			$player_count = count($room_data_arr['room']['players']) + 1;

			//==============================================
			// CREATING PLAYER FOR FIRST TIME
			// ONLY DO ONCE
			//==============================================

			// !$_SESSION["room_id"] == $unique_room_id

			if (true) {

				//==============================================
				// PUSH PLAYER INTO 'PLAYERS' ARRAY
				//==============================================

				$player_id = $player_count.'-'.mt_rand(100000, 999999).'-'.$unique_room_id;

				$new_player = [
								'id' => $player_id,
								'name' => 'P'.$player_count,
								'cash' => '0',
								'cards_active' => [],
								'cards_won' => [],
								'cards_rejected' => []
							];

				include_once 'cards_get.php';

				// DEAL CARDS
				$new_player['cards_active'] = get_random_cards(18);

				array_push($room_data_arr['room']['players'], $new_player);

				//==============================================
				// ASSIGN HOST
				//==============================================

				if ($player_count == 1) {
					$room_data_arr['room']['host']   = $player_id;
					$room_data_arr['room']['dealer'] = $player_id;
				}

				//==============================================
				// SET PLAYER CARDS
				//==============================================
				//==============================================
				// RE-ENCODE AND SAVE BACK TO FILE
				//==============================================

				$str = json_encode($room_data_arr, JSON_PRETTY_PRINT);
				file_put_contents($filename, $str);

				//==============================================
				// STORE IDS IN SESSION
				//==============================================

				// $_SESSION["room_id"] = $unique_room_id; // take this from the above (refactor)
				//$_SESSION["player_name--$unique_room_id"] = 'P'.$player_count;

				// die($str);

				die($new_player['id']);

			//==============================================
			// DON'T SAVE TWICE IF THEY ALREADY EXIST IN ROOM
			//==============================================

			} else {
				$str = json_encode($room_data_arr, JSON_PRETTY_PRINT);
				die($str);
			}

		//==============================================
		// EXIT IF NO ROOM EXISTS
		//==============================================

		} else {
			die("That room doesnt exist!");
		}
	}

	// foreach ($room_data_arr['room']['players'] as $i => $player) {
	// 	if ($player == 'P'.$player_count) {
	// 		$str = json_encode($room_data_arr, JSON_PRETTY_PRINT);
	// 		die($str);
	// 	}
	// }

?>