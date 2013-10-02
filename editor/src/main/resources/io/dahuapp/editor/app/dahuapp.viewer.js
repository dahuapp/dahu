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
            var currentAction = 0;    /* Action currently running */
            var nextAction = 0;       /* Action to execute on 'Next' click */
            var nbActionsRunning = 0;
            
            /*
             * Functions to reinitialise running actions and subscribed
             * callbacks (reinitialise is called once without stopping
             * all the actions, so the two functions are separated).
             */
            var stopAllActions = function() {
                $(selector + " .object-list").children().stop(true, true);
                reinitialiseCallbackLists();
                nbActionsRunning = 0;
            };
            var reinitialiseCallbackLists = function() {
                events.onActionStart.unsubscribeAll();
                events.onActionStart.subscribe(onActionStartEventHandler);
                events.onAllActionFinish.unsubscribeAll();
            };
            
            /*
             * Function used when an "onNextEvent" event is caught.
             */
            var onNextEventHandler = function() {
                stopAllActions();
                var tmpAction = nextAction;
                var onlyWithPrevious = true;
                nextAction++;
                currentAction = nextAction;
                while (json.action[currentAction] && onlyWithPrevious) {
                    switch (json.action[currentAction].trigger) {
                        case 'onClick':
                            nextAction = currentAction;
                            onlyWithPrevious = false;
                            break;
                        case 'withPrevious':
                            var tmp = currentAction;
                            /*
                             * We can't directly pass 'execute' as callback because we
                             * allow the 'execute' function to reference a property of the
                             * object (by using 'this.property') so we have to call the
                             * function in the containing object to make that available
                             */
                            events.onActionStart.subscribe(function(events, selector) {
                                json.action[tmp].execute(events, selector);
                            });
                            break;
                        case 'afterPrevious':
                            var tmp = currentAction;
                            events.onAllActionFinish.subscribe(function(events, selector) {
                                json.action[tmp].execute(events, selector);
                            });
                            while (json.action[nextAction] && json.action[nextAction].trigger !== 'onClick') {
                                nextAction++;
                            }
                            onlyWithPrevious = false;
                            break;
                    }
                    currentAction++;
                }
                if (json.action[tmpAction]) {
                    launch(json.action[tmpAction]);
                }
                if (nextAction > json.action.length) {
                    nextAction = json.action.length;
                }
            };
            
            /*
             * Function used when an "onPreviousEvent" event is caught.
             */
            var onPreviousEventHandler = function() {
                stopAllActions();
                currentAction = nextAction - 1;
                while (json.action[currentAction] && json.action[currentAction].trigger !== 'onClick') {
                    launchReverse(json.action[currentAction]);
                    currentAction--;
                }
                /* currentAction = -1 means that it's the beginning */
                if (currentAction > -1) {
                    launchReverse(json.action[currentAction]);
                }
                if (currentAction < 0) {
                    currentAction = 0;
                }
                nextAction = currentAction;
            };

            /*
             * Function used when an "onActionOverEvent" event is caught.
             */
            var onActionOverEventHandler = function() {
                nbActionsRunning--;
                if (nbActionsRunning === 0) {
                    events.onAllActionFinish.publish(events, selector);
                    reinitialiseCallbackLists();
                    while (json.action[currentAction]) {
                        switch (json.action[currentAction].trigger) {
                            case 'onClick':
                                return;
                            case 'withPrevious':
                                var tmp = currentAction;
                                events.onActionStart.subscribe(function(events, selector) {
                                    json.action[tmp].execute(events, selector);
                                });
                                break;
                            case 'afterPrevious':
                                var tmp = currentAction;
                                events.onAllActionFinish.subscribe(function(events, selector) {
                                    json.action[tmp].execute(events, selector);
                                });
                                currentAction++;
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
             * Function used to perform actions.
             */
            var launch = function(action) {
                action.execute(events, selector);
            };
            var launchReverse = function(action) {
                action.executeReverse(selector);
            };

            /*
             * Returns an array containing the actions that are before the
             * given anchor (the action which has this anchor is excluded).
             *
             * If the given anchor matches none of the actions, then an empty
             * array is returned.
             */
            var getActionsBeforeAnchor = function(anchor) {
                var actionsBeforeAnchor = new Array();
                for (var i = 0; i < json.action.length; i++) {
                    // '==' and not '===' because we compare indifferently a
                    // number or a string or anything else
                    if (json.action[i].id == anchor) {
                        return actionsBeforeAnchor;
                    } else {
                        actionsBeforeAnchor.push(json.action[i]);
                    }
                }
                // Here, the anchor has not been found during the action scan
                return null;
            };

            /* Public API */

            this.load = function(url) {
                var dataJson;
                $.ajax({
                    'async': false,
                    'global': false,
                    'url': url,
                    'dataType': "json",
                    'success': function(data) {
                        dataJson = data;
                    }
                });
                
                /* Transforms data JSON to executable functions for actions */
                var execModel = dahuapp.createScreencastExecutableModel();
                execModel.loadJson(dataJson);
                json = execModel.getJson();
            };

            this.start = function() {
                
                /*
                 * Subscription of methods to their events.
                 */
                events.onNext.subscribe(onNextEventHandler);
                events.onPrevious.subscribe(onPreviousEventHandler);
                events.onActionOver.subscribe(onActionOverEventHandler);
                events.onActionStart.subscribe(onActionStartEventHandler);

                /*
                 * At the beginning, the visible image is the first one of the presentation
                 */
                $(selector + " .object-list").children().hide();

                $(selector + " ." + json.metaData.initialBackgroundId).show();

                $(selector + " .mouse-cursor").css({
                    'top': (json.metaData.initialMouseY * json.metaData.imageHeight) + "px",
                    'left': (json.metaData.initialMouseX * json.metaData.imageWidth) + "px"
                });

                $(selector + " .mouse-cursor").show();

                /*
                 * If an anchor has been specified, we place the presentation
                 * in the right position.
                 */
                var anchor = window.location.hash.substring(1);
                var actionsBeforeAnchor = null;
                if (anchor !== '') {
                    actionsBeforeAnchor = getActionsBeforeAnchor(anchor);
                }

                if (actionsBeforeAnchor !== null) {
                    for (var i = 0; i < actionsBeforeAnchor.length; i++) {
                        actionsBeforeAnchor[i].executeImmediately(selector);
                    }
                    nextAction = actionsBeforeAnchor.length;
                };

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

                /*
                 * Everything is ready, show the presentation
                 * (hidden with style="display: none" from HTML).
                 */
                $("#loading").hide();
                $(selector + " .object-list").show();
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
