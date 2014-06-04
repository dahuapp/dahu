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
 * Driver to take screenshots
 * This will also be used for compression etc.
 */
public class MediaDriver {

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

    public static boolean hasChanged(CaptureContext captureContext) {
        return !MouseInfo.getPointerInfo().getDevice().equals(captureContext.getGraphicsDevice());
    }

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

    public static class CaptureContext {
        private GraphicsDevice graphicsDevice;
        private Robot robot;
        private Rectangle bounds;
        private DisplayMode mode;

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
