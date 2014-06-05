/**
 * Created by nabilbenabbou1 on 6/1/14.
 */

define([
    'underscore',
    'backbone',
    'models/action',
    'models/actions/move'
], function(_, Backbone, ActionModel, MoveModel){

    /**
     * Base *Action* collection.
     */
    var ActionCollection = Backbone.Collection.extend({

        // The model depends on the type of the object
        model: function(attrs, options) {
            switch (attrs.type) {
                case "move":
                    return new MoveModel(attrs, options);
                default:
                    return new ActionModel(attrs, options);
            }
        }
     });

    return ActionCollection;
});