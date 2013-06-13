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

        var DahuViewerModel = function(select) {

            /* Private API */

            var json = null;
            var selector = select;

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
                        if (json.data[currentSlide].action[currentAction].trigger === 'onClick') {
                            launch(json.data[currentSlide].action[currentAction++]);
                            alert(currentSlide);
                            return;
                        }
                        currentAction++;
                    }
                    if (currentSlide < json.data.length - 1) {
                        lastSlide = currentSlide;
                        currentSlide++;
                        currentAction = 0;
                        actualise();
                    } else {
                        alert(currentSlide);
                        return;
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
                        if (json.data[currentSlide].action[currentAction].trigger === 'onClick') {
                            alert(currentSlide);
                            return;
                        }
                        currentAction--;
                    }
                    if (currentSlide > 0) {
                        lastSlide = currentSlide;
                        currentSlide--;
                        actualise();
                        currentAction = json.data[currentSlide].indexAction - 1;
                    } else {
                        alert(currentSlide);
                        return;
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
                    if (currentSlide < json.data.length - 1) {
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
                $(selector + " ." + json.data[lastSlide].object[0].id).hide();
                $(selector + " ." + json.data[currentSlide].object[0].id).show();
            };

            /*
             * Function used to realise actions.
             */
            var launch = function(action) {
                var target = selector + ' .' + action.target;
                var animation = eval('(' + action.execute + ')');
                animation(target);
                events.actionOver.publish();
            };

            /* Public API */

            this.load = function(url) {
                $.ajax({
                    'async': false,
                    'global': false,
                    'url': url,
                    'dataType': "json",
                    'success': function(data) {
                        json = data;
                    }
                });
            };

            this.start = function() {

                /*
                 * Subscription of methods to their events.
                 */
                events.next.subscribe(nextEventHandler);
                events.previous.subscribe(previousEventHandler);
                events.actionOver.subscribe(actionOverEventHandler);

                /*
                 * Variable storing the total number of slides.
                 */
                var max = json.data.length;

                /*
                 *At the beginning, the visible image is the first one of the presentation
                 */
                for (var i = 0; i < max; i++) {
                    $(selector + " .s" + i + "-o0").hide();
                }
                $(selector + " ." + json.data[0].object[0].id).show();

                /*
                 * A click on the "next" button publishes a nextSlide event
                 */
                $(selector + " .next").click(function() {
                    events.next.publish();
                });

                /*
                 * A click on the "previous" button publishes a previousSlide event
                 */
                $(selector + " .previous").click(function() {
                    events.previous.publish();
                });
            };
        };

        self.createDahuViewer = function(selector) {
            return new DahuViewerModel(selector);
        };

        return self;
    })();

    dahuapp.viewer = viewer;

    return dahuapp;

})(dahuapp || {}, jQuery);
