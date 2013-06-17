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
                        unsubscribe: callbacks.remove,
                        unsubscribeAll: callbacks.empty
                    };
                };
                /*
                 * Called when the button next is pressed.
                 */
                self.onNext = createEvent();
                /*
                 * Called when the button previous is pressed.
                 */
                self.onPrevious = createEvent();
                /*
                 * Called when an action is over.
                 */
                self.onActionOver = createEvent();
                /*
                 * Called when an action starts.
                 */
                self.onActionStart = createEvent();
                /*
                 * Called when at least one action was running and has finished.
                 */
                self.onAllActionFinish = createEvent();
                
                return self;
            })();

            /*
             * Variables used like index for methodes subscribed.
             */
            var currentAction = 0;
            var nextAction = 0;
            var nbActionsRunning = 0;
            
            var reinitialiseCallbackLists = function() {
                events.onActionStart.unsubscribeAll();
                events.onActionStart.subscribe(onActionStartEventHandler);
                events.onAllActionFinish.unsubscribeAll();
            };
            
            /*
             * Function used when an "onNextEvent" event is caught.
             */
            var onNextEventHandler = function() {
                $(selector + " .object-list").children().stop(true, true);
                reinitialiseCallbackLists();
                if (json.action[nextAction]) {
                    launch(json.action[nextAction]);
                    currentAction = nextAction + 1;
                } else if (nextAction < 0) {
                    currentAction = 0;
                    nextAction = 0;
                }
                while (json.action[currentAction]) {
                    switch (json.action[currentAction].trigger) {
                        case 'onClick':
                            nextAction = currentAction;
                            return;
                        case 'withPrevious':
                            events.onActionStart.subscribe(json.data[currentAction].execute);
                            break;
                        case 'afterPrevious':
                            events.onAllActionFinish.subscribe(json.data[currentAction].execute);
                            while (json.action[currentAction].trigger !== 'onClick') {
                                currentAction++;
                            }
                            nextAction = currentAction;
                            break;
                    }
                    currentAction++;
                }
            };

            /*
             * Function used when an "onPreviousEvent" event is caught.
             */
            var onPreviousEventHandler = function() {
                $(selector + " .object-list").children().stop(true, true);
                while (json.action[--currentAction].trigger !== 'onClick') {
                    launch(json.action[currentAction]);
                }
                nextAction = currentAction;
            };

            /*
             * Function used when an "onActionOverEvent" event is caught.
             */
            var onActionOverEventHandler = function() {
                nbActionsRunning--;
                if (nbActionsRunning === 0) {
                    events.onAllActionFinish.publish(selector, json.metaData.imageWidth, json.metaData.imageHeight);
                    events.onActionStart.unsubscribeAll();
                    events.onActionStart.subscribe(onActionStartEventHandler);
                    events.onAllActionFinish.unsubscribeAll();
                    while (json.data[currentAction]) {
                        switch (json.action[currentAction].trigger) {
                            case 'onClick':
                                return;
                            case 'withPrevious':
                                events.onActionStart.subscribe(json.data[currentAction].execute);
                                break;
                            case 'afterPrevious':
                                events.onAllActionFinish.subscribe(json.data[currentAction].execute);
                                return;
                        }
                        currentAction++;
                    }
                }
            };

            /*
             * Function used when an "onActionStartEvent" event is caught.
             */
            var onActionStartEventHandler = function() {
                nbActionsRunning++;
            };

            /*
             * Function used to realise actions.
             */
            var launch = function(action) {
                action.execute(selector, json.metaData.imageWidth, json.metaData.imageHeight);
            };

            var launchReverse = function(action) {
                action.executeReverse(selector, json.metaData.image.width, json.metaData.image.Height);
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

                for (var i = 0; i < json.action.length; i++) {
                    json.action[i].execute = eval('(' + json.action[i].execute + ')');
                    json.action[i].executeReverse = eval('(' + json.action[i].executeReverse + ')');
                }
                
                /*
                 * Subscription of methods to their events.
                 */
                events.onNext.subscribe(onNextEventHandler);
                events.onPrevious.subscribe(onPreviousEventHandler);
                events.onActionOver.subscribe(onActionOverEventHandler);
                events.onActionStart.subscribe(onActionStartEventHandler);

                /*
                 *At the beginning, the visible image is the first one of the presentation
                 */
                $(selector + " .object-list").children().hide();

                $(selector + " ." + json.metaData.initialBackgroundId).show();

                $(selector + " .mouse-cursor").css({'top': json.metaData.initialMouseY * json.metaData.imageHeight + "px",
                    'left': json.metaData.initialMouseX * json.metaData.imageWidth + "px"});

                $(selector + " .mouse-cursor").show();

                /*
                 * A click on the "next" button publishes a nextSlide event
                 */
                $(selector + " .next").click(function() {
                    events.onNext.publish();
                });
                /*
                 * A click on the "previous" button publishes a previousSlide event
                 */
                $(selector + " .previous").click(function() {
                    events.onPrevious.publish();
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
