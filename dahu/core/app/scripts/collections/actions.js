/**
 * Created by nabilbenabbou1 on 6/1/14.
 */


define([
    'underscore',
    'backbone',
    'models/action',
    'models/actions/move',
    'models/actions/appear',
    'models/actions/disappear'
], function(_, Backbone, ActionModel, MoveModel, AppearModel, DisappearModel){

    /**
     * Base *Action* collection.
     */
    var ActionCollection = Backbone.Collection.extend({

        // The model depends on the type of the object
        model: function(attrs, options) {
            switch (attrs.type) {
                case "move":
                    return new MoveModel(attrs, options);
                case "appear":
                    return new AppearModel(attrs, options);
                case "disappear":
                    return new DisappearModel(attrs, options);
                default:
                    return new ActionModel(attrs, options);
            }
        },
        
        getAvailableActions: function() {
           return ["move","appear","disappear"];
        }
    });

    return ActionCollection;
});