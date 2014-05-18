package io.dahuapp.common.javascript;

import javafx.scene.web.WebEngine;
import netscape.javascript.JSObject;

import java.net.URL;

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
    public Object executeScript(String command) {
        Object returnValue = engine.executeScript(command);

        if (returnValue instanceof String && returnValue.equals("undefined")) {
            return null;
        }

        return returnValue;
    }

    @Override
    public JSObject getJSObject(String name) {
        Object returnValue = engine.executeScript(name);

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
        return loadFirebugLite(true);
    }

    /**
     * Load FirebugLite.
     *
     * @param localVersion {@code true} if local version should be loaded; {@code false} otherwise.
     * @return {@code true} if FirebugLite was loaded; {@code false} otherwise.
     */
    public boolean loadFirebugLite(boolean localVersion) {
        if(isFirebugLiteLoaded) {
            return false;
        }

        if(localVersion) {
            // try to load it locally
            executeScript("var firebug = document.createElement('script');\n" +
                    "firebug.setAttribute('src', 'components/firebug-lite/build/firebug-lite.js#startOpened');\n" +
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
            executeScript("if (!document.getElementById('FirebugLite')){E = document['createElement' + 'NS'] && document.documentElement.namespaceURI;E = E ? document['createElement' + 'NS'](E, 'script') : document['createElement']('script');E['setAttribute']('id', 'FirebugLite');E['setAttribute']('src', 'https://getfirebug.com/' + 'firebug-lite.js' + '#startOpened');E['setAttribute']('FirebugLite', '4');(document['getElementsByTagName']('head')[0] || document['getElementsByTagName']('body')[0]).appendChild(E);E = new Image;E['setAttribute']('src', 'https://getfirebug.com/' + '#startOpened');}");
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
}