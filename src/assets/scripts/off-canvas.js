/*
    OFF-CANVAS.JS - Last updated: 13.12.16

    - Notes: Latest Nov version fixes major problem with 3rd lvls
    * off-canvas closes when clicking hash tag anchor
*/
//-----------------------------------------------------------------
//
//-----------------------------------------------------------------

;(function($) {
    'use strict';

    //-----------------------------------------------------------------
    // VARIABLES
    //-----------------------------------------------------------------

    var intervalId;
    var $html = $('html');
    var $globalHeader = $('.global-header');
    var $dropdowns = $('.lv-off-canvas .dropdown');
    var $lvPage = $('.lv-page');
    var $lvOffCanvas = $('.lv-off-canvas');
    var $hashAnchor = $('a[href*="#"]:not([href="#"])', $lvOffCanvas);
    var $submenuTrigger = $('<span class="submenu-trigger"><i class="fa fa-angle-right"></i></span>');

    //-----------------------------------------------------------------
    // HAMBURGER CLICK
    //-----------------------------------------------------------------

    $('[data-menu-toggle]').click(function(event){

        //==================================================
        // OPEN MENU
        //==================================================

        if (!$('.has-open-menu').length) {
            $html.removeClass('has-closed-menu').addClass('has-open-menu');
            pollFixedTop();

            //==================================================
            // CLOSE MENU
            // Assign the close to .lv-page container
            // Requires timeout so not to contradict above
            //==================================================

            setTimeout(function(){
                $lvPage.click(function(event){
                    event.stopPropagation();

                    if ($('.has-open-menu').length) {
                        $globalHeader.removeAttr('style');
                        clearInterval(intervalId);
                        $html.removeClass('has-open-menu').addClass('has-closed-menu');
                        $(this).unbind('click');
                    }
                });
            }, 10)
        }
    });

    //-----------------------------------------------------------------
    // HASH ANCHOR CLICK - NEW -
    //-----------------------------------------------------------------

    $hashAnchor.click(function(event){
        event.preventDefault();
        event.stopPropagation();
        $globalHeader.removeAttr('style');
        clearInterval(intervalId);
        $html.removeClass('has-open-menu').addClass('has-closed-menu');
        $lvPage.unbind('click');
    });

    //-----------------------------------------------------------------
    // SUBMENU CLICK
    //-----------------------------------------------------------------

    $submenuTrigger.click(function(event){
        event.preventDefault();
        event.stopPropagation();
        $(this).parent().next('.dropdown').addClass('is-open');
    });

    //-----------------------------------------------------------------
    // DROPDOWN CLICK (EXIT BACK)
    //-----------------------------------------------------------------

    $dropdowns.click(function(event){
        $(this).removeClass('is-open');
        event.stopPropagation();
    });

    //-----------------------------------------------------------------
    // POLL FIXED-TOP UNTIL CLOSE
    //-----------------------------------------------------------------

    function pollFixedTop() {
        intervalId = setInterval(function(){
            if ($('.has-open-menu').length) {

                $('.global-header').css({ top: $(window).scrollTop()+'px' });
            } else {
                $('.global-header').removeAttr('style');
                clearInterval(intervalId);
            }
        }, 100);
    }

    //-----------------------------------------------------------------
    // CREATE SUBMENU TRIGGER
    // Not sure why, but this has to come LAST
    //-----------------------------------------------------------------

    $('.lv-off-canvas .has-dropdown > a').append($submenuTrigger);

//--
}(jQuery));

//==================================================
//
//==================================================