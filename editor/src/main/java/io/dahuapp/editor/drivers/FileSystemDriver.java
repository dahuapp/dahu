package io.dahuapp.editor.drivers;

import io.dahuapp.editor.proxy.LoggerProxy;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import javafx.embed.swing.SwingFXUtils;
import javafx.scene.image.Image;
import javafx.stage.DirectoryChooser;
import javafx.stage.Window;
import javax.imageio.ImageIO;

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
     * Creates the specified directory.
     * 
     * @param dir Directory to create.
     * @return True only if the directory was created.
     */
    public boolean create(String dir) {
        File dirFile = new File(dir);
        if (dirFile.exists()) {
            return false;
        }
        return dirFile.mkdirs();
    }
    
    /**
     * Recursivly removes all the files and directories in the
     * specified directory (or simply removes the file if it's a file).
     * @param dir Directory to emtpy.
     * @return True only if the function ended well.
     */
    public boolean removeThisAndItsContent(File dir) {
        if (dir.isDirectory()) {
            boolean result = true;
            for (File f : dir.listFiles()) {
                result = result && removeThisAndItsContent(f);
            }
            return result && dir.delete();
        } else if (dir.isFile()) {
            return dir.delete();
        } else {
            return false;
        }
    }
    
    /**
     * Removes the specified file or directory.
     * @param fileName Directory or file to remove.
     * @return True only if the directory or file was removed.
     */
    public boolean remove(String fileName) {
        File file = new File(fileName);
        if (removeThisAndItsContent(file)) {
            LoggerProxy.info(getClass().getName(), "remove", fileName + " succesfully removed");
            return true;
        } else {
            LoggerProxy.severe(getClass().getName(), "remove", "failed to remove " + fileName);
            return false;
        }
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
     * @param parent Parent window (for modality).
     * @return The absolute path of the chosen directory.
     */
    public String askForProjectDir(Window parent) {
        // TO DO : check why it cause a pthread_mutex error
        //System.out.println(Platform.isFxApplicationThread()); // prints 'true'
        //File file = directoryChooser.showDialog(parent);
        //if (file == null) {
            return null;
        //}
        //return file.getAbsolutePath();
    }
    
    /**
     * Copies src file to dest.
     * @param src File to copy.
     * @param dest Destination file.
     * @return True only if the copy succeed.
     */
    public boolean copy(File src, File dest) {
        FileInputStream in;
        FileOutputStream out;
        try {
            in = new FileInputStream(src);
            out = new FileOutputStream(dest);
        } catch (FileNotFoundException e) {
            LoggerProxy.severe(getClass().getName(), "copy", e.getMessage(), e);
            return false;
        }
        int length;
        byte[] buffer = new byte[1024];
        try {
            while ((length = in.read(buffer)) > 0) {
                out.write(buffer, 0, length);
            }
            in.close();
            out.close();
        } catch (IOException e) {
            LoggerProxy.severe(getClass().getName(), "copy", e.getMessage(), e);
            return false;
        }
        LoggerProxy.info(getClass().getName(), "copy", "copy " + src + " to " + dest + " success");
        return true;
    }
    
    /**
     * Writes the specified image into the specified file.
     * @param image Image to write on a file.
     * @param dest File where to write the specified image.
     */
    public void writeImage(Image image, File dest) {
        String ext = dest.getName().replaceAll("^.*\\.", "");
        try {
            ImageIO.write(SwingFXUtils.fromFXImage(image, null), ext, dest);
        } catch (IOException ex) {
            LoggerProxy.severe(getClass().getName(), ex);
        }
    }

    @Override
    public void onLoad() {
    }

    @Override
    public void onStop() {
    }
}
