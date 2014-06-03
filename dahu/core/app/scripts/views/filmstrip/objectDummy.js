/**
 * Created by nabilbenabbou1 on 28/05/2014.
 */

define([
    'handlebars',
    'backbone.marionette',
    'text!templates/views/filmstrip/objectDummy.html',
    'modules/kernel/SCI'
], function(Handlebars, Marionette, Filmstrip_objectDummy_tpl, Kernel){

    /**
     * Screen background view
     */
    var objectDummyView = Marionette.ItemView.extend({
        template: Handlebars.default.compile(Filmstrip_objectDummy_tpl)
    });

    return objectDummyView;
});