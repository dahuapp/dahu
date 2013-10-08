"use strict";

/**
 * Dahuapp viewer module.
 * 
 * @param   dahuapp     dahuapp object to augment with module.
 * @param   $           jQuery
 * @returns dahuapp extended with viewer module.
 */

(function(dahuapp, $) {
    var viewer = (function() {

        var self = {};

        var DahuViewerModel = function(select, getParams) {

            /* Private API */

            var json = null;
            var selector = select;
            var parseAutoOption = function(name, defaultValue) {
                var res = getParams[name];
                if (res == null) {
                    if (name == 'auto') {
                        return false;
                    } else {
                        return parseAutoOption('auto', defaultValue);
                    }
                }
                if (res.toLowerCase() === 'false') {
                    return false;
                }
                res = parseInt(res);
                if (isNaN(res)) {
                    // e.g. ?autoplay or ?autoplay=true
                    return defaultValue;
                }
                return res;
            }

            /* Whether to wait for "next" event between actions */
            var autoPlay = parseAutoOption('autoplay', 5000);
            /* Whether to wait for "next" event on page load */
            var autoStart = parseAutoOption('autostart', 5000);
            /* Whether to loop back to start at the end of presentation */
            var autoLoop = parseAutoOption('autoloop', 5000);

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
            var previousAnchor = -1;  /* Last entered anchor, only used in
                                       * case the 'onhashchange' event is
                                       * not supported by the web browser */
            
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
             * Timer used to program onNext event in autoplay mode.
             */
            var playTimer = 0;

            /*
             * Function used when an "onNextEvent" event is caught.
             */
            var onNextEventHandler = function() {
                /*
                 * If the user pressed "next" before an autoplay event
                 * is triggered, it replaces the autoplay event, hence
                 * cancels it:
                 */
                window.clearTimeout(playTimer);

                enterAnimationMode();
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
                                leaveAnimationMode();
                                if (autoPlay && nbActionsRunning === 0) {
                                    playTimer = setTimeout(function () {
                                        events.onNext.publish();
                                    }, autoPlay);
                                }
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
                    if (autoLoop && nbActionsRunning === 0) {
                        setTimeout(function () {
                            resetPresentation();
                            startPresentationMaybe();
                        }, autoLoop);
                    }
                }
                leaveAnimationMode();
            };

            /*
             * Function used when an "onActionStartEvent" event is caught.
             */
            var onActionStartEventHandler = function() {
                nbActionsRunning++;
            };

            /*
             * Enter and leave "animation" mode. The viewer is in
             * animation mode when something is going on without human
             * interaction (i.e. executing actions before the next
             * "onClick").
             */
            var enterAnimationMode = function () {
                $(selector + ' .mouse-cursor-pause').hide();
                $(selector + ' .mouse-cursor-normal').show();
            };

            var leaveAnimationMode = function () {
                $(selector + ' .mouse-cursor-pause').show();
                $(selector + ' .mouse-cursor-normal').hide();
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
             * The two following methods each returns an array containing the
             * actions to execute to reach the given anchor (respectively
             * forward or backwards).
             *
             * If the given anchor matches none of the actions, then an empty
             * array is returned.
             */
            var getActionsToJumpForward = function(anchor) {
                var actions = new Array();
                for (var i = nextAction; i < json.action.length; i++) {
                    // '==' and not '===' because we compare indifferently a
                    // number or a string or anything else
                    if (json.action[i].id == anchor) {
                        return actions;
                    } else {
                        actions.push(json.action[i]);
                    }
                }
                // Here, the anchor has not been found during the action scan
                return null;
            };
            var getActionsToJumpBackwards = function(anchor) {
                var actions = new Array();
                for (var i = nextAction - 1; i >= 0; i--) {
                    // '==' and not '===' because we compare indifferently a
                    // number or a string or anything else
                    actions.push(json.action[i]);
                    if (json.action[i].id == anchor) {
                        return actions;
                    }
                }
                // Here, the anchor has not been found during the action scan
                return null;
            };
            
            /*
             * Updates the position of the presentation depending on the
             * given anchor (next action wanted).
             */
            var jumpToAnchor = function(anchor) {
                if (anchor !== '') {
                    stopAllActions();
                    if (anchor > nextAction) {
                        // forward
                        var actions = getActionsToJumpForward(anchor);
                        for (var i = 0; i < actions.length; i++) {
                            actions[i].executeImmediately(selector);
                        }
                        nextAction += actions.length;
                    } else {
                        // backwards
                        var actions = getActionsToJumpBackwards(anchor);
                        for (var i = 0; i < actions.length; i++) {
                            actions[i].executeReverse(selector);
                        }
                        nextAction -= actions.length;
                    }
                }
            };

            var resetPresentation = function() {
                window.clearTimeout(playTimer);

                currentAction = 0;
                nextAction = 0;
                nbActionsRunning = 0;

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
            }

            var startPresentationMaybe = function() {
                if (autoStart) {
                    playTimer = setTimeout(function () {
                        events.onNext.publish();
                    }, autoStart);
                }
            }

            /* Public API */

            this.loadUrl = function(url) {
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
                
                load(dataJson);
            };

            this.load = function(dataJson) {
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

                resetPresentation();

                /*
                 * If an anchor has been specified, we place the presentation
                 * in the right position.
                 */
                jumpToAnchor(window.location.hash.substring(1));
                
                /*
                 * If the anchor changes during the presentation, then the
                 * presentation is updated
                 */
                if ("onhashchange" in window) {
                    // event supported
                    window.onhashchange = function () {
                        jumpToAnchor(window.location.hash.substring(1));
                    };
                } else {
                    // event not supported : periodical check
                    window.setInterval(function () {
                        if (window.location.hash.substring(1) !== previousAnchor) {
                            previousAnchor = window.location.hash.substring(1);
                            jumpToAnchor(window.location.hash.substring(1));
                        }
                    }, 100);
                }

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
                startPresentationMaybe();
            };
        };

        self.createDahuViewer = function(selector, getParams) {
            return new DahuViewerModel(selector, getParams);
        };

        return self;
    })();

    dahuapp.viewer = viewer;
})(dahuapp || {}, jQuery);
