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
     *  Model of image object
     */
    var ImageModel = ObjectModel.extend({
        defaults: function() {
            return _.extend({}, ObjectModel.prototype.defaults(), {
                type: 'image',
                img: null
            });
        }
    });

    return ImageModel;
});