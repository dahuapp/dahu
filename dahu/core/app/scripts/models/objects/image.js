/**
 * Created by dufourau on 5/28/14.
 */

define([
    'underscore',
    'backbone',
    'models/object'
], function(_, Backbone, ObjectModel){

    /**
     *  Model of image object
     */
    var ImageModel = ObjectModel.extend({
        defaults: {
            img: null
        }

    });

    return ImageModel;
});