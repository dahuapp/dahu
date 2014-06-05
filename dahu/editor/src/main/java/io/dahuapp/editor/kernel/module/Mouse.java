package io.dahuapp.editor.kernel.module;

import io.dahuapp.driver.MouseDriver;
import io.dahuapp.common.kernel.Module;

/**
 * Mouse Kernel module.
 */
public class Mouse implements Module {

    private double width = 0;
    private double height = 0;

    /**
     * Get abscissa of the mouse location in %
     * @return the abscissa of the mouse location
     */
    public double getMouseX() {
        if (width == 0) {
            width = MouseDriver.getScreenSize().getX();
        }
        return (MouseDriver.getMouse().getX() / width);
    }

    /**
     * Get ordinate of the mouse location in %
     * @return the ordinate of the mouse location
     */
    public double getMouseY() {
        if (height == 0) {
            height = MouseDriver.getScreenSize().getY();
        }
        return (MouseDriver.getMouse().getY() / height);
    }
	
}