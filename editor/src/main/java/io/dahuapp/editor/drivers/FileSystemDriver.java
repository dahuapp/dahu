package io.dahuapp.editor.drivers;

import io.dahuapp.editor.proxy.LoggerProxy;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.FilenameFilter;
import java.io.IOException;
import javafx.stage.DirectoryChooser;

/**
 * Driver of file system. Writes data to files on disk, or read data from files
 * or directories.
 */
public class FileSystemDriver implements Driver {

    /**
     * Directory chooser used in case of opening an other project. Can be
     * replaced if we choose a specific format for our projects. At the moment,
     * our projects are just stored in simple directories.
     */
    private DirectoryChooser directoryChooser = new DirectoryChooser();
    
    /**
     * File filter to choose only png files.
     */
    private FilenameFilter pngFilter = new FilenameFilter() {
        @Override
        public boolean accept(File dir, String name) {
            return name.matches(".*\\.png$");
        }
    };

    /**
     * Creates a directory.
     *
     * @param name Name of the directory.
     * @return True if the directory is created.
     */
    public boolean createDir(String name) {
        File dir = new File(name);
        if (dir.mkdirs()) {
            LoggerProxy.fine(this.getClass().getName(), "createDir",
                    name + " directory created");
            return true;
        } else {
            LoggerProxy.severe(this.getClass().getName(), "createDir",
                    "failed to create directory " + name);
            return false;
        }
    }

    /**
     * Indicates if a specified file or directory exists.
     *
     * @param name The name of the file (absolute or relative).
     * @return True if the file or directory exists.
     */
    public boolean exists(String name) {
        File dir = new File(name);
        return dir.exists();
    }

    /**
     * Create a file and write a text in it.
     *
     * @param filename The name of the file (and absolute path).
     * @param text The text to write in the file.
     * @return True if the file was created.
     */
    public boolean writeFile(String fileName, String text) {
        try {
            FileWriter fw = new FileWriter(fileName, false);
            fw.write(text);
            fw.close();
            LoggerProxy.info(getClass().getName(), "writeFile",
                    "file " + fileName + " created");
            return true;
        } catch (IOException e) {
            LoggerProxy.severe(getClass().getName(), "writeFile", "Unable to write file: " + fileName, e.getCause());
            return false;
        }
    }

    /**
     * Read a file.
     *
     * @param fileName The name of the file (and absolute path).
     * @return String Returns the content of the file.
     */
    public String readFile(String fileName) {
        String stringFile = "";
        try {
            BufferedReader br = new BufferedReader(new FileReader(fileName));
            String line = br.readLine();
            while (line != null) {
                stringFile += line;
                line = br.readLine();
            }
            LoggerProxy.info(getClass().getName(), "readFile",
                    "file " + fileName + " read");
            return stringFile;
        } catch (IOException e) {
            LoggerProxy.severe(getClass().getName(), "readFile", "Unable to read file: " + fileName, e.getCause());
            return null;
        }
    }

    /**
     * Let the user choose the project directory.
     *
     * @return The absolute path of the chosen directory.
     */
    public String askForProjectDir() {
        File file = directoryChooser.showDialog(null);
        return file.getAbsolutePath();
    }

    /**
     * Returns a table containing the names of png files in a directory.
     *
     * @param dir The directory to analyse.
     * @return The list of png files (absolute pathnames).
     */
    public String[] getPngFiles(String dir) {
        File dirFile = new File(dir).getAbsoluteFile();
        return dirFile.list(pngFilter);
    }

    @Override
    public void onLoad() {
    }

    @Override
    public void onStop() {
    }
}
