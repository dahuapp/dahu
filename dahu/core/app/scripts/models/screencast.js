define([
    'underscore',
    'backbone',
    'collections/screens'
], function(_, Backbone, ScreenCollection){

    /**
     * Base Screencast model.
     */
    var ScreencastModel = Backbone.Model.extend({
        defaults: {
            title: _.template('Dahu Screencast - <%= date %>', date=Date.now()),
            author: undefined,
            created_at: Date.now(),
            modified_at: Date.now(),
            screens: new ScreenCollection()
        },

        toJSON: function() {
            return JSON.stringify(this.attributes)
        }
    });

    return ScreencastModel;
});