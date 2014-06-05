package io.dahuapp.editor.kernel.module;


import io.dahuapp.common.net.DahuFileAccessManager;
import io.dahuapp.driver.FileSystemDriver;
import io.dahuapp.common.kernel.Module;
import io.dahuapp.driver.LoggerDriver;
import javafx.stage.FileChooser;
import javafx.stage.Stage;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

/**
 * Filesystem kernel module.
 *
 * Use of JavaFX UI must only happen here.
 */
public class FileSystem implements Module {

    private Stage primaryStage;
    private DahuFileAccessManager dahuFileAccessManager;

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
     * @param primaryStage Main stage of the app (for modal dialogs).
     */
    public FileSystem(Stage primaryStage, DahuFileAccessManager fileAccessManager) {
        this.primaryStage = primaryStage;
        this.dahuFileAccessManager = fileAccessManager;
    }

    public boolean exists(String pathname) {
        return FileSystemDriver.exists(pathname);
    }

    public boolean writeToFile(String filename, String content) {
        return FileSystemDriver.writeToFile(filename, content);
    }

    public String readFromFile(String filename) {
        return FileSystemDriver.readFromFile(filename);
    }

    public boolean copyFile(String source, String target) {
        return FileSystemDriver.copyFile(source, target);
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

        File selectedFile = fileChooser.showOpenDialog(primaryStage);
        if (selectedFile != null) {
            return selectedFile.getAbsolutePath();
        }

        // otherwise return null
        return null;
    }

    /**
     * Grant access to Dahu project.
     * @todo Add some security checking:
     *  - does the file exists?
     *  - is it really a Dahu file project?
     *  - is not the access to permissive? (e.g. /home/project.dahu will grant access to all /home/ !
     *  - maybe only grant access to img directory inside dahu project is better!
     *
     * @param dahuProjectFilePathName
     */
    public void grantAccessToDahuProject(String dahuProjectFilePathName) {
        Path dahuProjectFilePath = Paths.get(dahuProjectFilePathName);
        Path dahuProjectDirPath = dahuProjectFilePath.getParent();
        LoggerDriver.info("Granting access to directory {}", dahuProjectDirPath.toAbsolutePath());
        dahuFileAccessManager.addAllowedDirectory(dahuProjectDirPath);
    }

    /**
     * Revoke access to Dahu project.
     *
     * @param dahuProjectFilePathName
     */
    public void revokeAccessToDahuProject(String dahuProjectFilePathName) {
        Path dahuProjectFilePath = Paths.get(dahuProjectFilePathName);
        Path dahuProjectDirPath = dahuProjectFilePath.getParent();
        LoggerDriver.info("Revoking access to directory {}", dahuProjectDirPath.toAbsolutePath());
        dahuFileAccessManager.removeAllowedDirectory(dahuProjectDirPath);
    }


    /**
     * Delete a directory
     * @param dahuProjectDirPathName Path of the directory to delete
     * @return  {@code true} if and only if the file or directory is
     *          successfully deleted; {@code false} otherwise.
     */
    public boolean removeDir(String dahuProjectDirPathName){
        boolean deleted = FileSystemDriver.rmdir(dahuProjectDirPathName, true);
        if (!deleted) {
            Path dahuProjectFilePath = Paths.get(dahuProjectDirPathName);
            LoggerDriver.error("Deletion of directory {} failed", dahuProjectFilePath.toAbsolutePath());
        }
        return deleted;
    }
}