/**
 * Created by nabilbenabbou1 on 6/13/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    // models
    'models/actions/appear',
    'models/actions/disappear',
    'models/actions/move',
    'models/action',
    // views
    'views/workspace/actions/appear',
    'views/workspace/actions/disappear',
    'views/workspace/actions/move',
    'views/workspace/actions/action',
    // templates
    'text!templates/views/workspace/actions.html',
    //modules
    'modules/utils/exceptions'
], function(
    Handlebars,
    Marionette,
    // models
    AppearModel,
    DisappearModel,
    MoveModel,
    ActionModel,
    // views
    AppearView,
    DisappearView,
    MoveView,
    ActionView,
    // templates
    actionsTemplate,
    //modules
    Exceptions
) {

    /**
     * Workspace actions view
     */
    return Marionette.CompositeView.extend({

        template: Handlebars.default.compile(actionsTemplate),

        className: "actionsListContainer",

        childViewContainer : "#actionsList",

        initialize : function (options) {
            // mandatory arguments
            _.extend(this, _.pick(options, ['screencast', 'screenId']));

            // initialize collection with action models
            this.collection = this.screencast.model.getScreenById(this.screenId).get("actions");

            // Options given to the constructor of the views
            this.childViewOptions = {
                screencast: this.screencast,
                screenId: this.screenId
            };

        },

        onAddChild: function(viewInstance) {
            this.scrollOnAction(viewInstance);
        },

        templateHelpers: function () {
            return {
                actionsAvailable: this.collection.getAvailableActions()
            }
        },

        triggers: {
            "click #buttonAdd": "create:action"
        },

        onCreateAction: function() {
            var type= $('#addActionChoice').val();
            switch (type) {
                case "move":
                    this.collection.add(new MoveModel());
                    break;
                case "appear":
                    this.collection.add(new AppearModel());
                    break;
                case "disappear":
                    this.collection.add(new DisappearModel());
                    break;
                default:
                    throw new Exceptions.IOError("this type of action, #{type}, doesn't exist.",{type:type});
            }
        },

        scrollOnAction: function(view) {
            view.$el[0].scrollIntoView(false);
        },

        // specify which class will be used
        // to generate view for each model
        getChildView: function(item) {
            switch (item.get('type')) {
                case "disappear":
                    return DisappearView;
                case "move":
                    return MoveView;
                case "appear":
                    return AppearView;
            }
        },

        /**
         * iterate on the collection to minimize
         * each action in the action list, so user
         * don't have to toggle them off by itself.
         *
         * This function is called when a child view
         * triggers the event "select"
         *
         * @param  {ActionView} viewSelected the view selected by the user
         */
        onChildviewSelect: function (viewSelected) {
            this.children.each(function(view){
                if (view !== viewSelected) {
                    view.setToggle(false);
                };
            });
        }

    });
});