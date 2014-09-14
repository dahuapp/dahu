/**
 * Created by barraq on 8/18/14.
 */

define(['underscore','backbone'], function(_, backbone) {
    /**
     * Private helper function for serializing Backbone model attributes recursively, creating
     * objects which delegate to the original attributes in order to protect them from changes.
     *
     * @copyright http://chaplinjs.org/
     */
    function serializeAttributes(model, attributes, modelStack) {
        var delegator = Object.create(attributes);
        var key, otherModel, serializedModels, value, _i, _len, _ref;

        // add model to stack
        modelStack = modelStack || {};
        modelStack[model.cid] = true;

        // Map model/collection to their attributes. Create a property
        // on the delegator that shadows the original attribute.
        for (key in attributes) {
            value = attributes[key];
            if (value instanceof Backbone.Model) {
                delegator[key] = serializeModelAttributes(value, model, modelStack);
            } else if (value instanceof Backbone.Collection) {
                serializedModels = [];
                _ref = value.models;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    otherModel = _ref[_i];
                    serializedModels.push(serializeModelAttributes(otherModel, model, modelStack));
                }
                delegator[key] = serializedModels;
            }
        }
        delete modelStack[model.cid];

        // Return delegator
        return delegator;
    }

    /**
     * Serialize the attributes of a given model
     * in the context of a given tree.
     *
     * @copyright http://chaplinjs.org/
     */
    function serializeModelAttributes(model, currentModel, modelStack) {
        // Nullify circular references.
        if (model === currentModel || model.cid in modelStack) {
            return null;
        }
        // Serialize recursively.
        return serializeAttributes(model, model.attributes, modelStack);
    }

    /**
     * Patch backbone.
     *
     * - add `Model.serialize` function that deeply serialize a model.
     * - add a `Model.stringify` function that return a stringified version of a model.
     */
    function patch() {
        _.extend(Backbone.Model.prototype, {
            serialize: function () {
                // Return an object which delegates to the attributes
                // (i.e. an object which has the attributes as prototype)
                // so primitive values might be added and altered safely.
                // Map models to their attributes, recursively.
                // @warning be aware, however, that this do not cope well with stringify.
                // Indeed JSON.stringify does not preserve any of the not-owned properties of the object.
                // while in our case serialize return of 'proxy' of the model.
                return serializeAttributes(this, this.attributes);
            },

            stringify: function (replacer, space) {
                return JSON.stringify(this.attributes, replacer, space);
            }
        });
    }

    return {
        patch: patch
    }
});