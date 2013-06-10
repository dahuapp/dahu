package io.dahuapp.editor.proxy;

import io.dahuapp.editor.drivers.FileSystemDriver;
import java.io.File;
import javafx.stage.Stage;

/**
 * Proxy for the file system driver.
 */
public class FileSystemDriverProxy implements Proxy {
    
    /**
     * Main stage of the window (for modal dialogs).
     */
    private Stage primaryStage;
    
    /**
     * Driver associated with this proxy.
     */
    private FileSystemDriver driver = new FileSystemDriver();
    
    /**
     * Constructor.
     * @param primaryStage Main stage of the app (for modal dialogs).
     */
    public FileSystemDriverProxy(Stage primaryStage) {
        this.primaryStage = primaryStage;
    }
    
    @Override
    public void onLoad() {
        driver.onLoad();
    }

    @Override
    public void onStop() {
        driver.onStop();
    }

    /**
     * Create a file and write a text in it.
     *
     * @param filename The name of the file (with absolute path).
     * @param text The text to write in the file.
     * @return True if the file was created.
     */
    public boolean writeFile(String fileName, String text) {
        return driver.writeFile(fileName, text);
    }
    
    /**
     * Returns the file separator depending on the OS.
     * @return The file separator string (depends on the OS).
     */
    public String getSeparator() {
        return System.getProperty("file.separator");
    }

    /**
     * Read a file.
     *
     * @param fileName The name of the file (and absolute path).
     * @return String Returns the content of the file.
     */
    public String readFile(String fileName) {
        if (driver.exists(fileName)) {
            return driver.readFile(fileName);
        }
        LoggerProxy.warning("Unable to read file : " + fileName);
        return null;
    }

    /**
     * Let the user choose the project directory.
     *
     * @return The absolute path of the chosen directory.
     */
    public String askForProjectDir() {
        String dirName = driver.askForProjectDir(primaryStage);
        if (dirName == null) {
            return null;
        }
        if (!driver.exists(dirName)) {
            boolean created = driver.createDir(dirName);
            if (!created) {
                LoggerProxy.warning(getClass().getName(), "askForProjectDir",
                        "Unable to create directory : " + dirName);
                return null;
            }
        }
        return dirName;
    }

    /**
     * Returns a table containing the names of png files in a directory.
     *
     * @param dir The directory to analyse.
     * @return The list of png files (absolute pathnames).
     */
    public String[] getPngFiles(String dir) {
        return driver.getPngFiles(dir);
    }
    
    /**
     * Check the existence of the specified directory.
     * 
     * @param dir Directory to check for a new project.
     * @return True only if the directory exists.
     */
    public boolean exists(String dir) {
        return new File(dir).exists();
    }
    
    /**
     * Creates the specified directory.
     * 
     * @param dir Directory to create.
     * @return True only if the directory was created.
     */
    public boolean create(String dir) {
        return new File(dir).mkdirs();
    }
}