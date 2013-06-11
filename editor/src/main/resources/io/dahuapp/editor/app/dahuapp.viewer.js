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
        var events = (function() {
            var self = {};
            /*
             * Creates a generic event.
             */
            var createEvent = function() {
                var callbacks = $.Callbacks();
                return {
                    publish: callbacks.fire,
                    subscribe: callbacks.add,
                    unsubscribe: callbacks.remove
                };
            };
            /*
             * Called when the button next is pressed.
             */
            self.next = createEvent();
            /*
             * Called when the button previous is pressed.
             */
            self.previous = createEvent();
            /*
             * Called when an action is over.
             */
            self.actionOver = createEvent();
            return self;
        })();
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
         * Variables used like index for methodes subscribed.
         */
        var currentSlide = 0;
        var lastSlide = 0;
        var currentAction = 0;

        /*
         * Function used when an "nextEvent" event is caught.
         */
        var nextEventHandler = function() {
            while (json.data[currentSlide]) {
                while (json.data[currentSlide].action[currentAction]) {
                    if (json.data[currentSlide].action[currentAction].trigger === 'nextButton') {
                        launch(json.data[currentSlide].action[currentAction++]);
                        return;
                    }
                    currentAction++;
                }
                if (currentSlide < json.metaData.nbSlide - 1) {
                    lastSlide = currentSlide;
                    currentSlide++;
                    currentAction = 0;
                    actualise();
                }
            }
        };

        /*
         * Function used when an "previousEvent" event is caught.
         */
        var previousEventHandler = function() {
            currentAction--;
            while (json.data[currentSlide]) {
                while (json.data[currentSlide].action[currentAction]) {
                    if (json.data[currentSlide].action[currentAction].trigger === 'nextButton') {
                        return;
                    }
                    currentAction--;
                }
                if (currentSlide > 0) {
                    lastSlide = currentSlide;
                    currentSlide--;
                    actualise();
                    currentAction = json.data[currentSlide].indexAction - 1;
                }
            }
        };

        /*
         * Function used when an "actionOverEvent" event is caught.
         */
        var actionOverEventHandler = function() {
            if (json.data[currentSlide].action[currentAction]) {
                if (json.data[currentSlide].action[currentAction].trigger === 'withPrevious') {
                    launch(json.data[currentSlide].action[currentAction++]);
                }
            } else {
                if (currentSlide < json.metaData.nbSlide - 1) {
                    lastSlide = currentSlide;
                    currentSlide++;
                    actualise();
                    currentAction = 0;
                }
                if (json.data[currentSlide].action[currentAction]
                        && json.data[currentSlide].action[currentAction].trigger === 'withPrevious') {
                    launch(json.data[currentSlide].action[currentAction++]);
                }
            }
        };

        /*
         * Function used to actualise the background when there is a new slide.
         */
        var actualise = function() {
            $('#' + lastSlide + '-0').hide();
            $('#' + currentSlide + '-0').show();
        };

        /*
         * Function used to realise actions.
         */
        var launch = function(action) {
            switch (action.type) {
                case "appear":
                    $('#' + action.target).show();
                    events.actionOver.publish();
                    break;
                case "disappear":
                    $('#' + action.traget).hide();
                    events.actionOver.publish();
                    break;
                case "move":
                    //not implemented yet;
                    events.actionOver.publish();
                    break;
            }
        };

        self.init = function init() {

            /*
             * Subscription of methods to their events.
             */
            events.next.subscribe(nextEventHandler);
            events.previous.subscribe(previousEventHandler);
            events.actionOver.subscribe(actionOverEventHandler);

            /*
             *At the beginning, the visible image is the first one of the presentation
             */

            for (var i = 0; i < max; i++) {
                $("#" + i + "-0").hide();
            }
            $("#" + currentImage + '-0').show();
            /*
             * A click on the "next" button publishes a nextSlide event
             */
            $("#next").click(function() {
                if (currentImage < max) {
                    currentImage++;
                    events.next.publish(currentImage);
                }
            });
            /*
             * A click on the "previous" button publishes a previousSlide event
             */
            $("#previous").click(function() {
                if (currentImage > 0) {
                    currentImage--;
                    events.previous.publish(currentImage);
                }
            });
        };

        return self;
    })();
    dahuapp.viewer = viewer;
    return dahuapp;
})(dahuapp || {}, jQuery);
