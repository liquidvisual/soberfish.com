/*
    READY.JS - Last updated: 25.01.17
*/
//-----------------------------------------------------------------
// VARIABLES
//-----------------------------------------------------------------

var PLAYER_ID = localStorage.getItem("playerID");
var CARDS_LIBRARY = {};

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
                    renderPlayerName(obj);
                    renderPlayerCardsAmount(obj);
                    renderPlayerCards(obj);
                    renderPlayerCash(obj);

                    $('html').removeClass('is-loading'); // remove loader
                    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

                    // call the function again, this time with the timestamp we just got from server.php
                    // getContent(data.timestamp);  // UNCOMMENT *****
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
    $('[data-sb-game-deck-question]').text(question);
}

//-----------------------------------------------------------------
// RENDER PLAYER CARDS
//-----------------------------------------------------------------

function renderPlayerCards(obj) {
    var player = getPlayer(obj);
    var cardsArr = getPlayerActiveCards(player);

    console.log(cardsArr);

    var html = '';

    for (playerCard in cardsArr) {

        html += '<li>';
        html +=     '<div class="sb-card is-green is-wildX" data-wild="true" data-value="10">';
        html +=         '<div class="sb-card-inner">'
        html +=             '<header class="sb-card-header">'
        html +=                 '<span class="text">Answer</span>'
        html +=             '</header>'
        html +=             '<div class="sb-card-text">'
        html +=                 '<p>'+cardsArr[playerCard]+'</p>'
        html +=             '</div>'
        html +=             '<div class="sb-card-value">'
        html +=                 '<span class="text">10</span>'
        html +=             '</div>'
        html +=         '</div>'
        html +=     '</div>';
        html += '</li>';
    }

    var $html = '<ul class="sb-card-grid">'+html+'</ul>';

    $('[data-player-deck]').append($html);
}

//-----------------------------------------------------------------
// RENDER PLAYER NAME
//-----------------------------------------------------------------

function renderPlayerName(obj) {
    var player = getPlayer(obj);
    $('[data-player-name]').text(player.name);
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
    var playerCardArr = [];

    for (card in playerCardsIDArr) {

        var cardID = playerCardsIDArr[card];

        var cardName = getCardFromId(cardID); // FIX UP THE ID NAMING

        playerCardArr.push(cardName); // change this from a name to an object
    }

    return playerCardArr;
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

    // Search in the right card color type
    for (card in cardsArr) {
        var card = cardsArr[card];

        if (card.id == id) {
            return card.text;
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