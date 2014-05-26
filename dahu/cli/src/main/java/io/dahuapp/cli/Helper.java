package io.dahuapp.cli;

import javax.script.ScriptEngineFactory;
import javax.script.ScriptEngineManager;


public class Helper {

    /**
     * Print ScriptEngineFactory info.
     *
     * @param factory ScriptEngineFactory to print info from.
     */
    public static void printScriptEngineFactoryInfo(ScriptEngineFactory factory) {
        System.out.println("engine name=" + factory.getEngineName());
        System.out.println("engine version=" + factory.getEngineVersion());
        System.out.println("language name=" + factory.getLanguageName());
        System.out.println("extensions=" + factory.getExtensions());
        System.out.println("language version=" + factory.getLanguageVersion());
        System.out.println("names=" + factory.getNames());
        System.out.println("mime types=" + factory.getMimeTypes());
    }

    /**
     * Print info on all ScriptEngineFactory available.
     */
    public static void printAllScriptEngineFactoryInfo() {
        final ScriptEngineManager manager = new ScriptEngineManager();
        for (ScriptEngineFactory f : manager.getEngineFactories()) {
            printScriptEngineFactoryInfo(f);
            System.out.println();
        }
    }
}
