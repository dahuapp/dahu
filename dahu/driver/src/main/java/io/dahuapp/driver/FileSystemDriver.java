package io.dahuapp.driver;

import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

/**
 * FileSystem driver.
 *
 * Note: Filesystem driver must not make use of User Interface.
 * Filesystem driver's methods must only concern low level
 * functionalities. User interactions must be implemented in Kernel modules.
 */
public class FileSystemDriver {

    /**
     * Indicates if a specified file or directory exists.
     *
     * @param pathname A pathname string.
     * @return {@code true} if the file or directory exists; {@code false} otherwise.
     */
    static public boolean exists(String pathname) {
        File fileOrDir = new File(pathname);
        return fileOrDir.exists();
    }

    /**
     * Indicates if a specified pathname is a directory.
     *
     * @param pathname A pathname string.
     * @return {@code true} if the name is a directory; {@code false} otherwise.
     */
    static public boolean isDirectory(String pathname) {
        File dir = new File(pathname);
        return dir.isDirectory();
    }

    /**
     * Creates a directory by its abstract pathname.
     *
     * @param pathname A pathname.
     * @return True only if the directory was created.
     */
    static public boolean mkdir(String pathname) {
        File dir = new File(pathname);
        return dir.mkdirs();
    }

    /**
     * Delete a file from its pathname.
     *
     * @param pathname A pathname string.
     * @return  {@code true} if and only if the file or directory is
     *          successfully deleted; {@code false} otherwise
     */
    static public boolean delete(String pathname) {
        File file = new File(pathname);
        return file.delete();
    }

    /**
     * Deletes the directory denoted by this abstract pathname.  Unless recursive
     * is set to {@code true} the directory must be empty in order to be deleted.
     *
     * @param pathname A pathname string.
     * @param recursive True if recursive, False otherwise
     * @return  {@code true} if and only if the file or directory is
     *          successfully deleted; {@code false} otherwise.
     */
    static public boolean rmdir(String pathname, boolean recursive) {
        File dir = new File(pathname);
        return rmdir(dir, recursive);
    }

    /**
     * Deletes a directory. Unless recursive is set to <code>true</code>
     * the directory must be empty in order to be deleted.
     *
     * @param dir A directory.
     * @param recursive True if recursive, False otherwise
     * @return  {@code true} if and only if the file or directory is
     *          successfully deleted; {@code false} otherwise.
     */
    static public boolean rmdir(File dir, boolean recursive) {
        if(recursive) {
            boolean result = true;
            for (File fileOrDir : dir.listFiles()) {
                if(fileOrDir.isDirectory()) {
                    result = result && rmdir(fileOrDir, recursive);
                } else {
                    result = result && fileOrDir.delete();
                }
            }
            return result && dir.delete();
        } else {
            return dir.delete();
        }
    }

    /**
     * Writes content to a file. If the file does not exist it is
     * created.
     *
     * @param filename The name of the file to write.
     * @param content The content to be written.
     * @return {@code true} if content was successfully written;
     *         {@code false} otherwise.
     */
    static public boolean writeToFile(String filename, String content) {
        try {
            FileUtils.writeStringToFile(new File(filename), content);
            return true;
        } catch (IOException ex) {
            LoggerDriver.error("Unable to write content to {}.", filename);
            return false;
        }
    }

    /**
     * Reads and returns the content of a file.
     *
     * @param filename
     * @return {@code null} if unable to read the file; the file
     *         content otherwise.
     */
    static public String readFromFile(String filename) {
        try {
            return FileUtils.readFileToString(new File(filename));
        } catch (IOException ex) {
            return null;
        }
    }
}
