package io.dahuapp.cli;

import io.dahuapp.common.javascript.JavascriptRuntime;
import org.apache.commons.io.IOUtils;

import javax.script.ScriptContext;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * Implementation of JavascriptRuntime for ScriptEngine.
 *
 * Thanks to https://github.com/bripkens/java-with-javascript/blob/master/src/main/java/de/bripkens/nashorn/Runner.java
 */
public class ScriptEngineRuntime implements JavascriptRuntime<Object> {

    protected ScriptEngine engine;

    // Notice here that we removed the "use strict" from the original code from Ben Ripkens.
    // Indeed we want to keep the context between each call. Adding it back will
    // just break everything down...
    private static final String WRAPPER_PRE = "main(function() {\n";
    private static final String WRAPPER_POST = "\n});";

    private static final Pattern KEY_ACCESS_PATTERN = Pattern.compile("^[a-z_][a-z_0-9]*(\\.[a-z_][a-z_0-9]*)*$", Pattern.CASE_INSENSITIVE);

    /**
     * Constructor
     */
    public ScriptEngineRuntime() {
        ScriptEngineManager manager = new ScriptEngineManager();
        engine = manager.getEngineByName("nashorn");

        Map<String, Object> output = new HashMap();
        engine.getBindings(ScriptContext.ENGINE_SCOPE).put("output", output);

        // executeScriptFile(...) and executeScript(...) cannot be used as
        // both would apply the wrapper. The wrapper cannot be used at this
        // point because it relies on the global main(...) function which is
        // added by the event loop file.
        exec(slurp("/io/dahuapp/cli/boot.js"));
    }

    public Object executeScriptFile(String path) {
        return executeScriptCommand(slurp(path));
    }

    @Override
    public Object executeScriptCommand(String command) {
        return exec(WRAPPER_PRE + command + WRAPPER_POST);
    };

    public void put(String key, Object value) {
        engine.put(key, value);
    }

    @Override
    public Object get(String key) {
        if (!KEY_ACCESS_PATTERN.matcher(key).matches()) {
            throw new IllegalArgumentException("You may only access global state via the get() method.");
        }
        try {
            return engine.eval(key);
        } catch (ScriptException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Shutdown engine.
     */
    public void shutdown() {
        try {
            engine.eval("shutdown();");
        } catch (ScriptException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Run some code that has been wrapped.
     *
     * @param code
     */
    private Object exec(String code) {
        try {
            return engine.eval(code);
        } catch (ScriptException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Read file content and return its content.
     *
     * @param filename
     * @return
     */
    private static String slurp(String filename) {
        InputStream in = ScriptEngineRuntime.class.getResourceAsStream(filename);
        try {
            return IOUtils.toString(in, "UTF-8");
        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            IOUtils.closeQuietly(in);
        }
    }
}
