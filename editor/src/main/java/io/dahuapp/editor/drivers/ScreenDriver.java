package io.dahuapp.editor.drivers;

import io.dahuapp.editor.proxy.LoggerProxy;
import java.awt.AWTException;
import java.awt.DisplayMode;
import java.awt.GraphicsDevice;
import java.awt.MouseInfo;
import java.awt.Rectangle;
import java.awt.Robot;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.UUID;
import javafx.application.Platform;
import javax.imageio.ImageIO;

/**
 * Driver to take a screenshot with AWT.
 */
public class ScreenDriver implements Driver {
    
    /**
     * Memorises the screen data to avoid recalculating it for each
     * screen capture.
     */
    private ScreenData screenData;
    
    /**
     * Memorises the file separator string for this OS.
     */
    private final String fileSep = System.getProperty("file.separator");

    /**
     * Take a screenshot and writes the new screen image in the project
     * directory.
     *
     * @param projectDir The project directory (absolute path).
     * @return The name of the image created (or null if fail).
     */
    public String takeScreen(String projectDir) {
        final BufferedImage capture = screenData.getCapture();
        final String imageName = UUID.randomUUID().toString() + ".png";
        final File imageFile = new File(projectDir + fileSep + imageName);
        try {
            if (ImageIO.write(capture, "png", imageFile)) {
                LoggerProxy.info(getClass().getName(), "takeScreen", 
                        "create png file " + imageName);
                return imageName;
            } else {
                LoggerProxy.severe(getClass().getName(), "takeScreen", 
                        "fail to create " + imageName);
                return null;
            }
        } catch (IOException e) {
            LoggerProxy.severe("Unable to write the image :", e);
            return null;
        }
    }

    @Override
    public void onLoad() {
        screenData = new ScreenData();
    }

    @Override
    public void onStop() {
    }
    
    /**
     * Set of data for the screen shots.
     */
    private static final class ScreenData {
        
        /**
         * Graphics device, represents the graphic device to capture.
         */
        private GraphicsDevice graphicsDevice;
        
        /**
         * Display mode, allows to get screen width and height.
         */
        private DisplayMode mode;
        
        /**
         * Rectangle representing the area of screen to capture.
         */
        private Rectangle bounds;
        
        /**
         * Robot used to take the screen shot.
         */
        private Robot robot;
        
        /**
         * Constructor.
         */
        public ScreenData() {
            load();
        }
        
        /**
         * Loads the data in the screendata (to do if the screen has
         * changed, can be determined by the method hasChanged).
         */
        private void load() {
            graphicsDevice = MouseInfo.getPointerInfo().getDevice();
            mode = graphicsDevice.getDisplayMode();
            bounds = new Rectangle(0, 0, mode.getWidth(), mode.getHeight());
            try {
                robot = new Robot(graphicsDevice);
            } catch (AWTException e) {
                LoggerProxy.severe("Unable to load java.awt.Robot.");
                Platform.exit();
            }
        }
        
        /**
         * Tells if the screen data have changed (occurs when the mouse
         * went in another display).
         * @return True if the screen data must be updated.
         */
        private boolean hasChanged() {
            return !MouseInfo.getPointerInfo().getDevice().equals(graphicsDevice);
        }
        
        /**
         * Returns a capture from the specified area of the screen
         * (specified by the attribute <i>bounds</i>).
         */
        public BufferedImage getCapture() {
            if (hasChanged()) {
                load();
            }
            return robot.createScreenCapture(bounds);
        }
    }
}
