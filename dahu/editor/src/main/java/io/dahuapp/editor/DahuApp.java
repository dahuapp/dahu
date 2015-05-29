package io.dahuapp.editor;

import javafx.stage.Stage;

public interface DahuApp {
    /**
     * Get DahuApp primary stage.
     *
     * @return
     */
    public Stage getPrimaryStage();

    /**
     * Disable/Enable the app screencast menu.
     *
     * @param value True to disable, False to enable.
     */
    public void setDisableScreencastMenus(boolean value);
}
