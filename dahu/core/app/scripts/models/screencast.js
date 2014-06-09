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

                // import screens (old data)
                var screens = screencast.get('screens');
                // remove first oldscreen
                var oldScreenCur= null;
                _.each(jsonData.data, function(oldScreenNext) {
                //initialize
                if(oldScreenCur== null){
                    oldScreenCur= oldScreenNext;

                }else {

                    var screenObjectsOld= [];
                    var screen = screens.create();
                    var screenObjects = screen.get('objects');
                    //Add old screens to a temporary var
                    _.each(oldScreenCur.object, function (oldObject) {
                        screenObjectsOld.push(oldObject);
                    });
                    var screenActions = screen.get('actions');
                    //For each actions we will find the mouse coordinates
                    _.each(oldScreenCur.action, function (oldAction) {
                        if (oldAction.type == 'move' && oldAction.target == 'mouse-cursor') {
                            //Copy the coordinates from the action to the object
                            var mouseObject = _.find(screenObjectsOld, function (object) {
                                return object.type == 'mouse';
                            });

                            mouseObject.posx = oldAction.finalAbs;
                            mouseObject.posy = oldAction.finalOrd;

                            //Copy all object into the new screen
                            _.each(screenObjectsOld, function (object) {
                                screenObjects.add(object);
                            });
                            //Search the coordoniates from the next screen
                            var moveMouseAction = _.find(oldScreenNext.action, function (oldNextAction) {
                                return oldNextAction.target == 'mouse-cursor' && oldNextAction.type == 'move';
                            });
                            //Copy the old action into the new screen
                            //Debug only
                            if (moveMouseAction != undefined) {

                                oldAction.finalAbs = moveMouseAction.finalAbs;
                                oldAction.finalOrd = moveMouseAction.finalOrd;
                            }else{
                                oldAction.finalAbs = 0;
                                oldAction.finalOrd = 0;
                            }
                            screenActions.add(oldAction);
                        } else {
                            screenActions.add(oldAction);
                        }
                    });
                    //The next screen become the current screen
                    oldScreenCur = oldScreenNext;
                }
                });

            }

            return screencast;
        }
    });

    return ScreencastModel;
});