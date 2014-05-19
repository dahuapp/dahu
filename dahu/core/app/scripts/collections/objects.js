/**
 * Created by barraq on 19/05/14.
 */

define([
    'underscore',
    'backbone',
    'models/object'
], function(_, Backbone, ObjectModel){

    /**
     * Base *Object* collection.
     */
    var ObjectCollection = Backbone.Collection.extend({
        model: ObjectModel
    });

    return ObjectCollection;
});