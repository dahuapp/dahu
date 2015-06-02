/**
 * Created by obzota on 28/5/15.
 */

define([
    'handlebars',
    'backbone.marionette',
    // templates
    'text!templates/views/workspace/actions/action.html'
], function(
    Handlebars,
    Marionette,
    // templates
    actionTemplate
) {
    
    /**
     * Generic action view
     */
    return Marionette.ItemView.extend({
        
        template: Handlebars.default.compile(actionTemplate),
        
        className: "action",

        /**
         * View parameter to switch from extanded view
         * with full parametrable menu to short header
         * displaying few read-only information.
         * True : full menu.
         * False : short header.
         * @type {Boolean}
         */
        toggle: false,

        /**
         * Register helpers to be used in the template
         * when rendering is called
         * @return {[type]} [description]
         */
        templateHelpers: function () {
            return{
                isToggled: this.toggle,
                objects: this.objects,
                triggers: [
                    {value:"onChange", info:"on slide change"},
                    {value:"withPrevious", info:"with previous action"},
                    {value:"afterPrevious", info:"after previous action"}
                ],
                actionParametersPartial: function() {
                    if (this.type === "move") {
                        return "moveParametersPartial";
                    } else if (this.type === "appear") {
                        return "appearParametersPartial";
                    } else if (this.type === "disappear") {
                        return "disappearParametersPartial";
                    }
                },
                hasExtraParameters: this.hasExtraParameters
            };
        },

        hasExtraParameters: false,

        initialize: function(options) {
            // take the list of objects in a screen to display
            // them in a target choice
            this.objects = options.objects;
        },

        /**
         * Switch the toggling to hide or display full action view
         * with all parameters
         * @param {boolean} state
         */
        setToggle: function (state) {
            this.toggle = state;
            this.render();
        },

        /**
         * Set of events fired by the view on user actions.
         * Also call the 'onEvent' function when triggered.
         * @type {Object}
         */
        triggers:{
            "click .actionDelete": "delete",
            "click .headerAction": "select",
            "change #targetChoice": "target:change",
            "change #triggerChoice": "trigger:change",
            "change #durationChoice": "duration:change"
        },

        /**
         * Remove an action from the action list.
         */
        onDelete: function() {
            this.model.destroy();
        },

        /**
         * Display full view with all parameters and a set
         * of html input to modify them
         */
        onSelect: function () {
            this.toggle = !this.toggle;
            this.render();
        },

        /**
         * Update the model according to the user change
         * in the 'target' select.
         */
        onTargetChange: function () {
            this.model.attributes.target = $("#targetChoice").val();
        },

        /**
         * Update the model according to the user change
         * in the 'trigger' select.
         */
        onTriggerChange: function () {
            this.model.attributes.trigger = $("#triggerChoice").val();
        },

        /**
         * Update the model according to the user change
         * in the duration field.
         */
        onDurationChange: function () {
            this.model.attributes.duration = $("#durationChoice").val();
        }
        
    });
});
