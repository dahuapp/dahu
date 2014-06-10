define([
    'underscore',
    'backbone',
    'models/metadata',
    'models/settings',
    'collections/screens'
], function(_, Backbone, Metadata, Settings, ScreenCollection){

    var VERSION = 2;

    /**
     * Base Screencast model.
     */
    var ScreencastModel = Backbone.Model.extend({
        defaults: function() {
            return {
                metadata: new Metadata(),
                settings: new Settings(),
                screens: new ScreenCollection(),
                version: VERSION
            }
        },

        initialize: function () {
            // wrap up screens around ScreenCollection unless it already is
            if ( ! (this.get('screens') instanceof ScreenCollection) ) {
                this.set('screens', new ScreenCollection(this.get('screens')));
            }
        },

        toJSON: function(indentation) {
            // indentation allows the proper indentation of the returned string.
            indentation = indentation || undefined;
            return JSON.stringify(this.attributes, undefined, indentation)
        }
    }, { // class properties (static)

        VERSION: VERSION,

        /**
         * Check if Dahu screencast project file need to be upgraded.
         *
         * @param fileContent
         * @returns {bool}
         */
        needToUpgradeVersion: function(fileContent) {
            var fileData = JSON.parse(fileContent);
            return this.checkVersionFromJSONData(fileData) != VERSION;
        },

        /**
         * Create a ScreencastModel instance from a fileContent.
         *
         * @param fileContent
         * @returns {ScreencastModel}
         */
        newFromString: function(fileContent) {
            var fileData = JSON.parse(fileContent);
            var fileDataVersion = this.checkVersionFromJSONData(fileData);

            if( fileDataVersion === VERSION ) {
                return new ScreencastModel(fileData);
            } else {
                return this.newFromOldDataFormat(fileData, fileDataVersion);
            }
        },

        /**
         * Check the version of a Dahu screencast project data.
         *
         * @param jsonData JSON data of the project to check.
         * @returns {int} version
         */
        checkVersionFromJSONData: function(jsonData) {
            if(_.has(jsonData, 'metaData') && _.has(jsonData, 'data')) {
                return 1;
            } else {
                return parseInt(jsonData.version);
            }
        },

        /**
         * Convert Dahu project from v1 to v2.
         *
         * @todo fix bug: we end up with only one screen...
         *
         * @param jsonData
         * @return {ScreencastModel} converted project data.
         */
        newFromOldDataFormat: function(jsonData, version) {
            var screencast = new ScreencastModel();
            if( version === 1 ) {

                // import settings (old metaData)
                var settings = screencast.get('settings');
                settings.screenWidth = jsonData.metaData.imageWidth;
                settings.screenHeight = jsonData.metaData.imageHeight;
                //Memorize the last mouse coordinates
                var lastMouseX= 0;
                var lastMouseY= 0;
                // import screens (old data)
                var screens = screencast.get('screens');
                _.each(jsonData.data, function(oldScreenCur,index,data) {
                    //Initialize the new current screen
                    var screen = screens.create();
                    //Add oldObjects to the screen
                    var screenObjects = screen.get('objects');

                    _.each(oldScreenCur.object, function (oldObject) {
                        if(oldObject.type == 'mouse'){
                            oldObject.posx = lastMouseX;
                            oldObject.posy = lastMouseY;
                        }
                        screenObjects.add(oldObject);

                    });
                    //Add actions and set objects of the screen
                    var screenActions = screen.get('actions');
                    //For each actions we will find the objects coordinates
                    _.each(oldScreenCur.action, function (oldAction) {
                        //Move action
                        if (oldAction.type == 'move') {
                            //Memorize the target
                            var target = oldAction.target;
                            //Copy the coordinates from the action move to the object targeted
                            var targetObject = _.find(screenObjects.models, function (object) {
                                return object.id == target;
                            });

                            targetObject.set('posx',oldAction.finalAbs);
                            targetObject.set('posy',oldAction.finalOrd);

                            //Search the coordoniates from the next screen for mouse moving
                            if(targetObject.get('type') == 'mouse') {
                                //Memorize the last mouse objects
                                lastMouseX = oldAction.finalAbs;
                                lastMouseY = oldAction.finalOrd;

                                if (data[index + 1] != undefined) {
                                    var moveMouseAction = _.find((data[index+1]).action, function (oldNextAction) {
                                        return oldNextAction.target == 'mouse-cursor' && oldNextAction.type == 'move';
                                    });
                                    if (moveMouseAction != undefined) {
                                        //Copy the old action into the new screen
                                        oldAction.finalAbs = moveMouseAction.finalAbs;
                                        oldAction.finalOrd = moveMouseAction.finalOrd;

                                    } else {
                                        //The mouse doesn't move
                                        oldAction.finalAbs = lastMouseX;
                                        oldAction.finalOrd = lastMouseY;
                                    }
                                }
                            }
                            screenActions.add(oldAction);

                        //Appear Action
                        } else if (oldAction.type == 'appear') {

                            //Memorize the target
                            target = oldAction.target;
                            //Copy the coordinates from the action move to the object targeted
                            targetObject = _.find(screenObjects.models, function (object) {
                                return object.id == target;
                            });
                            targetObject.set('posx',oldAction.abs);
                            targetObject.set('posy',oldAction.ord);
                            oldAction.abs= undefined;
                            oldAction.ord= undefined;
                            screenActions.add(oldAction);
                        //Others action
                        } else {
                            screenActions.add(oldAction);
                        }
                    });
                });


            }

            return screencast;
        }
    });

    return ScreencastModel;
});