package io.dahuapp.editor.kernel.module;


import io.dahuapp.driver.LoggerDriver;
import io.dahuapp.common.kernel.Module;

/**
 * Logger module.
 *
 * Note: the logger kernel should not expose all the log function from
 * the driver since JavaScript will be confused with function having
 * the same name but with different set of parameters.
 * Instead each log functions can be extended on the JavaScript side
 * to support templating such as log("some value {}", 3). This can
 * be achieved with underscore template.
 */
public class Logger implements Module {

    @Override
    public void load() {
        System.out.println(getClass().getResource("/io/dahuapp/driver/logger/highlighted_.xml"));
        LoggerDriver.configure(getClass().getResource("/io/dahuapp/driver/logger/highlighted.xml"));
    }

    public void log(String msg) {
        LoggerDriver.info(msg);
    }

    public void debug(String msg) {
        LoggerDriver.debug(msg);
    }

    public void info(String msg) {
        LoggerDriver.info(msg);
    }

    public void warn(String msg) {
        LoggerDriver.warn(msg);
    }

    public void error(String msg) {
        LoggerDriver.error(msg);
    }
}
