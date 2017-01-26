/*
    GAME-JOIN.JS - Last updated: 24.01.17
*/
//-----------------------------------------------------------------
//
//-----------------------------------------------------------------

;(function($) {
    'use strict';

    //-----------------------------------------------------------------
    // VARIABLES
    //-----------------------------------------------------------------

    var passcode = '';
    var passcodeLocked = false;

    //-----------------------------------------------------------------
    // CLEAR NUMBERS
    //-----------------------------------------------------------------

    $('[data-number-pad-clear]').click(function(){
        passcode = "";
        $('[data-join-passcode]').text(passcode);
    });

    //-----------------------------------------------------------------
    // DIAL IN SESSION KEY
    //-----------------------------------------------------------------

    $('[data-number-pad] .btn').click(function(){

        if (!passcodeLocked) {
            passcode += $(this).val();
            $('[data-join-passcode]').text(passcode);
        }

        //==================================================
        // VERIFY KEY WITH SERVER
        //==================================================

        if (passcode.length == 6 && !passcodeLocked) {
            passcodeLocked = true; // Lock it for safety
            $('html').removeClass('has-loaded');
            verifyRoomID(passcode);
        }
    });

    //-----------------------------------------------------------------
    // VERIFY ROOM ID
    //-----------------------------------------------------------------

    function verifyRoomID(roomID) {

        var jqxhr = $.get('http://www.liquidvisual.net/soberfish.com/php/room_join_by_id.php', { roomID: roomID })
        .done(
            function(data) {

                //==================================================
                // IF NO SESSION EXISTS RESET
                //==================================================

                if (data == 'That room doesnt exist!') {
                    passcode = '';
                    passcodeLocked = false; // release lock
                    $('[data-join-passcode]').text('');
                    alert("Session doesn't exist you dummy! Try again.");

                //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                // IF SUCCESS STORE ROOM KEY AND REDIRECT
                //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

                } else if (data) { // add more to make foolproof

                    var playerID = data;
                    var roomID = getRoomID(playerID);
                    localStorage.setItem("playerID", playerID); // Store it
                    window.location.assign("/ready/");
                }

                $('html').addClass('has-loaded');
            })
        .fail(
            function(data) {
                console.log("Status: error: "+data);
                alert('Faaark, you broke it.There was a problem.');
        });
    }

    //-----------------------------------------------------------------
    // getRoomID - utility - redundant
    //-----------------------------------------------------------------

    function getRoomID(playerID) {
        var roomID = playerID.split('-').pop();
        return roomID;
    }

//--
}(jQuery));

//==================================================
//
//==================================================