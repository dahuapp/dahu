package io.dahuapp.editor.proxy;

import java.awt.Desktop;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import javafx.application.Platform;

/**
 * Proxy used when a web browser needs to be opened.
 */
public class BrowserProxy implements Proxy {

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
            /* 
             * The 'replaceAll' is a fix for windows.
             * The URI seems not to support strings with '\' so we replace all
             * of them by '/' otherwise a malformed URI exception is thrown.
             */
            final URI u = new URI("file://" + htmlFile.replaceAll("\\\\", "/"));
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
    
    /**
     * Open the default web browser and open the specified URL.
     * @param url Page to display on the browser.
     */
    public void openURL(final String url) {
        Platform.runLater(new Runnable() {
            @Override
            public void run() {
                try {
                    desktop.browse(new URL(url).toURI());
                } catch (URISyntaxException | IOException e) {
                    LoggerProxy.severe("Browser couldn't have been opened.", e);
                }
            }
        });
    }
    
    @Override
    public void onLoad() {
        desktop = Desktop.getDesktop();
    }

    @Override
    public void onStop() {
        
    }
}
