package io.dahuapp.editor.proxy;

import io.dahuapp.editor.app.DahuApp;
import io.dahuapp.editor.drivers.FileSystemDriver;
import java.awt.Dimension;
import java.io.File;
import java.io.FileFilter;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Iterator;
import java.util.logging.Level;
import java.util.logging.Logger;
import javafx.scene.image.Image;
import javafx.stage.Stage;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;

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
        String dirName = driver.getFileFromUser(primaryStage, actionTitle, filterNames);
        return dirName;
    }

    /**
     * Ask user to select a directory.
     *
     * @param actionTitle Title of the action that will be displayed to the user.
     * @return a string path to the directory if everything is fine, null otherwise.
     */
    public String getDirectoryFromUser(String actionTitle) {
        String dirName = driver.getDirectoryFromUser(primaryStage, actionTitle);
        return dirName;
    }


    /**
     * Check the existence of the specified file or directory.
     * 
     * @param name File or directory to check for a new project.
     * @return True only if the file or directory exists.
     */
    public boolean exists(String name) {
        return driver.exists(name);
    }
    
    /**
     * Indicates if a specified path is a directory.
     *
     * @param name The name of the directory (absolute or relative).
     * @return True if the name is a directory.
     */
    public boolean isDirectory(String name) {
        return driver.isDirectory(name);
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
                try {
                    driver.copy(new URL(f.getAbsolutePath()), new File(dest + getSeparator() + f.getName()));
                } catch (MalformedURLException ex) {
                    LoggerProxy.severe("Malformed URL", ex);
                }
            }
        }
    }

    /**
     * Get the image dimensions without reading it entirely
     * @return The dimension of the readen image
     */
    private Dimension getDimensionImage(File resourceFile) throws IOException {
        ImageInputStream in = ImageIO.createImageInputStream(resourceFile);
        if (in != null) {
            try {
                final Iterator<ImageReader> readers = ImageIO.getImageReaders(in);
                if (readers.hasNext()) {
                    ImageReader reader = readers.next();
                    try {
                        reader.setInput(in);
                        return new Dimension(reader.getWidth(0), reader.getHeight(0));
                    } finally {
                        reader.dispose();
                    }
                }
            } finally {
                if (in != null) in.close();
            }
        }
        return null;
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
                Dimension sourceDimension = getDimensionImage(imgFile);
                if (sourceDimension == null){
                    continue;
                }
                String destinationName = dest + getSeparator() + imgFile.getName();
                File destination = new File(destinationName);
                if (sourceDimension.width == width && sourceDimension.height == height){
                    dimension.width = width;
                    dimension.height = height;
                    copyFile(imgFile, destination);
                } else {
                    String imageURL = imgFile.toURI().toURL().toString();
                    Image image;
                    if (width != 0 && height != 0) {
                        image = new Image(imageURL, width, height, false, true);
                    } else if (width != 0 || height != 0) {
                        image = new Image(imageURL, width, height, true, true);
                    } else {
                        image = new Image(imageURL);
                    }
                    dimension.width = (int) image.getWidth();
                    dimension.height = (int) image.getHeight();
                    driver.writeImage(image, destination);
                }
            }
        } catch (MalformedURLException e) {
            LoggerProxy.severe("Malformed URL", e);
        } catch (IOException e) {
            e.printStackTrace();
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
        try {
            URL source = new URL(src);
            File destination = new File(dest);
            driver.copy(source, destination);
        } catch (MalformedURLException ex) {
            LoggerProxy.severe("Malformed URL", ex);
        }
    }

    /**
     * Copies the file denoted by its pathname to another file.
     * @param src Name of the file to copy.
     * @param destination File where to put the copy.
     */
    private void copyFile(File src, File destination) {
        try {
            driver.copy(src, destination);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    /**
     * Gets the path to a resource of the application.
     * @param name Name of the resource to find.
     * @return The path to the resource.
     */
    public String getResource(String name) {
        return DahuApp.getResource(name);
    }

    /**
     * Move src file to destDirPath.
     * @param src Name of the file to move
     * @param destDirPath Destination directory.
     * @return True only if the move succeed.
     */
    public void move(String src, String destDirPath) {
        driver.move(new File(src), destDirPath);
    }
}