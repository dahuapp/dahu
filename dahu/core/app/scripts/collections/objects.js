/**
 * Created by barraq on 19/05/14.
 */

define([
    'underscore',
    'backbone',
    'models/object',
    'models/objects/image',
    'models/objects/mouse',
    'models/objects/tooltip'
], function(_, Backbone, ObjectModel, ImageModel, MouseModel, TooltipModel){

    /**
     * Base *Object* collection.
     */
    var ObjectCollection = Backbone.Collection.extend({

        // The model depends on the type of the object
        model: function(attrs, options) {
            switch(attrs.type) {
                case "background":
                    return new ImageModel(attrs, options);
                case "image":
                    return new ImageModel(attrs, options);
                case "mouse":
                    return new MouseModel(attrs, options);
                case "tooltip":
                    return new TooltipModel(attrs, options);
                default:
                    return new ObjectModel(attrs, options);
            }
        }
    });

    return ObjectCollection;
});