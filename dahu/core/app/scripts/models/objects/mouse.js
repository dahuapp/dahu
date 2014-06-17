/**
 * Created by nabilbenabbou1 on 6/1/14.
 */

define([
    'underscore',
    'backbone',
    'models/object'
], function(_, Backbone, ObjectModel){

    /**
     *  Model of mouse object
     */
    var MouseModel = ObjectModel.extend({
        defaults: function() {
            return _.extend({}, ObjectModel.prototype.defaults(), {
                type: 'mouse'
            });
        }
    });

    return MouseModel;
});
