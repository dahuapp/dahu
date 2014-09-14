/**
 * Created by barraq on 9/5/14.
 */

/**
 * Modals utility.
 *
 * Set of utilities to open modal windows such as popup, confirm and prompt.
 */

define([
    'underscore',
    'modules/events',
    'modules/kernel/SCI'
], function(_, events, Kernel){

    /**
     * Open a popup with given `content` and optional `features`.
     *
     * @param content
     * @param features (optional)
     * @returns {Window}
     */
    function openPopup(content, features) {
        // generate features string from features.
        // for a list of available features see https://developer.mozilla.org/en-US/docs/Web/API/Window.open
        var strFeatures = _.reduce(features, function(str, value, key) {
            return (str? str+"," : "")+key+"="+value
        }, "");

        // register to modal's on ready event (register only once)
        // note: only one modal can opened at a time so the only modal that
        // can trigger this event is the modal we gonna create.
        events.once('app:modals:ready', function(callback) {
            callback(content);
        });

        // create the modal (note: title and features are useless since ignored by JavaFx)
        var modal = window.open('classpath:///io/dahuapp/core/dialog.html', null, strFeatures);
        modal.focus();

        return modal;
    }

    return {
        openPopup: openPopup
    }
});