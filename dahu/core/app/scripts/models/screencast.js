define([
    'underscore',
    'backbone',
    // modules
    'modules/kernel/SCI',
    // models
    'models/metadata',
    'models/settings',
    'models/screen',
    'models/objects/tooltip',
    // collections
    'collections/screens',
    // unique ids
    'uuid'
], function(
    _, Backbone,
    Kernel,
    Metadata, Settings, ScreenModel,
    TooltipModel, ScreenCollection, UUID){

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
            // wrap up metadata around Metadata model unless it already is
            if( ! (this.get('metadata') instanceof Metadata) ) {
                this.set('metadata', new Metadata(this.get('metadata')));
            }
            // wrap up settings around Settings model unless it already is
            if( ! (this.get('settings') instanceof Settings) ) {
                this.set('settings', new Settings(this.get('settings')));
            }
            // wrap up screens around ScreenCollection unless it already is
            if ( ! (this.get('screens') instanceof ScreenCollection) ) {
                this.set('screens', new ScreenCollection(this.get('screens')));
            }
        },

        /**
         * Set project `filename` from which this model was loaded.
         *
         * @param filename
         * @warning used only to simplify model syncing. DO NOT ADD MORE PRIVATE PROPERTIES.
         */
        setProjectFilename: function(filename) {
            this._projectFilename = filename;
        },

        /**
         * Get project the filename from which this model was loaded.
         *
         * @returns {String} absolute path to the project filename.
         * @warning used only to simplify model syncing. DO NOT ADD MORE PRIVATE PROPERTIES.
         */
        getProjectFilename: function() {
            return this._projectFilename;
        },

        /**
         *  Check the dimensions in the settings
         * 
         * @return {Boolean} true if dimension in settings are defined
         */
        hasScreenDimension: function() {
            return this.get('settings').hasScreenDimension();
        },

        /**
         * Get screen width
         */
        getScreenWidth: function() {
            return this.get('settings').get('screenWidth');
        },

        /**
         * Set screen width
         * @param width width of the screen
         */
        setScreenWidth: function(width) {
            this.get('settings').set('screenWidth', width);
        },

        /**
         * Return the current screencast height.
         */
        getScreenHeight: function() {
            return this.get('settings').get('screenHeight');
        },

        /**
         * Set the height of the screen in the settings
         * @param height height of the screen
         */
        setScreenHeight: function(height) {
            this.get('settings').set('screenHeight', height)
        },

        /**
         * Get a screen model by its `id`.
         *
         * @param screenId
         * @returns {*} Returns the ScreenModel if found, else undefined.
         */
        getScreenById: function(screenId) {
            return this.get('screens').findWhere({ id: screenId});
        },

        /**
         * Add a new screen to the screencast.
         *
         * @param screenModel
         */
        addScreen: function(screen) {
            if (screen instanceof ScreenModel) {
                this.get('screens').add(screen);
            }
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
         * @param jsonData
         * @return {ScreencastModel} converted project data.
         */
        newFromOldDataFormat: function(jsonData, version) {
            // Internal methods used to convert from v1 to v2
            
            /**
             * Compute the mouse coordinates for each screen
             * 
             * @param data Equels to json.data
             * @param last True if the result is the last coordinate of the mouse in the screen (first coordinates otherwise)
             * @param replace True if the move action giving the coordinates must be deleted
             * @returns {Array} The coordinates for each screen
             */
            function constructMouseCoordinates(data, last, replace) {
                var coordinates = new Array();
                _.each(data, function (oldScreenCur, index, data) {
                    var newCoordsAdded = false;
                    var actionArrayLength = oldScreenCur.action.length;
                    // get the position from the associated move action
                    for(var i = 0; i<actionArrayLength; ++i) {
                        var oldAction = oldScreenCur.action[last?actionArrayLength-1-i:i];
                        if (oldAction.type == 'move' && oldAction.target == 'mouse-cursor') {
                            coordinates.push([oldAction.finalAbs, oldAction.finalOrd]);
                            // This type will be ignored by convertActions
                            if(replace) {
                                oldAction.type = 'replace';
                            }
                            newCoordsAdded = true;
                            break;
                        }
                    }
                    // if no information available about the position, 
                    // keep the previous position
                    if(!newCoordsAdded) {
                        if(index == 0) {
                            coordinates.push([0, 0]);
                        } else {
                            coordinates.push([coordinates[index-1][0], coordinates[index-1][1]]);
                        }
                    }
                });
                
                return coordinates;
            }
            
            /**
             * Adds and convert the old objects to the updated screencast
             * 
             * @param oldScreenCur The old values of the current screen
             * @param screenObjects The objects of the current screen
             * @param newActions An array of updated actions to complete
             * @param firstMouseCoords The coordinates of the mouse before any action
             * @param index The index of the screen among all the screens
             * @param newBackground A replacement if their is no background
             * @returns {oldScreenCur.object} A background for the next screen if it hasn't got any
             */
            function convertAndAddObjects(oldScreenCur, screenObjects, newActions, firstMouseCoords, index, newBackground) {
                var mouseFound = false;
                var backgroundFound = false;
                var backgroundToDisplace = null;
                for(var j=0; j<oldScreenCur.object.length; ++j) {
                    var oldObject = oldScreenCur.object[j];
                    // actually update the mouse coordinates
                    if (oldObject.type == 'mouse') {
                        oldObject.id = oldObject.id+index;
                        oldObject.posx = firstMouseCoords[index][0];
                        oldObject.posy = firstMouseCoords[index][1];
                        mouseFound = true;
                    }
                    // tooltips shouldn't be displayed immediatly
                    else if (oldObject.type == 'tooltip') {
                        newActions.unshift({
                            id: UUID.v4(),
                            target: oldObject.id,
                            type: "disappear",
                            trigger: "withPrevious",
                            duration: 0
                        });
                    }

                    if(oldObject.type == 'background') {
                        if(backgroundFound){
                            // another background has been found, keep it
                            // for the next screen
                            backgroundToDisplace = oldObject;
                        } else {
                            // the screenshot should be rendered first in the
                            // browser to avoid hiding other elements
                            backgroundFound = true;
                            screenObjects.unshift(oldObject);
                        }
                    } else {
                        screenObjects.add(oldObject);
                    }
                }
                if(!mouseFound) {
                    // if there is no mouse, keep it at the same
                    // position as the previosu screen
                    screenObjects.add({
                        "id": "mouse-cursor"+index,
                        "type": "mouse",
                        "posx": firstMouseCoords[index][0],
                        "posy": firstMouseCoords[index][1]
                    });
                }
                if(!backgroundFound && newBackground !== null) {
                    screenObjects.unshift(newBackground);
                }
                return backgroundToDisplace;
            }
            
            /**
             * Convert the old objects to updated actions
             * 
             * @param oldScreenCur The old values of the current screen
             * @param screenObjects The objects of the current screen
             * @param newActions An array of updated actions to complete
             */
            function convertActions(oldScreenCur, screenObjects, newActions) {
                _.each(oldScreenCur.action, function (oldAction) {
                    if (oldAction.type == 'move') {
                        if(oldAction.duration === undefined) {
                            oldAction.duration = 600;
                        }
                        newActions.push(oldAction);
                    } else if (oldAction.type == 'appear') {
                        //Memorize the target
                        var target = oldAction.target;
                        var targetObject = _.find(screenObjects.models, function (object) {
                            return object.id == target;
                        });
                        if(targetObject !== undefined && targetObject.get('kind') !== 'background') {
                            targetObject.set('posx', oldAction.abs);
                            targetObject.set('posy', oldAction.ord);
                            oldAction.abs = undefined;
                            oldAction.ord = undefined;
                            newActions.push(oldAction);
                        }
                    } else if (oldAction.type == 'disappear') {
                        newActions.push(oldAction);
                    }
                });
            }
            
            /**
             * Converts final coordinates in translations from the previous coordinates
             * 
             * @param screenObjects The objects of the current screen
             * @param newActions An array of updated actions to convert
             * @param imgWidth Width of the screenshots
             * @param imgHeight Height of the screenshots
             * @param objects The objects to which the actions apply
             */
            function convertPositionsToTranslations(screenObjects, newActions, imgWidth, imgHeight, objects) {
                _.each(newActions, function (action) {
                    if(action.type == 'move') {
                        // memorize the target
                        var target = action.target;
                        var targetObject = _.find(screenObjects.models, function (object) {
                            return object.id == target;
                        });
                        // keep the last coordinates in memory to compute the translation
                        // vector in the next iteration
                        if(targetObject.get('lastCoord') === undefined) {
                            targetObject.set('lastCoord', [targetObject.get('posx'), targetObject.get('posy')]);
                        }
                        action.trX = (action.finalAbs - targetObject.get('lastCoord')[0]) * imgWidth;
                        action.trY = (action.finalOrd - targetObject.get('lastCoord')[1]) * imgHeight;
                        targetObject.set('lastCoord', [action.finalAbs, action.finalOrd]);
                    }
                });
                _.each(objects, function(o) {
                    o.lastCoord = undefined;
                });
            }
            
            /**
             * Makes sure the final coordinates of the current mouse corresponds
             * to the first coordinates of the next mouse cursor
             * 
             * @param newActions An array of updated actions to complete
             * @param firstMouseCoords The array of first coordinates
             * @param lastMouseCoords The array of last coordinates
             * @param imgWidth Width of the screenshots
             * @param imgHeight Height of the screenshots
             * @param index The index of the current screen among all the screens
             */
            function addLastMouseTranslation(newActions, firstMouseCoords, lastMouseCoords, imgWidth, imgHeight, index) {
                var transAbs = (firstMouseCoords[index+1][0]-lastMouseCoords[index][0])*imgWidth;
                var transOrd = (firstMouseCoords[index+1][1]-lastMouseCoords[index][1])*imgHeight;
                if(transAbs !== 0 || transOrd !== 0) {
                    newActions.push({
                        id: UUID.v4(),
                        type: "move",
                        target: "mouse-cursor"+index,
                        trigger: "onChange",
                        trX: transAbs,
                        trY: transOrd,
                        duration: 600
                    });
                }
            }
            
            /**
             * Add newActions to screenActions with all the necessary 
             * changes to get valid actions in v2
             * 
             * @param screenActions The actions of current screen
             * @param newActions Not fully updated actions to put in screenActions
             */
            function addAllActions(screenActions, newActions) {
                //The first afterPrevious, if placed before the first onChange, should not play immediatly
                var firstAfterPreviousChanged = false;
                _.each(newActions, function (action) {
                    if(action.trigger == 'onClick') {
                        action.trigger = 'onChange';
                    }
                    if(action.trigger != 'withPrevious' && !firstAfterPreviousChanged) {
                        firstAfterPreviousChanged = true;
                        action.trigger = 'onChange';
                    }
                    action.target = "#"+action.target;
                    screenActions.add(action);
                });
            }
            
            // Actual conversion
            try {
                var screencast = new ScreencastModel();

                if( version === 1 ) {
                    // import settings (old metaData)
                    var settings = screencast.get('settings');
                    settings.set('screenWidth', jsonData.metaData.imageWidth);
                    settings.set('screenHeight', jsonData.metaData.imageHeight);
                    
                    var lastMouseCoords = constructMouseCoordinates(jsonData.data, true, false);
                    var firstMouseCoords = constructMouseCoordinates(jsonData.data, false, true);

                    // import screens (old data)
                    var screens = screencast.get('screens');
                    var newBackground = null;
                    _.each(jsonData.data, function (oldScreenCur, index, data) {
                        // initialize the new current screen
                        var screen = screens.create();
                        // add oldObjects to the screen
                        var screenObjects = screen.get('objects');
                        var newActions = new Array();
                        newBackground = convertAndAddObjects(oldScreenCur, screenObjects, newActions, firstMouseCoords, index, newBackground);
                        // add actions and set objects of the screen
                        var screenActions = screen.get('actions');
                        convertActions(oldScreenCur, screenObjects, newActions);
                        convertPositionsToTranslations(
                                screenObjects, newActions, 
                                jsonData.metaData.imageWidth, 
                                jsonData.metaData.imageHeight, 
                                oldScreenCur.object
                        );
                        if(index < jsonData.data.length - 1) {
                            addLastMouseTranslation(
                                newActions, firstMouseCoords, lastMouseCoords, 
                                jsonData.metaData.imageWidth, 
                                jsonData.metaData.imageHeight, index
                            );
                        }
                        
                        addAllActions(screenActions, newActions)
                    });
                }

                // everything went fine
                return screencast;
            } catch(e) {
                Kernel.console.error("Error while importing project. {}", e);
            }

            return null;
        }
    });

    return ScreencastModel;
});