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
         * Ajax request to load the JSON document. 
         */
        var json = (function() {
            var json = null;
            $.ajax({
                'async': false,
                'global': false,
                'url': 'presentation.dahu',
                'dataType': "json",
                'success': function(data) {
                    json = data;
                }
            });
            return json;
        })();

        /*
         * Variable storing the total number of slides.
         */
        var max = JSON.stringify(json.metaData.nbSlide);

        /*
         * "currentImage" is the main image being visualised.
         */
        var currentImage = 0;

        /*
         *At the beginning, the visible image is the first one of the presentation
         */
        self.init = function init() {
            for (var i = 0; i < max; i++) {
                $("#" + i).hide();
            }
            $("#" + currentImage).show();

            /*
             * A click on the "next" button publishes a nextSlide event
             */
            $("#next").click(function() {
                if (currentImage < max) {
                    currentImage++;
                    events.nextSlide.publish(currentImage);

                }
            });

            /*
             * A click on the "previous" button publishes a previousSlide event
             */
            $("#previous").click(function() {
                if (currentImage > 0) {
                    currentImage--;
                    events.previousSlide.publish(currentImage);
                }
            });
        }

        return self;

    })();

    dahuapp.viewer = viewer;

    return dahuapp;
})(dahuapp || {}, jQuery);
