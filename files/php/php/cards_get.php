<?php
	//----------------------------------------------
	// Cross Domain
	// http://stackoverflow.com/questions/10143093/origin-is-not-allowed-by-access-control-allow-origin
	//----------------------------------------------

	header('Access-Control-Allow-Origin: *');

	//----------------------------------------------
	// GET RANDOM CARDS (QUESTIONS)
	//----------------------------------------------

	function get_random_cards($limit) {

		$cards_json_str  = file_get_contents('cards.json');
		$cards_data_arr  = json_decode($cards_json_str, true);
		$random_cards_arr = [];

		//==============================================
		// 1. store array from red, blue
		//==============================================

		$blue_cards_arr   = get_card_ids($cards_data_arr['blue_cards']['cards']);
		$red_cards_arr    = get_card_ids($cards_data_arr['red_cards']['cards']);
		$green_cards_arr  = get_card_ids($cards_data_arr['green_cards']['cards']);
		$orange_cards_arr = get_card_ids($cards_data_arr['orange_cards']['cards']);

		$all_cards_arr = array_merge($blue_cards_arr,
		            			 	 $red_cards_arr,
		            			 	 $green_cards_arr,
		            			 	 $orange_cards_arr);

		//----------------------------------------------
		// REMOVE ANY CARDS IN PLAY OR HELD BY PLAYER
		// http://php.net/manual/en/function.array-diff.php
		//----------------------------------------------

		// $cards_in_play =

		//----------------------------------------------
		// SHUFFLE AND PROCEED
		//----------------------------------------------

		shuffle($all_cards_arr);

		$final_cards_arr = [];

		foreach ($all_cards_arr as $i => $card_id) {
			array_push($final_cards_arr, $card_id);
			if ($i == $limit-1) break; // returns only number of cards requested
		}

		return $final_cards_arr;
	}

	//----------------------------------------------
	// REMOVE CARD IDS IN USE
	// Remove all cards in play + active cards from players
	//http://stackoverflow.com/questions/2448964/php-how-to-remove-specific-element-from-an-array
	//----------------------------------------------

	// function remove_ids_in_use($array) {

	// 	global $cards_data_arr;
	// 	// global $room_data_arr;

	// 	$ids_in_use_arr = $cards_data_arr['room'][]

	// 	// $array_without_cards_in_use = array_diff($array, $ids_in_use_arr);

	// return $array_without_cards_in_use;
	// }

	//----------------------------------------------
	// GET CARD IDS FROM ARRAY (RTN STRING)
	//----------------------------------------------

	function get_card_ids($array) {
		if (!empty($array)) {
			$cards_id_arr = [];
			foreach ($array as $card) {
				array_push($cards_id_arr, $card[id]);
			}
			return $cards_id_arr;
		} else {
			return ['problem', 'with','get','card','ids'];
		}
	}

	//----------------------------------------------
	// GET BLACK CARDS (QUESTIONS)
	//----------------------------------------------

	function get_black_cards($limit) {

		$cards_json_str  = file_get_contents('cards.json');
		$cards_data_arr  = json_decode($cards_json_str, true);
		$random_cards_arr = [];

		//==============================================
		// 1. Get array of black cards - limit 10
		// 2. randomise array
		// 3. limit 10
		//==============================================

		$black_cards_arr = $cards_data_arr['black_cards']['cards'];
		shuffle($black_cards_arr);

		foreach ($black_cards_arr as $i => $black_card) {
			array_push($random_cards_arr, $black_card[id]);

			if ($i == $limit-1) break; // returns only number of cards requested
		}
		return $random_cards_arr;
	}

	//----------------------------------------------
	//
	//----------------------------------------------

	// OLD - keep for reference
	// for ($x = 0; $x <= count($black_cards_arr); $x++) {
	// 	$cards_arr = $black_cards_arr[$x]['id'];
	//     print_r($cards_arr);
	// }

?>