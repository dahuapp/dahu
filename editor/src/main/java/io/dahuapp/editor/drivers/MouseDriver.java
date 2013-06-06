
package io.dahuapp.editor.drivers;

import java.awt.MouseInfo;
import java.awt.Point;

/**
 * 
 * Driver for the mouse.
 */
public class MouseDriver {
    
    /**
     * getter for the mouse position
     * @return The location of the mouse
     */
    public static Point getMouse() {
        return MouseInfo.getPointerInfo().getLocation();
    }
}
