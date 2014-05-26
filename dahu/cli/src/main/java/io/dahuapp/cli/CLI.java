package io.dahuapp.cli;

import io.dahuapp.cli.kernel.DahuCLIKernel;
import org.docopt.clj;

import javax.script.*;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Map;

import org.apache.commons.io.IOUtils;

/**
 * Command-line Interface main class
 */
public class CLI {

    /**
     * Command-Line Interface proxy.
     * This proxy is used on the JavaScript side.
     */
    public class CLIProxy {
        Map<String, Object> arguments;

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

            if (arguments.get("--help").toString() == "true") {
                System.out.println(docstring);
            }
            else {
                final ScriptEngineManager manager = new ScriptEngineManager();
                ScriptEngine engine  = manager.getEngineByName("nashorn");

                if (engine == null) {
                    throw new RuntimeException("Unable to load Nashorn JavaScript engine.");
                }

                // Load utility functions
                engine.eval(new InputStreamReader(CLI.class.getResourceAsStream("/io/dahuapp/cli/boot.js")));

                // Load DahuBridge
                engine.eval(new InputStreamReader(CLI.class.getResourceAsStream("/io/dahuapp/core/scripts/dahubridge.js")));

                // Load CLI Proxy
                engine.put("CLI", new CLIProxy(arguments));

                // Load CLI Kernel
                engine.put("kernel", new DahuCLIKernel());

                // Load CLI
                engine.eval(new InputStreamReader(CLI.class.getResourceAsStream("/io/dahuapp/cli/CLI.js")));
            }
        } catch (IOException e) {
            System.err.println("Error while loading CLI.");
            e.printStackTrace();
        } catch (ScriptException e) {
            System.err.println("Error while running CLI script.");
            e.printStackTrace();
        }
    }
}
