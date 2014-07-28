package io.dahuapp.common.javascript;

import javafx.scene.web.WebEngine;
import netscape.javascript.JSObject;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;

import java.io.IOException;
import java.io.InputStream;

/**
 * Implementation of JavascriptRuntime for WebEngine.
 */
public class WebEngineRuntime implements JavascriptRuntime<JSObject> {

    protected WebEngine engine;
    protected boolean isFirebugLiteLoaded;

    /**
     * Constructor
     *
     * @param engine
     */
    public WebEngineRuntime(WebEngine engine) {
        this.engine = engine;

        // enable JavaScript
        engine.setJavaScriptEnabled(true);
    }

    @Override
    public Object executeScriptFile(String path) {
        return executeScriptCommand(slurp(path));
    }

    @Override
    public Object executeScriptCommand(String command) {
        Object returnValue = engine.executeScript(command);

        if (returnValue instanceof String && returnValue.equals("undefined")) {
            return null;
        }

        return returnValue;
    }

    @Override
    public JSObject get(String key) {
        Object returnValue = engine.executeScript(key);

        if (returnValue instanceof JSObject) {
            return (JSObject) returnValue;
        }

        return null;
    }

    /**
     * Load local FirebugLite.
     *
     * @return {@code true} if FirebugLite was loaded; {@code false} otherwise.
     */
    public boolean loadFirebugLite() {
        return loadFirebugLite(true, false);
    }

    /**
     * Load FirebugLite.
     *
     * @param localVersion {@code true} if local version should be loaded; {@code false} otherwise.
     * @return {@code true} if FirebugLite was loaded; {@code false} otherwise.
     */
    public boolean loadFirebugLite(boolean localVersion, boolean startOpened) {
        if(isFirebugLiteLoaded) {
            return false;
        }

        if(localVersion) {
            // try to load it locally
            executeScriptCommand("var firebug = document.createElement('script');\n" +
                    "firebug.setAttribute('src', 'components/firebug-lite/build/firebug-lite.js" + (startOpened ? "#startOpened" : "") + "');\n" +
                    "document.body.appendChild(firebug);\n" +
                    "(function () {\n" +
                    "    if (window.firebug.version) {\n" +
                    "        firebug.init();\n" +
                    "    } else {\n" +
                    "        setTimeout(arguments.callee);\n" +
                    "    }\n" +
                    "})();\n" +
                    "void(firebug);");
        } else {
            executeScriptCommand("if (!document.getElementById('FirebugLite')){E = document['createElement' + 'NS'] && document.documentElement.namespaceURI;E = E ? document['createElement' + 'NS'](E, 'script') : document['createElement']('script');E['setAttribute']('id', 'FirebugLite');E['setAttribute']('src', 'https://getfirebug.com/' + 'firebug-lite.js' + '#startOpened');E['setAttribute']('FirebugLite', '4');(document['getElementsByTagName']('head')[0] || document['getElementsByTagName']('body')[0]).appendChild(E);E = new Image;E['setAttribute']('src', 'https://getfirebug.com/'" + (startOpened ? "+ '#startOpened'" : "") + ");}");
        }

        return isFirebugLiteLoaded = true;
    }

    /**
     * @return {@code true} if FirebugLite is loaded; {@code False} otherwise.
     */
    public boolean isFirebugLiteLoaded() {
        return isFirebugLiteLoaded;
    }

    public void loadContent(String content) {
        engine.loadContent(content);
    }

    public void loadURL(String url) {
        engine.load(url);
    }

    /**
     * Read file content and return its content.
     *
     * @param filename
     * @return
     */
    private static String slurp(String filename) {
        InputStream in = WebEngineRuntime.class.getResourceAsStream(filename);
        try {
            return IOUtils.toString(in, "UTF-8");
        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            IOUtils.closeQuietly(in);
        }
    }
}