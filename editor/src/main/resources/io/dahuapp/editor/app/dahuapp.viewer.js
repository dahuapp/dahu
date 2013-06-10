"use strict";

/**
 * Dahuapp viewer module.
 * 
 * @param   dahuapp     dahuapp object to augment with module.
 * @param   $           jQuery
 * @returns dahuapp extended with viewer module.
 */

var dahuapp = (function(dahuapp, $) {
    var viewer = (function() {

        var self = {};

        /**
         * The screenshots will have to be described with CSS "screen" class.
         * Variable "max aims to count the screenshots taken for the presentation.
         */

        var max = $(".screen").size();

        /**
         * "currentImage" is the main image being visualised.
         */

        var currentImage = 0;


        /**
         *At the beginning, the visible image is the first one of the presentation
         */

        self.init = function init() {
            for (var i = 0; i < max; i++) {
                $("#" + i).hide();
            }
            $("#" + currentImage).show();

            /**
             * A click on the "next" button publishes a nextSlide event
             */
            $("#next").click(function() {
                events.nextSlide.publish();


            });

            /**
             * A click on the "previous" button publishes a previousSlide event
             */
            $("#previous").click(function() {
                events.previousSlide.publish();
            });
        }

        return self;

    })();

    dahuapp.viewer = viewer;
    dahuapp.viewer.init();

    return dahuapp;
})(dahuapp || {}, jQuery);
