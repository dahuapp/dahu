package io.dahuapp.editor.drivers;

import java.awt.AWTException;
import java.awt.DisplayMode;
import java.awt.GraphicsDevice;
import java.awt.GraphicsEnvironment;
import java.awt.Rectangle;
import java.awt.Robot;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import javax.imageio.ImageIO;

/**
 * Driver to take a screenshot with AWT.
 *
 * @author jeremy
 */
public class ScreenDriver implements Driver {

    private GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
    private GraphicsDevice[] gs = ge.getScreenDevices();
    private FilenameFilter pngFilter = new FilenameFilter() {
        @Override
        public boolean accept(File dir, String name) {
            return name.matches(".*\\.png$");
        }
    };

    /**
     * Take a screenshot and writes the new screen image in the project
     * directory.
     *
     * @param projectDir The project directory (name).
     * @return The name of the image created (or null if fail).
     */
    public String takeScreen(String projectDir) {
        Robot robot = null;
        BufferedImage image;
        File dirFile;
        final int count;
        final String fileSep;
        final String fileName;
        final File imageFile;

        try {
            robot = new Robot(gs[gs.length - 1]);
        } catch (AWTException e) {
            System.out.println("Failed to create screenshot: " + e.getMessage());
            System.exit(-1);
        }
        DisplayMode mode = gs[0].getDisplayMode();
        Rectangle bounds = new Rectangle(0, 0, mode.getWidth(), mode.getHeight());
        if (robot == null) {
            return null; //NON? 
        } else {
            image = robot.createScreenCapture(bounds);
        }

        try {
            dirFile = new File(projectDir);

            count = dirFile.listFiles(pngFilter).length + 1;

            // returns the file separator for this platform (unix or windows eg)
            fileSep = System.getProperty("file.separator");
            fileName = "screen" + count + ".png";
            imageFile = new File(projectDir + fileSep + fileName);
            if (ImageIO.write(image, "png", imageFile)) {
                return fileSep;
            } else {
                return null;
            }
        } catch (IOException e) {
            return null;
        }
    }

    @Override
    public void onLoad() {
        System.out.println(this.getClass() + " loaded.");
    }

    @Override
    public void onStop() {
        System.out.println(this.getClass() + " stopped.");
    }
}
