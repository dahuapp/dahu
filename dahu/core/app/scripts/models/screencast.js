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
        defaults: {
            metadata: new Metadata(),
            settings: new Settings(),
            screens: new ScreenCollection(),
            version: VERSION
        },

        toJSON: function() {
            return JSON.stringify(this.attributes)
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
                return jsonData.version;
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
                _.each(jsonData.data, function(oldScreen) {
                    var screen = screens.create();
                    var screenObjects = screen.get('objects');
                    _.each(oldScreen.object, function(oldObject) {
                        screenObjects.add(oldObject);
                    });
                });
            }

            return screencast;
        }
    });

    return ScreencastModel;
});