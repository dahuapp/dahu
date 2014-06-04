package io.dahuapp.driver;

import java.awt.MouseInfo;
import java.awt.Point;
import java.awt.Toolkit;

/**
 * Mouse driver.
 */
public class MouseDriver {

    /**
     * getter for the mouse position
     * @return the location of the mouse
     */
    static public Point getMouse() {
        return MouseInfo.getPointerInfo().getLocation();
    }

    /**
     * getter for the screen size
     * @return the screen size
     */
    static public Point getScreenSize() {
        return new Point(Toolkit.getDefaultToolkit().getScreenSize().width,
                Toolkit.getDefaultToolkit().getScreenSize().height);
    }

}