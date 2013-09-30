package io.dahuapp.editor.proxy;

import io.dahuapp.editor.app.DahuApp;
import io.dahuapp.editor.drivers.FileSystemDriver;
import java.awt.Dimension;
import java.io.File;
import java.io.FileFilter;
import java.net.MalformedURLException;
import javafx.scene.image.Image;
import javafx.stage.Stage;

/**
 * Proxy for the file system driver.
 */
public class FileSystemDriverProxy implements Proxy {
    
    /**
     * Name of the configuration file for the application.
     */
    private static final String CONFIGURATION_FILE_NAME = "config.json";
    
    /**
     * Name of the configuration directory (in the home directory).
     */
    private static final String CONFIGURATION_DIRECTORY_NAME = ".config/dahu";
    
    /**
     * Main stage of the window (for modal dialogs).
     */
    private Stage primaryStage;
    
    /**
     * Driver associated with this proxy.
     */
    private FileSystemDriver driver = new FileSystemDriver();
    
    /**
     * Filter to choose only supported image files.
     */
    private FileFilter imageFilter = new FileFilter() {
        @Override
        public boolean accept(File pathname) {
            return pathname.isFile() && pathname.getName().matches(".*\\.png$");
        }
    };
    
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
     * Writes the text in the configuration file.
     * 
     * @param text Json text to write (new configuration).
     * @return True if the file was writed.
     */
    public boolean writeConfigurationFile(String text) {
        /* Creation of configuration directory if it doesn't exist */
        String configDir = System.getProperty("user.home")
                + getSeparator() + CONFIGURATION_DIRECTORY_NAME;
        if (!driver.exists(configDir)) {
            if (!driver.create(configDir)) {
                return false;
            }
        }
        
        /* Write the file */
        String fileName = configDir + getSeparator() + CONFIGURATION_FILE_NAME;
        return driver.writeFile(fileName, text);
    }
    
    /**
     * Reads the configuration file and returns its content.
     * 
     * @return The content of the configuration file.
     */
    public String loadConfigurationFile() {
        return readFile(System.getProperty("user.home") + getSeparator()
                + CONFIGURATION_DIRECTORY_NAME + getSeparator()
                + CONFIGURATION_FILE_NAME);
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
            boolean created = driver.create(dirName);
            if (!created) {
                LoggerProxy.warning(getClass().getName(), "askForProjectDir",
                        "Unable to create directory : " + dirName);
                return null;
            }
        }
        return dirName;
    }
    
    /**
     * Check the existence of the specified directory.
     * 
     * @param dir Directory to check for a new project.
     * @return True only if the directory exists.
     */
    public boolean exists(String dir) {
        return driver.exists(dir);
    }
    
    /**
     * Creates the specified directory.
     * 
     * @param dir Directory to create.
     * @return True only if the directory was created.
     */
    public boolean create(String dir) {
        return driver.create(dir);
    }
    
    /**
     * Removes the specified directory or file.
     * @param fileName Directory or file to remove.
     * @return True only if the directory or file was removed.
     */
    public boolean remove(String fileName) {
        return driver.remove(fileName);
    }
    
    /**
     * Copies only the simple files from a directory to another.
     * @param src Directory containing the source files.
     * @param dest Directory where the copies will be placed.
     */
    public void copyDirectoryContent(String src, String dest) {
        File source = new File(src);
        File[] list = source.listFiles();
        if (list != null) {
            for (File f : list) {
                driver.copy(f, new File(dest + getSeparator() + f.getName()));
            }
        }
    }
    
    /**
     * Copies the .png images from a directory to another, and resizes them
     * with the specified ratio.
     * @param src Directory containing the images.
     * @param dest Directory where to put images (must exist).
     * @param width Required width of the images (can be null).
     * @param height Required height of the images (can be null).
     * @return The dimension of generated images.
     */
    public Dimension copyAndResizeImages(String src, String dest, int width, int height) {
        Dimension dimension = new Dimension(0, 0);
        File source = new File(src);
        try {
            for (File imgFile : source.listFiles(imageFilter)) {
                File destination = new File(dest + getSeparator() + imgFile.getName());
                String imageURL = imgFile.toURI().toURL().toString();
                Image image;
                if (width != 0 && height != 0) {
                    image = new Image(imageURL, width, height, false, true);
                } else if (width != 0 || height != 0) {
                    image = new Image(imageURL, width, height, true, true);
                } else {
                    image = new Image(imageURL);
                }
                dimension.width = (int)image.getWidth();
                dimension.height = (int)image.getHeight();
                driver.writeImage(image, destination);
            }
        } catch (MalformedURLException e) {
            LoggerProxy.severe("Malformed URL", e);
        }
        return dimension;
    }
    
    /**
     * Returns the dimension of a resized image.
     * @param path Path to an image.
     * @param width Width required.
     * @param height Height required.
     * @return Dimension of resized image.
     */
    public Dimension getResizedDimensions(String path, int width, int height) {
        try {
            String imageURL = new File(path).toURI().toURL().toString();
            Image image;
            if (width != 0 && height != 0) {
                image = new Image(imageURL, width, height, false, true);
            } else if (width != 0 || height != 0) {
                image = new Image(imageURL, width, height, true, true);
            } else {
                image = new Image(imageURL);
            }
            return new Dimension((int) image.getWidth(), (int) image.getHeight());
        } catch (MalformedURLException e) {
            LoggerProxy.severe("Malformed URL", e);
        }
        return null;
    }
    
    /**
     * Copies the file denoted by its pathname to another file.
     * @param src Name of the file to copy.
     * @param dest Name of the file where to put the copy.
     */
    public void copyFile(String src, String dest) {
        File source = new File(src);
        File destination = new File(dest);
        driver.copy(source, destination);
    }
    
    /**
     * Gets the path to a resource of the application.
     * @param name Name of the resource to find.
     * @return The path to the resource.
     */
    public String getResource(String name) {
        return DahuApp.getResource(name);
    }
}