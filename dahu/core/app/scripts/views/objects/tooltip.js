/**
 * Created by dufourau on 6/5/14.
 */
define([
    'handlebars',
    'backbone.marionette',
    'text!templates/views/workspace/tooltip.html'
], function(Handlebars, Marionette, Objetcs_tooltip_tpl){

    /**
     * Screen image view
     */
    var mouseView = Marionette.ItemView.extend({
        template: Handlebars.default.compile(Objetcs_tooltip_tpl),

        templateHelpers: {
            getAbs: function () {
                return (this.posx) * 800;
            },
            getOrd: function () {
                return (this.posy)* 494;
            },
            getText: function () {
                return this.text;
            }
        }

    });

    return mouseView;
});