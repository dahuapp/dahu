define([
    'underscore',
    'backbone',
    'models/screen'
], function(_, Backbone, ScreenModel){

    /**
     * Base *Screen* collection.
     */
    var ScreenCollection = Backbone.Collection.extend({
        model: ScreenModel
    });

    return ScreenCollection;
});