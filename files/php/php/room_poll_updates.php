<?php

	session_start();

	//----------------------------------------------
	// Cross Domain
	// http://stackoverflow.com/questions/10143093/origin-is-not-allowed-by-access-control-allow-origin
	//----------------------------------------------

	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json'); // important

	//----------------------------------------------
	// VARIABLES
	//----------------------------------------------

	$player_id = $_GET["playerID"];

	//----------------------------------------------
	// CHECK FOR SESSION DATA
	//----------------------------------------------

	if (isset($player_id)) {

		$room_id_arr = explode('-', $player_id);
		$room_id = end($room_id_arr);

		$filename = "rooms/$room_id.json";

		if (file_exists($filename)) {

			//==============================================
			// CHECK IF PLAYER EXISTS IN ROOM
			//==============================================
			//==============================================
			// BEGIN POLLING
			//==============================================
			/**
			 * This file is an infinitive loop.
			 * It gets the file data.txt's last-changed timestamp, checks if this is larger than the timestamp of the
			 * AJAX-submitted timestamp (time of last ajax request), and if so, it sends back a JSON with the data from
			 * data.txt (and a timestamp). If not, it waits for one seconds and then start the next while step.
			 *
			 * Note: This returns a JSON, containing the content of data.txt and the timestamp of the last data.txt change.
			 * This timestamp is used by the client's JavaScript for the next request, so THIS server-side script here only
			 * serves new content after the last file change.
			 */

			// set php runtime to unlimited
			set_time_limit(0);

			while (true) {

			    // if ajax request has send a timestamp, then $last_ajax_call = timestamp, else $last_ajax_call = null
			    $last_ajax_call = isset($_GET['timestamp']) ? (int)$_GET['timestamp'] : null;

			    // PHP caches file data, like requesting the size of a file, by default. clearstatcache() clears that cache
			    clearstatcache();

			    // get timestamp of when file has been changed the last time
			    $last_change_in_data_file = filemtime($filename);

			    // if no timestamp delivered via ajax or data.json has been changed SINCE last ajax timestamp
			    if ($last_ajax_call == null || $last_change_in_data_file > $last_ajax_call) {

			        // get content of data.txt
			        $room_json_str = file_get_contents($filename);

			        // put data.txt's content and timestamp of last data.txt change into array
			        $result = array(
			            'data_from_file' => $room_json_str,
			            'timestamp' => $last_change_in_data_file
			        );

			        // encode to JSON, render the result (for AJAX)
			        $json = json_encode($result);
			        echo $json;

			        // leave this loop step
			        break;

			    } else {
			        // wait for 1 sec (not very sexy as this blocks the PHP/Apache process, but that's how it goes)
			        sleep( 1 );
			        continue;
			    }
			}

			//==============================================
			// OPEN AND DECODE ROOM JSON
			//==============================================

			// $room_json_str = file_get_contents($filename);
			// $json = json_encode($room_json_str);

			// echo $json;

			//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
			// START POLLING CODE
			//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>







			//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
			//
			//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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
		die("Error: no session data");
	}

//--
?>