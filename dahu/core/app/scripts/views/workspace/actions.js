/**
 * Created by nabilbenabbou1 on 6/13/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    'text!templates/views/workspace/actions.html',
    'collections/actions',
    'models/actions/appear',
    'models/actions/disappear',
    'models/actions/move',
    'views/actions/appear',
    'views/actions/disappear',
    'views/actions/move'
], function(Handlebars, Marionette, Workspace_actions_tpl,
            ActionsCollection,
            AppearModel, DisappearModel, MoveModel,
            AppearView, DisappearView, MoveView
    ){

    /**
     * Workspace actions view
     */
    var ActionsView = Marionette.CompositeView.extend({
        template: Handlebars.default.compile(Workspace_actions_tpl),
        // We select the ItemView depending on the object type.
        getItemView: function(item){
            if(item instanceof AppearModel) {
                return AppearView;
            }else if(item instanceof DisappearModel){
                return DisappearView;
            }else if(item instanceof MoveModel){
                return MoveView;
            }
        },
        itemViewContainer: '#myActions',

        initialize : function (model, objectId) {
            // Specify that the collection we want to iterate, for the itemView, is
            // given by the attribute actions.
            this.model = model.model;
            if (this.model != null) {
                if (objectId != null) {
                    var actionsArray = _.filter(this.model.get('actions').models, function(action){
                        return action.get('target') == objectId;
                    });
                    this.collection = new ActionsCollection(actionsArray);
                }
                else {
                    this.collection = this.model.get('actions');
                }
                // Tell the view to render itself when the
                // model/collection is changed.
                this.model.on('change', this.onChanged(), this);
                if (this.collection != null) {
                    this.collection.on('change', this.onChanged(), this);
                }
            }
        },

        onChanged: function(){
            this.render();
        },

        modelEvents: {
            'change': 'onChanged'
        }
    });

    return ActionsView;
});