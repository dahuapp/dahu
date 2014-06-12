/**
 * Created by nabilbenabbou1 on 28/05/2014.
 */

define([
    'handlebars',
    'backbone.marionette'
], function(Handlebars, Marionette){

    /**
     * Object general view
     */
    var objectView = Marionette.ItemView.extend({
        template: Handlebars.default.compile(''),
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