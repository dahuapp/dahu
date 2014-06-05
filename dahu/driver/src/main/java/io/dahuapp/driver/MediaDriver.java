package io.dahuapp.driver;

import javafx.application.Platform;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;

/**
 * Media driver.
 *
 * Driver to take screenshots with AWT
 * This will also be used for compression etc.
 */
public class MediaDriver {

    private static String SCREEN_IMAGE_EXT = "png";

    /**
     * Take a screen capture and write the captured screen image
     * in the project directory.
     *
     * @param captureContext A set of data for the screenshot
     * @param projectDir The project directory (absolute path).
     * @param imageId A unique if for the image
     * @return A capture if successful; null otherwise
     */
    public static Capture takeCapture(CaptureContext captureContext, String projectDir, String imageId) {
        final String imageName = imageId + "." + SCREEN_IMAGE_EXT;

        // capture the screen and the cursor
        final BufferedImage screenCapture = captureContext.getRobot().createScreenCapture(captureContext.getBounds());
        final Dimension screenDimension = Toolkit.getDefaultToolkit().getScreenSize();
        final Point cursorCapture = MouseInfo.getPointerInfo().getLocation();

        try {
            File imageFile = Paths.get(projectDir, imageName).toFile();
            if (ImageIO.write(screenCapture, SCREEN_IMAGE_EXT, imageFile)) {
                LoggerDriver.info(MediaDriver.class.getName(), "takeScreen", "create png file {}", imageName);
            } else {
                LoggerDriver.error(MediaDriver.class.getName(), "takeScreen", "fail to create {}", imageName);
                return null;
            }
        } catch (IOException e) {
            LoggerDriver.error("Unable to write the image {} on the filesystem at {}. {}",
                    imageName,
                    projectDir,
                    e.getMessage());
            return null;
        }

        return new Capture(imageName, screenDimension, cursorCapture);
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
     * Hold the result of a capture
     */
    public static class Capture {
        // The filename of the screen captured
        public String screen;
        // The screen size
        public Dimension screenSize;
        // The cursor position
        public Point cursor;

        public Capture(String screen, Dimension screenSize, Point cursor) {
            this.screen = screen;
            this.screenSize = screenSize;
            this.cursor = cursor;
        }

        public double getMouseX() {
            return cursor.getX() / screenSize.getWidth();
        }

        public double getMouseY() {
            return cursor.getY() / screenSize.getHeight();
        }
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
