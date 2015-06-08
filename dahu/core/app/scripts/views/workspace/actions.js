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
    // views
    'views/workspace/actions/appear',
    'views/workspace/actions/disappear',
    'views/workspace/actions/move',
    'views/workspace/actions/action',
    // templates
    'text!templates/views/workspace/actions.html',
    //modules
    'modules/utils/exceptions',
    // behaviors
    'behaviors/workspace/actions/sortable'
], function(
    Handlebars,
    Marionette,
    // models
    AppearModel,
    DisappearModel,
    MoveModel,
    // views
    AppearView,
    DisappearView,
    MoveView,
    ActionView,
    // templates
    actionsTemplate,
    //modules
    Exceptions,
    // behaviors
    SortableBehavior
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
            this.screencast = options.screencast;
            this.screenId = options.screenId;

            this.collection = this.screencast.model.getScreenById(this.screenId).get('actions');
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

        getChildView: function(item) {
            return ActionView;
        },

        onChanged: function() {
            this.render();
        },

        modelEvents: {
            'change': 'onChanged'
        },

        behaviors: {
            SortableBehavior: {
                behaviorClass: SortableBehavior
            }
        }
    });
});