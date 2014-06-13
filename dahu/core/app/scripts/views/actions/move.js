/**
 * Created by nabilbenabbou1 on 6/13/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    'text!templates/views/workspace/actions/move.html'
], function(Handlebars, Marionette, Actions_move_tpl){

    /**
     * Move action view
     */
    var moveView = Marionette.ItemView.extend({
        template: Handlebars.default.compile(Actions_move_tpl)
    });

    return moveView;
});