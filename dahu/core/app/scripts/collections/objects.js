/**
 * Created by barraq on 19/05/14.
 */

define([
    'underscore',
    'backbone',
    'models/object',
    'models/objects/background',
    'models/objects/mouse'
], function(_, Backbone, ObjectModel, BackgroundModel, MouseModel){

    /**
     * Base *Object* collection.
     */
    var ObjectCollection = Backbone.Collection.extend({

        // The model depends on the type of the object
        model: function(attrs, options) {
            switch(attrs.type) {
                case "background":
                    return new BackgroundModel(attrs, options);
                case "mouse":
                    return new MouseModel(attrs, options);
                default:
                    return new ObjectModel(attrs, options);
            }
        }
    });

    return ObjectCollection;
});