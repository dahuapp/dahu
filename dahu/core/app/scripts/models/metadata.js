/**
 * Created by barraq on 19/05/14.
 */

define([
    'underscore',
    'backbone'
], function(_, Backbone){

    /**
     * Base object model.
     */
    var MetadataModel = Backbone.Model.extend({
        defaults: function() {
            return {
                title: _.template('Dahu Screencast - <%= date %>', date=Date.now()),
                author: undefined,
                created_at: Date.now(),
                modified_at: Date.now()
            }
        }
    });

    return MetadataModel;
});
