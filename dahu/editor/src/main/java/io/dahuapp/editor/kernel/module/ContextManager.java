package io.dahuapp.editor.kernel.module;

import io.dahuapp.common.kernel.Module;
import io.dahuapp.editor.DahuApp;
import io.dahuapp.editor.DahuAppImpl;
import javafx.scene.control.MenuBar;
import javafx.stage.Stage;

/** 
 * ContextManager kernel module.
 * 
 * Used to interact with the JavaFX application containing the web view.
 * @author coutinju
 */
public class ContextManager implements Module {
    /**
     * Stage of the javaFX application containing the web view
     */
    private DahuApp dahuapp;

    public ContextManager(DahuApp app) {
        this.dahuapp = app;
    }
    
    /**
     * Enable or disable full screen.
     * If the screen if already on fullscreen it is minimized.
     * Otherwise, it is maximized.
     */
    public void fullScreen() {
        boolean maximized = this.dahuapp.getPrimaryStage().isMaximized();
        this.dahuapp.getPrimaryStage().setMaximized(!maximized);
    }

    /**
     * Enable the menu items regarding the screencasting options (start/stop, generate, ...)
     * This will be called after a presentation has been opened.
     *
     * @param value True to disable, False to enable.
     */
    public void setDisableScreencastMenus(boolean value) {
        this.dahuapp.setDisableScreencastMenus(value);
    }
}
