/**
 * Created by obzota on 22/05/15.
 */

define([
    'handlebars',
    'backbone.marionette',
    // modules
    'modules/events',
    // templates
    'text!templates/views/workspace/note.html'
], function(
    Handlebars,
    Marionette,
    // modules
    events,
    // templates
    noteTemplate){

    /**
     * Note screen view
     */
    return Marionette.ItemView.extend({
        template: Handlebars.default.compile(noteTemplate),
        className: 'note',

        events: {
            "focusout" : "updateNoteModel"
        },

        initialize: function (options) {
            var self = this;
            _.extend(this, _.pick(options, ['screencast', 'screenId']));
            this.model = this.screencast.model.getScreenById(this.screenId).get('note');
            events.on("before:app:screencast:save", function() {
                self.updateNoteModel();
            });
        },

        updateNoteModel: function () {
            this.model.setText($("#note_textarea").val());
        },
        
        onDestroy: function () {
            events.off("app:screencast:save");
        }

    });
});