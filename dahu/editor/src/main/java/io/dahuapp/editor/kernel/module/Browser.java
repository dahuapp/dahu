package io.dahuapp.editor.kernel.module;

import io.dahuapp.common.kernel.Module;
import io.dahuapp.driver.LoggerDriver;

import java.awt.Desktop;
import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Proxy used when a web browser needs to be opened.
 */

public class Browser implements Module {
    
    /**
     * Executor service to run the preview.
     */
    private ExecutorService runPreviewExecutor;

    /**
     * Runs the preview (opens the default web browser).
     *
     * @param htmlFile The absolute path to the HTML file to display.
     */
    public void runPreview(String htmlFile) {
        /*
         * The 'replaceAll' is a fix for windows.
         * The URI seems not to support strings with '\' so we replace all
         * of them by '/' otherwise a malformed URI exception is thrown.
         */
        openURL("file://" + htmlFile.replaceAll("\\\\", "/"));
    }

    /**
     * Open the default web browser with the specified URL.
     *
     * @param url URL to open in the browser.
     */
    public void openURL(final String url) {
        runPreviewExecutor.submit(() -> openWebBrowser(url));
    }
    
    /**
     * Open the URL in the default web browser.
     * This function must be called from a dedicated thread.
     * 
     * @param url URL to open in the browser.
     */
    private void openWebBrowser(String url) {
        if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
            try {
                Desktop.getDesktop().browse(new URL(url).toURI());
            } catch (URISyntaxException | IOException e) {
                LoggerDriver.error("Browser (with 'java.awt.Desktop') couldn't be opened.", e);
            } catch (Exception e) {
                LoggerDriver.error("Something happenned : "+e.getClass()+e.getMessage());
            }
        } else if ((new File("/usr/bin/xdg-open").exists() || new File("/usr/local/bin/xdg-open").exists())) {
        // Work-around to support non-GNOME Linux desktop environments with xdg-open installed,
        // so we can get the default application o nthose systems.
        // We should probably also check if the OS is an UNIX environment...
            try {
                new ProcessBuilder("xdg-open", url).start();
            } catch (IOException ex) {
                LoggerDriver.error("Runtime browser couldn't be opened.", ex);
            }
        } else {
            LoggerDriver.error("No browser driver available.");
        }

    }

    @Override
    public void load() {
        runPreviewExecutor = Executors.newSingleThreadExecutor();
        if (!Desktop.isDesktopSupported()) {
            LoggerDriver.error("No browser driver available.");
        }
    }

    @Override
    public void unload() {
        runPreviewExecutor.shutdownNow();
        try {
            if (!runPreviewExecutor.awaitTermination(1, TimeUnit.SECONDS)) {
                LoggerDriver.error("<Run preview> thread may still be running.");
            }
        } catch (InterruptedException e) {
            LoggerDriver.error("<Run preview> thread may still be running.");
        }
    }
}
