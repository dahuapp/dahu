package io.dahuapp.editor.drivers;

import io.dahuapp.editor.proxy.LoggerProxy;
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
        // take a screen capture
        final DisplayMode mode = gs[0].getDisplayMode();
        final Rectangle bounds = new Rectangle(0, 0, mode.getWidth(), mode.getHeight());
        final BufferedImage capture = captureScreen(bounds);
        
        // writes the buffered image on disk
        final File dirFile = new File(projectDir);
        final int count = dirFile.listFiles(pngFilter).length + 1;
        // returns the file separator for this platform (unix or windows eg)
        final String fileSep = System.getProperty("file.separator");
        final String fileName = projectDir + fileSep + "screen" + count + ".png";
        try {
            if (ImageIO.write(capture, "png", new File(fileName))) {
                LoggerProxy.info(getClass().getName(), "takeScreen", 
                        "create png file " + fileName);
                return fileName;
            } else {
                LoggerProxy.severe(getClass().getName(), "takeScreen", 
                        "fail to create " + fileName);
                return null;
            }
        } catch (IOException e) {
            LoggerProxy.severe("Unable to write the image :", e);
            return null;
        }
    }

    /**
     * Captures the screen and returns a buffered image containing the screen.
     * @return The image taken.
     */
    private BufferedImage captureScreen(Rectangle bounds) {
        Robot robot = null;
        try {
            robot = new Robot(gs[gs.length - 1]);
        } catch (AWTException e) {
            System.out.println("Failed to create screenshot: " + e.getMessage());
            System.exit(-1);
        }
        return (robot == null) ? null : robot.createScreenCapture(bounds);
    }

    @Override
    public void onLoad() {
    }

    @Override
    public void onStop() {
    }
}
