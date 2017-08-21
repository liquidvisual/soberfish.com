<?php

	session_start();

	//----------------------------------------------
	// Cross Domain
	// http://stackoverflow.com/questions/10143093/origin-is-not-allowed-by-access-control-allow-origin
	//----------------------------------------------

	header('Access-Control-Allow-Origin: *');
	// header('Content-Type: application/json');

	//----------------------------------------------
	// GENERATE UNIQUE ROOM KEY
	//----------------------------------------------

	$generated_room_id = mt_rand(100000, 999999);

	//----------------------------------------------
	// CREATE ROOM ARRAY
	//----------------------------------------------

	$new_room_arr = ['room' => [
						'id' => $generated_room_id,
						'host' => '',
						'dealer' => '',
						'questions' => [],
						'cards_in_play' => [],
						'timer' => false,
						'timer_duration' => 6000,
						'players' => []
						]
					];

	//----------------------------------------------
	// PLACE 10 BLACK QUESTIONS CARDS INTO ROOM
	//----------------------------------------------

	include_once 'cards_get.php';
	$new_room_arr['room']['questions'] = get_black_cards(10);

	//----------------------------------------------
	// ENCODE AS STRING
	//----------------------------------------------

	$str = json_encode($new_room_arr, JSON_PRETTY_PRINT);

	//----------------------------------------------
	// WRITE TO JSON
	//----------------------------------------------

	file_put_contents('rooms/'.$generated_room_id.'.json', $str, FILE_APPEND);

	//----------------------------------------------
	// RESET ALL PREVIOUS SESSION VARS
	//----------------------------------------------

	session_unset();

	//----------------------------------------------
	// JOIN ROOM
	//----------------------------------------------

	include 'room_join_by_id.php';
	join_room($generated_room_id);

	exit();
?>