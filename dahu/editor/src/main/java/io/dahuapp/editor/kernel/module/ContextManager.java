package io.dahuapp.editor.kernel.module;

import io.dahuapp.common.kernel.Module;
import io.dahuapp.editor.DahuApp;
import javafx.scene.control.MenuBar;
import javafx.scene.layout.BorderPane;
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
    private Stage primaryStage;
    private MenuBar menuBar;
    
    /**
     * 
     * @param primaryStage Stage of the JavaFX application containing the web view.
     */
    public ContextManager(Stage primaryStage) {
        this.primaryStage = primaryStage;
    }
    
    /**
     * Enable or disable full screen.
     * If the screen if already on fullscreen it is minimized.
     * Otherwise, it is maximized.
     */
    public void fullScreen() {
        boolean maximized = this.primaryStage.isMaximized();
        this.primaryStage.setMaximized(!maximized);
    }

    /**
     * Enable the menu items regarding the screencasting options (start/stop, generate, ...)
     * This will be called after a presentation has been opened.
     */
    public void setDisableScreencastMenus(boolean val) {
        this.primaryStage.getScene().lookup("#"+DahuApp.CAPTURE_MENU_ID).setDisable(val);
        this.primaryStage.getScene().lookup("#"+DahuApp.GENERATION_MENU_ID).setDisable(val);
    }
}
