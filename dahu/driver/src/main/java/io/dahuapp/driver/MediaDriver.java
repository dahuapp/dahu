package io.dahuapp.driver;

import javafx.application.Platform;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

/**
 * Media driver.
 *
 * Driver to take screenshots with AWT
 * This will also be used for compression etc.
 */
public class MediaDriver {

    /**
     * Take a screenshot and writes the new screen image in the project
     * directory.
     * @param captureContext A set of data for the screenshot
     * @param projectDir The project directory (absolute path).
     * @param id A unique if for the image
     * @return The name of the image created (or null if fail)
     */

    public static String takeScreen(CaptureContext captureContext, String projectDir, String id) {
        final BufferedImage capture = captureContext.getRobot().createScreenCapture(captureContext.getBounds());
        final String imageName = id + ".png";
        final String separator = System.getProperty("file.separator");
        final File imageFile = new File(projectDir + separator + imageName);
        try {
            if (ImageIO.write(capture, "png", imageFile)) {
                LoggerDriver.info(MediaDriver.class.getName(), "takeScreen",
                        "create png file " + imageName);
                return imageName;
            } else {
                LoggerDriver.error(MediaDriver.class.getName(), "takeScreen",
                        "fail to create " + imageName);
                return null;
            }
        } catch (IOException e) {
            LoggerDriver.error("Unable to write the image :", e);
            return null;
        }
    }


    /**
     * Tells if the screen data have changed (occurs when the mouse
     * went in another display).
     * @return True if the screen data must be updated.
     */
    public static boolean hasChanged(CaptureContext captureContext) {
        return !MouseInfo.getPointerInfo().getDevice().equals(captureContext.getGraphicsDevice());
    }

    /**
     * Load a set of data for the screenshot
     * @return An object containing the data
     */
    public static CaptureContext loadCaptureContext() {
        GraphicsDevice graphicsDevice = MouseInfo.getPointerInfo().getDevice();
        DisplayMode mode = graphicsDevice.getDisplayMode();
        Rectangle bounds = new Rectangle(0, 0, mode.getWidth(), mode.getHeight());
        Robot robot = null;
        try {
            robot = new Robot(graphicsDevice);
        } catch (AWTException e) {
            LoggerDriver.error("Unable to load java.awt.Robot.");
            Platform.exit();
        }
        return new CaptureContext(mode,graphicsDevice,robot,bounds);
    }


    /**
     * Set of data for the screen shots.
     */
    public static class CaptureContext {

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

        private CaptureContext(DisplayMode mode, GraphicsDevice graphicsDevice, Robot robot, Rectangle bounds) {
            this.mode = mode;
            this.graphicsDevice = graphicsDevice;
            this.robot = robot;
            this.bounds = bounds;
        }

        public GraphicsDevice getGraphicsDevice() {
            return graphicsDevice;
        }

        public Robot getRobot() {
            return robot;
        }

        public Rectangle getBounds() {
            return bounds;
        }

        public DisplayMode getMode() {
            return mode;
        }
    }

}
