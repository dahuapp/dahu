package io.dahuapp.editor.proxy;

import edu.stanford.ejalbert.BrowserLauncher;
import edu.stanford.ejalbert.exception.BrowserLaunchingInitializingException;
import edu.stanford.ejalbert.exception.UnsupportedOperatingSystemException;
import java.awt.Desktop;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import javafx.application.Platform;
import javafx.concurrent.Task;
import java.util.concurrent.Executors;
import java.util.concurrent.ExecutorService;

/**
 * Proxy used when a web browser needs to be opened.
 */
public class BrowserProxy implements Proxy {

    /**
     * Allows this proxy to open the default browser.
     */
    private Desktop desktop;
    /**
     * Alternative way to open a browser (Desktop is not supported on many linux
     * platforms).
     */
    private BrowserLauncher browserLauncher;

    /**
     * Runs the preview (opens the default web browser).
     *
     * @param htmlFile The absolute path to the html file to display.
     */
    public void runPreview(String htmlFile) {
        /*
         * The 'replaceAll' is a fix for windows.
         * The URI seems not to support strings with '\' so we replace all
         * of them by '/' otherwise a malformed URI exception is thrown.
         */
        final String urlString = "file://" + htmlFile.replaceAll("\\\\", "/");
        Platform.runLater(new Runnable() {
            @Override
            public void run() {
                openWebBrowser(urlString);
            }
        });
    }

    /**
     * Open the default web browser and open the specified URL.
     *
     * @param url Page to display on the browser.
     */
    public void openURL(final String url) {

        // We launch a new task using an executor service

        ExecutorService executorService = Executors.newFixedThreadPool(1);

        executorService.submit(new Task<Void>() {
            @Override protected Void call() throws Exception {
                openWebBrowser(url);
                return null;
            }
        });
    }

    /**
     * This method opens a web browser and loads the given URL into it.
     * Depending on the platform, a different method can be used to run the web
     * browser.
     *
     * @param url The URL to open.
     */
    private void openWebBrowser(String url) {
        if (desktop != null) {
            try {
                desktop.browse(new URL(url).toURI());
            } catch (URISyntaxException | IOException e) {
                LoggerProxy.severe("Browser couldn't be opened.", e);
            }
        } else if (browserLauncher != null) {
            browserLauncher.openURLinBrowser(url);
        } else {
            // Maybe add a message popup here
            LoggerProxy.severe("Browser driver not supported.");
        }
    }

    @Override
    public void onLoad() {
        if (Desktop.isDesktopSupported()) {
            desktop = Desktop.getDesktop();
        } else {
            try {
                browserLauncher = new BrowserLauncher();
            } catch (BrowserLaunchingInitializingException
                    | UnsupportedOperatingSystemException e) {
                LoggerProxy.severe("BrowserLauncher couldn't be opened.", e);
            }
        }
    }

    @Override
    public void onStop() {
        
    }
}
