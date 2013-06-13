/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package io.dahuapp.editor.proxy;

import java.awt.Desktop;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import javafx.application.Platform;

/**
 *
 * @author denis
 */
public class PreviewProxy implements Proxy {

    /**
     * Allows this proxy to open the default browser.
     */
    private Desktop desktop;
    
    /**
     * Runs the preview (opens the default web browser).
     * @param htmlFile The absolute path to the html file to display.
     */
    public void runPreview(String htmlFile) {
        try {
            final URI u = new URI("file://" + htmlFile);
            Platform.runLater(new Runnable() {
                @Override
                public void run() {
                    try {
                        desktop.browse(u);
                    } catch (IOException  e) {
                        LoggerProxy.severe("Browser couldn't have been opened.", e);
                    }
                }
            });
        } catch (URISyntaxException e) {
            LoggerProxy.severe("Error in URI Syntax", e);
        }
    }
    
    @Override
    public void onLoad() {
        desktop = Desktop.getDesktop();
    }

    @Override
    public void onStop() {
        
    }
}
