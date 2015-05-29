package io.dahuapp.editor.kernel.module;


import io.dahuapp.common.kernel.module.DefaultFileSystem;
import io.dahuapp.common.net.DahuFileAccessManager;
import io.dahuapp.common.net.RegexURLRewriter;
import io.dahuapp.editor.DahuApp;
import javafx.stage.DirectoryChooser;
import javafx.stage.FileChooser;
import javafx.stage.Stage;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

/**
 * Filesystem kernel module.
 *
 * Use of JavaFX UI must only happen here.
 */
public class FileSystem extends DefaultFileSystem {

    private DahuApp dahuapp;

    /**
     * Available extension filters for FileChooser.
     */
    private Map<String, FileChooser.ExtensionFilter> extensionFilterMap = new HashMap<String, FileChooser.ExtensionFilter>() {
        {
            put("allFiles", new FileChooser.ExtensionFilter("All Files", "*.*"));
            put("dahuProjectFile", new FileChooser.ExtensionFilter("Dahu Project", "*.dahu"));
        }
    };
    
    /**
     * Constructor.
     */
    public FileSystem(DahuApp app, DahuFileAccessManager fileAccessManager, RegexURLRewriter rewriter) {
        super(fileAccessManager, rewriter);
        this.dahuapp = app;
    }

    /**
     * Ask user to select a file according to some file filters.
     *
     * Note: due to a bug (see https://javafx-jira.kenai.com/browse/RT-37171)
     * it is not possible to pass String[] from Javascript.
     * Filters are then join in a string and separated with coma.
     * @todo change this as soon the bug is solved.
     *
     * @param actionTitle Title of the action that will be displayed to the user.
     * @param filterNames Filter names to use in this action.
     * @return a string path to the file if everything is fine, null otherwise.
     */
    public String getFileFromUser(String actionTitle, String filterNames) {
        FileChooser fileChooser = new FileChooser();
        fileChooser.setTitle(actionTitle);

        for(String filterName : filterNames.trim().split(",")) {
            if(extensionFilterMap.containsKey(filterName)) {
                fileChooser.getExtensionFilters().add(extensionFilterMap.get(filterName));
            }
        }

        File selectedFile = fileChooser.showOpenDialog(this.dahuapp.getPrimaryStage());
        if (selectedFile != null) {
            return normalized(selectedFile.getAbsolutePath());
        }

        // otherwise return null
        return null;
    }

    /**
     * Ask user to select a directory.
     *
     * @param actionTitle Title of the action that will be displayed to the user.
     * @return a string path to the directory if everything is fine, null otherwise.
     */
    public String getDirectoryFromUser(String actionTitle) {
        DirectoryChooser directoryChooser = new DirectoryChooser();
        directoryChooser.setTitle(actionTitle);

        File selectedDir = directoryChooser.showDialog(this.dahuapp.getPrimaryStage());
        if (selectedDir != null) {
            return normalized(selectedDir.getAbsolutePath());
        }

        // otherwise return null
        return null;
    }
}
