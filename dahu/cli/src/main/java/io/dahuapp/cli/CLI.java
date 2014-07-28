package io.dahuapp.cli;

import io.dahuapp.cli.kernel.DahuCLIKernel;
import io.dahuapp.common.net.DahuFileAccessManager;
import io.dahuapp.common.net.DahuURLStreamHandlerFactory;
import org.apache.commons.io.IOUtils;
import org.docopt.clj;

import java.io.IOException;
import java.net.URL;
import java.util.Map;

/**
 * Command-line Interface main class
 */
public class CLI {

    private DahuFileAccessManager dahuFileAccessManager;

    /**
     * Command-Line Interface proxy.
     * This proxy is used on the JavaScript side.
     */
    public class CLIProxy {
        public Map<String, Object> arguments;

        public CLIProxy(Map<String, Object> arguments) {
            this.arguments = arguments;
        }
    }

    /**
     * Starts the Command-Line Interface.
     *
     * @param args arguments given to the CLI.
     */
    public static void main(String[] args) {
        CLI cli = new CLI();
        cli.run(args);
    }

    public void run(String[] args) {
        try {
            String docstring = IOUtils.toString(CLI.class.getResourceAsStream("docstring"), "UTF-8");
            Map<String, Object> arguments = clj.docopt(docstring, args);

            if (arguments == null ) {
                System.out.println(docstring);
            } else {
                final ScriptEngineRuntime engine = new ScriptEngineRuntime();

                if (engine == null) {
                    throw new RuntimeException("Unable to load Nashorn JavaScript engine.");
                }

                // Load DahuBridge
                engine.executeScriptFile("/io/dahuapp/core/scripts/dahubridge.js");

                // Load CLI Proxy
                engine.put("CLI", new CLIProxy(arguments));

                // Setup file access manager and url stream factory
                dahuFileAccessManager = new DahuFileAccessManager();
                URL.setURLStreamHandlerFactory(new DahuURLStreamHandlerFactory(
                        getClass().getClassLoader(),
                        dahuFileAccessManager));

                // Load CLI Kernel
                engine.put("kernel", new DahuCLIKernel(dahuFileAccessManager));

                // Load CLI
                engine.executeScriptFile("/io/dahuapp/cli/CLI.js");

                // exit
                engine.shutdown();
            }
        } catch (IOException e) {
            System.err.println("Error while loading CLI.");
            e.printStackTrace();
        } catch (RuntimeException e) {
            System.err.println("Error while running CLI script.");
            e.printStackTrace();
        }
    }
}
