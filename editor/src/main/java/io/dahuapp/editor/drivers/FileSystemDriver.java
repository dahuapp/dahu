package io.dahuapp.editor.drivers;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileWriter;
import java.io.FilenameFilter;
import java.io.IOException;
import javafx.stage.DirectoryChooser;
import javax.imageio.ImageIO;

/**
 *
 * @author jeremy
 */
public class FileSystemDriver implements Driver {

    private File file;
    private DirectoryChooser directoryChooser = new DirectoryChooser();
    private FilenameFilter pngFilter = new FilenameFilter() {
        @Override
        public boolean accept(File dir, String name) {
            return name.matches(".*\\.png$");
        }
    };

    /**
     * @param name Name of the directory.
     * @return True if the directory is created.
     */
    public boolean createDir(String name) {
        File dir = new File(name);
        return dir.mkdir();
    }

    /**
     * Create a file and write a text in it
     *
     * @param filename The name of the file and its pathname.
     * @param text The text to write in the file.
     * @return True if the file was created.
     */
    public boolean createFile(String fileName, String text) {
        try {
            FileWriter fw = new FileWriter(fileName, true);
            fw.write(text);
            fw.close();
            return true;
        } catch (IOException e) {
            return false;
        }
    }

    /**
     * Writes the new screen image in the project directory.
     *
     * @param image The image to write.
     * @param projectDir The project directory (name).
     * @return The name of the image created (or null if fail).
     */
    public String writeImage(BufferedImage image, String projectDir) {
        try {
            File dirFile = new File(projectDir);

            FilenameFilter png = new FilenameFilter() {
                @Override
                public boolean accept(File dir, String name) {
                    return name.matches(".*\\.png$");
                }
            };

            final int count = dirFile.listFiles(png).length + 1;

            // returns the file separator for this platform (unix or windows eg)
            final String fileSep = System.getProperty("file.separator");
            final String fileName = "screen" + count + ".png";
            final File imageFile = new File(projectDir + fileSep + fileName);
            if (ImageIO.write(image, "png", imageFile)) {
                return fileSep;
            } else {
                return null;
            }
        } catch (IOException e) {
            return null;
        }
    }

    /**
     * Let the user choose the project directory.
     *
     * @return The path of the chosen directory.
     */
    public String getDir() {

        this.file = directoryChooser.showDialog(null);

        return file.getAbsolutePath() + "/";
    }

    /**
     * Add all files of the directory in a file and return it.
     * 
     * @param projectDir
     * @return The list of files.
     */
    public String[] getFiles(String projectDir) {
        try {
            File dirFile = new File(projectDir);
            int nbFiles = dirFile.listFiles(pngFilter).length;
            String[] listFiles = new String[nbFiles];
            for (int i = 0; i < nbFiles; i++) {

                listFiles[i] = dirFile.listFiles()[i].getPath();
            }
            return listFiles;
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public void onLoad() {
    }

    @Override
    public void onStop() {
    }
}
