/**
 * Created by nabilbenabbou1 on 28/05/2014.
 */

define([
    'backbone.marionette'
], function(Marionette){

    /**
     * Object general view
     */
    var objectView = Marionette.ItemView.extend({
        templateHelpers: {
            getAbs: function () {
                return (this.posx);
            },
            getOrd: function () {
                return (this.posy);
            }
        }
    });

    return objectView;
});