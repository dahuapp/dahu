package io.dahuapp.editor.drivers;

import java.awt.MouseInfo;
import java.awt.Point;

/**
 *
 * Driver for the mouse.
 */
public class MouseDriver implements Driver {

    /**
     * getter for the mouse position
     *
     * @return The location of the mouse
     */
    public Point getMouse() {
        return MouseInfo.getPointerInfo().getLocation();
    }

    @Override
    public void onLoad() {
    }

    @Override
    public void onStop() {
    }
}
