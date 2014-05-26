package io.dahuapp.cli.kernel.module;


import io.dahuapp.common.kernel.Module;
import io.dahuapp.driver.LoggerDriver;

/**
 * Logger module.
 *
 * Note: unlike in the Editor since we are using
 * Nashorn JavaScript engine we can have function
 * with multiple arguments !
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

    public void log(String format, Object... arguments) {
        LoggerDriver.info(format, arguments);
    }

    public void debug(String msg) {
        LoggerDriver.debug(msg);
    }

    public void debug(String format, Object... arguments) {
        LoggerDriver.debug(format, arguments);
    }

    public void info(String msg) {
        LoggerDriver.info(msg);
    }

    public void info(String format, Object... arguments) {
        LoggerDriver.info(format, arguments);
    }

    public void warn(String msg) {
        LoggerDriver.warn(msg);
    }

    public void warn(String format, Object... arguments) {
        LoggerDriver.warn(format, arguments);
    }

    public void error(String msg) {
        LoggerDriver.error(msg);
    }

    public void error(String format, Object... arguments) {
        LoggerDriver.error(format, arguments);
    }
}
