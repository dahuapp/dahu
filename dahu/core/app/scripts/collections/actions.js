/**
 * Created by nabilbenabbou1 on 6/1/14.
 */

define([
    'underscore',
    'backbone',
    'models/action'
], function(_, Backbone, ActionModel){

    /**
     * Base *Action* collection.
     */
    var ActionCollection = Backbone.Collection.extend({
        model: ActionModel
    });

    return ActionCollection;
});