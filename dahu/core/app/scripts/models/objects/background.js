/**
 * Created by dufourau on 5/28/14.
 */

define([
    'underscore',
    'backbone',
    'models/object',
    'uuid'
], function(_, Backbone, ObjectModel, UUID){

    /**
     *  Model of background object
     */
    var BackgroundModel = ObjectModel.extend({
        defaults: function() {
            return {
                id: UUID.v4(),
                type: 'background',
                img: null
            }
        }

    });

    return BackgroundModel;
});