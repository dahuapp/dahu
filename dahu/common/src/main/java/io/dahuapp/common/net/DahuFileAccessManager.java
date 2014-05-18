package io.dahuapp.common.net;


import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Manage file access for DahuFileURLStreamHandler.
 */
public class DahuFileAccessManager {

    Set<Path> allowedDirectories = new HashSet<>();

    public DahuFileAccessManager() {
        // empty constructor, no dahufile access allowed
    }

    public <T> DahuFileAccessManager(List<T> allowed) {
        allowed.forEach(path -> {
            if (path instanceof String) {
                allowedDirectories.add(Paths.get((String) path).toAbsolutePath());
            } else if( path instanceof Path) {
                allowedDirectories.add(((Path) path).toAbsolutePath());
            }
        });
    }

    /**
     * Add given path to allowed directories to access files from.
     *
     * @param pathToAdd
     */
    public void addAllowedDirectory(Path pathToAdd) {
        allowedDirectories.add(pathToAdd);
    }

    /**
     * Add given path to allowed directories to access files from.
     *
     * @param pathToAdd
     */
    public void addAllowedDirectory(String pathToAdd) {
        allowedDirectories.add(Paths.get(pathToAdd).toAbsolutePath());
    }

    /**
     * Remove all directories from allowed directories to access files from.
     */
    public void removeAllAllowedDirectories() {
        allowedDirectories.clear();
    }

    /**
     * Remove given path from allowed directories to access files from.
     */
    public void removeAllowedDirectory(Path pathToRemove) {
        allowedDirectories.removeIf(path -> path.equals(pathToRemove.toAbsolutePath()));
    }

    /**
     * Remove given path from allowed directories to access files from.
     */
    public void removeAllowedDirectory(String pathToRemove) {
        allowedDirectories.removeIf(path -> path.equals(Paths.get(pathToRemove).toAbsolutePath()));
    }

    /**
     * Return all allowed directories.
     * @return
     */
    public Set<Path> getAllowedDirectories() {
        return allowedDirectories;
    }
}
