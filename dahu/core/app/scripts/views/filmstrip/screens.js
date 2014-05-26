/**
 * Created by barraq on 26/05/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    'views/filmstrip/screen'
], function(Handlebars, Marionette, FilmstripScreenView){

    /**
     * Filmstrip screen view
     */
    var ScreensView = Marionette.CollectionView.extend({
        itemView: FilmstripScreenView
    });

    return ScreensView;
});