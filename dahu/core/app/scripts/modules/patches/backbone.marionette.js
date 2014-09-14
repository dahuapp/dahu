/**
 * Created by barraq on 8/18/14.
 */

define(['underscore', 'backbone.marionette'], function(_, Marionette) {
    /**
     * Patch Backbone.Marionette
     *
     * - make `View.serializeModel` use Model.serialize so that Handlebars templates can
     *   better access models attributes (by default it was using toJSON which is not recursive).
     */
    function patch() {
        _.extend(Marionette.View.prototype, {
            serializeModel: function (model) {
                // Here we want Marionette.View to  use Backbone.Model.serialize when they can
                // instead of Backbone.Model.toJSON
                var serializer = _.isFunction(model.serialize) ? model.serialize : model.toJSON;
                return serializer.apply(model, Array.prototype.slice.call(arguments, 1));
            }
        });
    }

    return {
        patch: patch
    }
});