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
    'views/workspace/actions/action',
    // templates
    'text!templates/views/workspace/actions.html',
    //modules
    'modules/kernel/SCI',
    'modules/utils/exceptions'
], function(
    Handlebars,
    Marionette,
    // models
    AppearModel,
    DisappearModel,
    MoveModel,
    // views

    ActionView,
    // templates
    actionsTemplate,
    //modules
    Kernel,
    Exceptions
) {

    /**
     * Workspace actions view
     */
    return Marionette.CompositeView.extend({

        template: Handlebars.default.compile(actionsTemplate),
        className: "actionsListContainer",
        childViewContainer : ".actionsList",

        initialize : function (options) {
            // mandatory arguments
            this.screencast = options.screencast;
            this.screenId = options.screenId;

            this.collection = this.screencast.model.getScreenById(this.screenId).get('actions');

            /*@remove
            // Specify that the collection we want to iterate, for the childView, is
            // given by the attribute actions.
            if (this.model != null) {
                this.collection = this.model.get('actions');
                // Tell the view to render itself when the
                // model/collection is changed.
                this.model.on('change', this.onChanged(), this);
                if (this.collection != null) {
                    this.collection.on('change', this.onChanged(), this);
                }
            }*/
        },
        templateHelpers: function () {
           return{
               actionsAvailable: this.collection.getAvailableActions(),
           }
        },
        events: {
          'click .buttonAdd': 'onCreateAction',
          'change .addAction': 'addActionChoice'
        },

        onCreateAction: function() {
            var type= $('#addActionChoice').val();
            switch (type) {
                case "move":{
                    this.collection.add(new MoveModel());
                    break;
                }
                case "appear":{
                    this.collection.add(new AppearModel());
                    break;
                }
                case "disappear":{
                    this.collection.add(new DisappearModel());
                    break;
                }
                default:{
                    /*var filename=this.screencast.model.getProjectFilename();
                    throw new Exceptions.IOError("this type of action doesn't exist.concerned project #{project}",{
                    project:filename
                    });*/
                    kernel.console.error("this type of action doesn't exist");  
                }
            }
            this.$childViewContainer[0].scrollTop=this.$childViewContainer[0].scrollHeight;
        },

        getChildView: function(item){
            return ActionView;
        },

        onChanged: function(){
            this.render();
        },

        modelEvents: {
            'change': 'onChanged'
        }
    });
});