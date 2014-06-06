/**
 * Created by dufourau on 5/28/14.
 */

define([
    'underscore',
    'backbone',
    'models/object'
], function(_, Backbone, ObjectModel){

    /**
     *  Model of background object
     */
    var BackgroundModel = ObjectModel.extend({
        defaults: {
            type: 'background',
            img: null,
            
        }

    });

    return BackgroundModel;
});