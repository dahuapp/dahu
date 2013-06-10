package io.dahuapp.editor.proxy;

import io.dahuapp.editor.drivers.MouseDriver;

/**
 * Proxy for the Mouse Driver.
 */
public class MouseDriverProxy implements Proxy {

    /**
     * Driver associated with this proxy.
     */
    private MouseDriver driver = new MouseDriver();
    
    private double width = 0;
    private double height = 0;

    /**
     * Get abscissa of the mouse location in %
     *
     * @return the abscissa of the mouse location
     */
    public double getMouseX() {
        if (width == 0) {
            width = driver.getMouseMax().getX();
        }
        return (driver.getMouse().getX() / width);
    }

    /**
     * Get ordinate of the mouse location in %
     *
     * @return the ordinate of the mouse location
     */
    public double getMouseY() {
        if (height == 0) {
            height = driver.getMouseMax().getY();
        }
        return (driver.getMouse().getY() / height);
    }

    @Override
    public void onLoad() {
        driver.onLoad();
    }

    @Override
    public void onStop() {
        driver.onStop();
    }
}
