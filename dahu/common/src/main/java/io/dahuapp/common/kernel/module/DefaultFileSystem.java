package io.dahuapp.common.kernel.module;

import io.dahuapp.common.kernel.Module;
import io.dahuapp.common.net.DahuFileAccessManager;
import io.dahuapp.driver.FileSystemDriver;
import io.dahuapp.driver.LoggerDriver;

import java.net.URL;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Created by barraq on 7/10/14.
 */
public class DefaultFileSystem implements Module {

    private DahuFileAccessManager dahuFileAccessManager;

    public final String FILE_SEPARATOR = FileSystemDriver.FILE_SEPARATOR;

    /**
     * Constructor
     *
     * @param fileAccessManager
     */
    public DefaultFileSystem(DahuFileAccessManager fileAccessManager) {
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

    public boolean copyResourceDir(String resource, String target) {
        try {
            // create and check URL
            URL resourceURL = new URL(resource);
            if (resourceURL.getProtocol().equals("classpath")) {
                // create classpath URL
                URL classpathResourceURL = getClass().getResource(resourceURL.getPath());

                // If URL is null then the resource does not exist!
                if (classpathResourceURL == null) {
                    throw new Exception("Resource " + resource + " does not exist.");
                }

                String jarFilePath = classpathResourceURL.getPath().substring(
                        classpathResourceURL.getPath().indexOf(":") + 1,
                        classpathResourceURL.getPath().indexOf("!"));
                String resourceName = resourceURL.getPath().startsWith("/") ? resourceURL.getPath().substring(1) : resourceURL.getPath();
                String targetPath = Paths.get(
                        target,
                        Paths.get(resource).getFileName().toString()).toString();

                // copy the resource *resourceName* from *jarFilePath* to *targetPath*.
                return FileSystemDriver.copyResourceDir(jarFilePath, resourceName, targetPath);
            }
        } catch (Exception e) {
            LoggerDriver.warn("Unsupported resources ({}).", resource);
        }

        // something went wrong
        return false;
    }

    public boolean copyDir(String source, String target) {
        return FileSystemDriver.copyDir(source, target);
    }

    public boolean mkdir(String dirname) {
        return FileSystemDriver.mkdir(dirname);
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
     * @param dirName Path of the directory to delete
     * @return  {@code true} if and only if the file or directory is
     *          successfully deleted; {@code false} otherwise.
     */
    public boolean removeDir(String dirName){
        boolean deleted = FileSystemDriver.rmdir(dirName, true);
        if (!deleted) {
            Path dahuProjectFilePath = Paths.get(dirName);
            LoggerDriver.error("Deletion of directory {} failed", dahuProjectFilePath.toAbsolutePath());
        }
        return deleted;
    }

    /**
     * Delete a file
     * @param fileName Path of the file to delete
     * @return  {@code true} if and only if the file or directory is
     *          successfully deleted; {@code false} otherwise.
     */
    public boolean removeFile(String fileName){
        boolean deleted = FileSystemDriver.delete(fileName);
        if (!deleted) {
            Path dahuProjectFilePath = Paths.get(fileName);
            LoggerDriver.error("Deletion of file {} failed", dahuProjectFilePath.toAbsolutePath());
        }
        return deleted;
    }
}
