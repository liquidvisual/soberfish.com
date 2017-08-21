/*
    GAME-NEW.JS - Last updated: 21.08.17
*/
//-----------------------------------------------------------------
// JOIN GAME BUTTON (LOBBY)
//-----------------------------------------------------------------

$('[data-join-game]').click(function(){
    showScreen('join');
    console.log('viola');
});

//-----------------------------------------------------------------
// NEW GAME BUTTON (LOBBY)
//-----------------------------------------------------------------

$('[data-new-game]').click(function(){

    //-----------------------------------------------------------------
    // VARIABLES
    //-----------------------------------------------------------------

    var PLAYER_ID = localStorage.getItem("playerID");

    //-----------------------------------------------------------------
    // Show Loading
    //-----------------------------------------------------------------

    showLoading(true);

    //-----------------------------------------------------------------
    // CHECK LOCAL STORAGE FOR EXISTING SESSION KEY
    //-----------------------------------------------------------------

    if (PLAYER_ID) {

        showScreen('new');

        $('[data-passcode]').text(PLAYER_ID); // Show it

        //-----------------------------------------------------------------
        // ELSE - GET ROOM ID
        // ANCHOR BUTTON REDIRECTS TO /READY/ (NO CODE)
        //-----------------------------------------------------------------

        } else {

            var jqxhr = $.get('http://www.liquidvisual.net/soberfish.com/php/room_create.php')
            .done(
                function(data) {

                    //==================================================
                    // Store locally to prevent spamming multiple rooms
                    // Use player ID to match up to room and who you are
                    //==================================================

                    var playerID = data;
                    var roomID = getRoomID(playerID);
                    localStorage.setItem("playerID", playerID); // Store it
                    // localStorage.setItem("roomID", roomID); // Store it (?) // NOTE: Don't store it, we get this from the player ID
                    $('[data-passcode]').text(roomID); // Show it
                    showScreen('new');
                })
            .fail(
                function(data) {
                    console.log('Status: error: '+data);
                    alert('There was an error, idiot.')
            });
        }
});

//-----------------------------------------------------------------
// getRoomID
//-----------------------------------------------------------------

function getRoomID(playerID) {
    var roomID = playerID.split('-').pop();
    return roomID;
}

//-----------------------------------------------------------------
// NEW GAME BACK BUTTON (CLEAR)
//-----------------------------------------------------------------

$('[data-clear-room-id]').click(function(event){
    localStorage.removeItem("playerID");
    showScreen('lobby');
});

//-----------------------------------------------------------------
// showLoading
//-----------------------------------------------------------------

function showLoading(bool) {
    bool ? $('html').removeClass('has-loaded') : $('html').addClass('has-loaded');
}

//-----------------------------------------------------------------
// GOTO
//-----------------------------------------------------------------

function showScreen(target) {

    var $lobby         = $('#sb-lobby');
    var $lobbyNewGame  = $('#sb-lobby-new-game');
    var $lobbyJoinGame = $('#sb-lobby-join-game');

    if (target == 'lobby') {
        $lobby.attr('hidden', false);
        $lobbyNewGame.attr('hidden', true);
        $lobbyJoinGame.attr('hidden', true);
    }

    else if (target == 'new') {
        $lobby.attr('hidden', true);
        $lobbyNewGame.attr('hidden', false);
        $lobbyJoinGame.attr('hidden', true);
    }

    else if (target == 'join') {
        $lobby.attr('hidden', true);
        $lobbyNewGame.attr('hidden', true);
        $lobbyJoinGame.attr('hidden', false);
    }

    showLoading(false);
}

//==================================================
//
//==================================================