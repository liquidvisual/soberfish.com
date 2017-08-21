/*
    READY.JS - Last updated: 25.01.17
*/
//-----------------------------------------------------------------
// VARIABLES
//-----------------------------------------------------------------

var PLAYER_ID = localStorage.getItem("playerID");
var CARDS_LIBRARY = {};
var cardsRendered = false;

//-----------------------------------------------------------------
// RUN ONCE
// place more logic on PHP later
//-----------------------------------------------------------------

if (window.location.pathname == "/ready/") {
    $('html').addClass('is-loading');
    getCardsLibrary();
}

//-----------------------------------------------------------------
// GET CARDS LIBRARY JSON (ONE TIME)
//-----------------------------------------------------------------

function getCardsLibrary(){
    var jqxhr = $.get('http://www.liquidvisual.net/soberfish.com/php/cards_get_json.php')
    .done(
        function(data) {
            CARDS_LIBRARY = data; // store the library first
            // console.log(PLAYER_ID);
            initGame();
        })
    .fail(
        function(data) {
            alert(data+'Error: polling problem')
    });
}

//-----------------------------------------------------------------
// INIT GAME - CALLED WHEN LIBRARY IS LOADED
//-----------------------------------------------------------------

function initGame() {
    /**
     * AJAX long-polling
     *
     * 1. sends a request to the server (without a timestamp parameter)
     * 2. waits for an answer from server.php (which can take forever)
     * 3. if server.php responds (whenever), put data_from_file into #response
     * 4. and call the function again
     *
     * @param timestamp
     */

    function getContent(timestamp) {
        var queryString = {'timestamp': timestamp, 'playerID': PLAYER_ID};

        $.ajax(
            {
                type: 'GET',
                url: 'http://www.liquidvisual.net/soberfish.com/php/room_poll_updates.php',
                data: queryString,
                success: function(data){

                    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                    var obj = JSON.parse(data.data_from_file);
                    renderQuestion(obj); // set the black questions

                    // Render player HUD

                    renderRoomID(obj);
                    renderPlayerName(obj);
                    renderPlayerCardsAmount(obj);
                    renderPlayerCards(obj);
                    renderPlayerCash(obj);
                    renderAnswer(obj);

                    // console.log(obj);

                    $('html').removeClass('is-loading'); // remove loader
                    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

                    // call the function again, this time with the timestamp we just got from server.php
                    getContent(data.timestamp);  // UNCOMMENT *****
                },
                error: function (request, status, error) {
                    // alert(request.responseText);
                    // alert('Error: polling problem');
                    console.log('Error with polling. request: '+request+'status: '+status+'error: '+error);
                }
            }
        );
    }

    getContent();
}

//-----------------------------------------------------------------
// RENDER QUESTION
//-----------------------------------------------------------------

function renderQuestion(obj) {
    var questionArr = obj['room']['questions'];
    var question = getCardFromId(questionArr[0]); // get first card id in array
    $('[data-sb-game-deck-question]').text(question.text);
}

function renderAnswer(obj) {
    var cardsInPlayArr = obj['room']['cards_in_play'];

    if (cardsInPlayArr.length == 0) {

    } else {
        var len = cardsInPlayArr.length-1;
        var cardID = cardsInPlayArr[len];
        var card = getCardFromId(cardID);

        $('[data-sb-game-deck-answer-slot-1]').text(card.text);
    }

}

//-----------------------------------------------------------------
// RENDER PLAYER CARDS
//-----------------------------------------------------------------

function renderPlayerCards(obj) {
    var player = getPlayer(obj);
    var cardsArr = getPlayerActiveCards(player);

    // console.log('cards:'+getPlayerActiveCards(player));

    var html = '';

    for (playerCard in cardsArr) {

        var card = cardsArr[playerCard];

        // GROUP PROPERTIES
        var isType = card.properties.type;
        var isColor = 'is-'+card.properties.color;
        var cardTypeAlias = card.properties.alias;
        var cardValue = card.properties.value;
        var isWild = card.wild ? 'is-wild' : ''; // individual card, not group
        var cardText = card.text;
        var cardID = card.id;

        html += '<li>';
        html +=     '<div class="sb-card '+isColor+' '+isWild+'" data-wild="true" data-value="10" data-id="'+cardID+'">';
        html +=         '<div class="sb-card-inner">';
        html +=             '<header class="sb-card-header">';
        html +=                 '<span class="text">'+cardTypeAlias+'</span>';
        html +=             '</header>';
        html +=             '<div class="sb-card-text">';
        html +=                 '<p>'+cardText+'</p>';
        html +=             '</div>';
        html +=             '<div class="sb-card-value">';
        html +=                 '<span class="text">'+cardValue+'</span>';
        html +=             '</div>';
        html +=         '</div>';
        html +=     '</div>';
        html += '</li>';
    }

    var $html = '<ul class="sb-card-grid">'+html+'</ul>';

    if (!cardsRendered) {
        $('[data-player-deck]').append($html);
    }

    cardsRendered = true;

    //-----------------------------------------------------------------
    // CLICK PROTOTYPE SEND ANSWER TO GAME DECK
    //-----------------------------------------------------------------

    $('.sb-card.is-green').click(function(){
        var text = $('.sb-card-text p', $(this)).text();
        var cardID = $(this).attr('data-id');
        $(this).parent().addClass('is-discarded');

        // alert(cardID);
        var jqxhr = $.get('http://www.liquidvisual.net/soberfish.com/php/cards_set_by_id.php', {'playerID': PLAYER_ID, 'cardID': cardID })
        .done(
            function(data) {
                console.log('card has been set: ');
                console.log(data);
            })
    })
}

//-----------------------------------------------------------------
// RENDER PLAYER NAME
//-----------------------------------------------------------------

function renderPlayerName(obj) {
    var player = getPlayer(obj);
    $('[data-player-name]').text(player.name);
}

//-----------------------------------------------------------------
// RENDER ROOM ID
//-----------------------------------------------------------------

function renderRoomID(obj) {
    var player = getPlayer(obj);
    var roomID = getRoomID(player.id);

    var roomID = roomID.slice(0, 3) + " " + roomID.slice(3);

    $('[data-room-id]').text(roomID);
}

//==================================================
// RENDER PLAYER CASH
//==================================================

function renderPlayerCash(obj) {
    var player = getPlayer(obj);
    $('[data-player-cash]').text('$'+player.cash);
}

//==================================================
// RENDER PLAYER CARDS AMOUNT
//==================================================

function renderPlayerCardsAmount(obj) {
    var player = getPlayer(obj);
    $('[data-player-cards-amount]').text(player.cards_active.length +' cards');
}

//-----------------------------------------------------------------
// GET PLAYER
//-----------------------------------------------------------------

function getPlayer(obj) {
    var players = obj.room.players;
    for (player in players) {
        var player = players[player];
        if (player.id == PLAYER_ID) {
            return player;
        }
    }
}

//-----------------------------------------------------------------
// GET PLAYER ACTIVE CARDS
// USE ID TO SEARCH JSON ARRAY (STORED) FOR CARD
//-----------------------------------------------------------------

function getPlayerActiveCards(player) {
    var playerCardsIDArr = player.cards_active;
    var playerCardsArr = [];

    for (card in playerCardsIDArr) {

        var cardID = playerCardsIDArr[card];
        var cardObj = getCardFromId(cardID); // FIX UP THE ID NAMING
        playerCardsArr.push(cardObj); // change this from a name to an object
    }

    return playerCardsArr;
}

//-----------------------------------------------------------------
// GET CARD
// USE ID TO SEARCH JSON ARRAY (STORED) FOR CARD
//-----------------------------------------------------------------

function getCardFromId(id) {

    var cardTypeShortcode = id.substr(0, 3);

    // Card IDs are prefixed with card type shortcodes for ease of search
    var cardTypes = {   'BLA': 'black_cards',
                        'BLU': 'blue_cards',
                        'RED': 'red_cards',
                        'GRE': 'green_cards',
                        'ORA': 'orange_cards'
                    };

    var type = cardTypes[cardTypeShortcode];
    var cardsArr = CARDS_LIBRARY[type]['cards']; // static library
    var cardsProperties = CARDS_LIBRARY[type]['properties'];

    // Search in the right card group
    for (card in cardsArr) {
        var card = cardsArr[card];

        // is there a better way to do this?
        card.properties = cardsProperties;

        if (card.id == id) {
            return card;
        }
    }
}

//-----------------------------------------------------------------
// QUICK AND DIRTY - REPLACE
//-----------------------------------------------------------------

if (window.location.pathname == "/") {
    localStorage.removeItem("playerID");
}

//-----------------------------------------------------------------
//
//-----------------------------------------------------------------
//==================================================
//
//==================================================