package io.dahuapp.driver;

import ch.qos.logback.classic.joran.JoranConfigurator;
import ch.qos.logback.core.joran.spi.JoranException;
import ch.qos.logback.core.util.StatusPrinter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import ch.qos.logback.classic.LoggerContext;
import org.slf4j.Marker;

import java.net.URL;


/**
 * Logger Driver.
 *
 * This driver can be used by any other drivers of kernel modules.
 * To change the output type of the logger (e.g. html, etc.) just pass
 * in a config URL file to configure. LogBack already provides
 * nice logger outputs alternative: please check the doc.
 */
public class LoggerDriver {
    static Logger logger = LoggerFactory.getLogger(LoggerDriver.class);
    static LoggerContext lc = (LoggerContext) LoggerFactory.getILoggerFactory();

    public static void configure(URL config) {
        try {
            JoranConfigurator configurator = new JoranConfigurator();
            configurator.setContext(lc);
            lc.reset();
            configurator.doConfigure(config);
        } catch (JoranException je) {
            // StatusPrinter will handle this
        }
        StatusPrinter.printInCaseOfErrorsOrWarnings(lc);
    }

    public static void trace(String msg) {
        logger.trace(msg);
    }

    public static void trace(String format, Object arg) {
        logger.trace(format, arg);
    }

    public static void trace(String format, Object arg1, Object arg2) {
        logger.trace(format, arg1, arg2);
    }

    public static void trace(String format, Object... arguments) {
        logger.trace(format, arguments);
    }

    public static void trace(String msg, Throwable t) {
        logger.trace(msg, t);
    }

    public static boolean isTraceEnabled(Marker marker) {
        return logger.isTraceEnabled(marker);
    }

    public static void trace(Marker marker, String msg) {
        logger.trace(marker, msg);
    }

    public static void trace(Marker marker, String format, Object arg) {
        logger.trace(marker, format, arg);
    }

    public static void trace(Marker marker, String format, Object arg1, Object arg2) {
        logger.trace(marker, format, arg1, arg2);
    }

    public static void trace(Marker marker, String format, Object... argArray) {
        logger.trace(marker, format, argArray);
    }

    public static void trace(Marker marker, String msg, Throwable t) {
        logger.trace(marker, msg, t);
    }

    public static boolean isDebugEnabled() {
        return logger.isDebugEnabled();
    }

    public static void debug(String msg) {
        logger.debug(msg);
    }

    public static void debug(String format, Object arg) {
        logger.debug(format, arg);
    }

    public static void debug(String format, Object arg1, Object arg2) {
        logger.debug(format, arg1, arg2);
    }

    public static void debug(String format, Object... arguments) {
        logger.debug(format, arguments);
    }

    public static void debug(String msg, Throwable t) {
        logger.debug(msg, t);
    }

    public static boolean isDebugEnabled(Marker marker) {
        return logger.isDebugEnabled(marker);
    }

    public static void debug(Marker marker, String msg) {
        logger.debug(marker, msg);
    }

    public static void debug(Marker marker, String format, Object arg) {
        logger.debug(marker, format, arg);
    }

    public static void debug(Marker marker, String format, Object arg1, Object arg2) {
        logger.debug(marker, format, arg1, arg2);
    }

    public static void debug(Marker marker, String format, Object... arguments) {
        logger.debug(marker, format, arguments);
    }

    public static void debug(Marker marker, String msg, Throwable t) {
        logger.debug(marker, msg, t);
    }

    public static boolean isInfoEnabled() {
        return logger.isInfoEnabled();
    }

    public static void info(String msg) {
        logger.info(msg);
    }

    public static void info(String format, Object arg) {
        logger.info(format, arg);
    }

    public static void info(String format, Object arg1, Object arg2) {
        logger.info(format, arg1, arg2);
    }

    public static void info(String format, Object... arguments) {
        logger.info(format, arguments);
    }

    public static void info(String msg, Throwable t) {
        logger.info(msg, t);
    }

    public static boolean isInfoEnabled(Marker marker) {
        return logger.isInfoEnabled(marker);
    }

    public static void info(Marker marker, String msg) {
        logger.info(marker, msg);
    }

    public static void info(Marker marker, String format, Object arg) {
        logger.info(marker, format, arg);
    }

    public static void info(Marker marker, String format, Object arg1, Object arg2) {
        logger.info(marker, format, arg1, arg2);
    }

    public static void info(Marker marker, String format, Object... arguments) {
        logger.info(marker, format, arguments);
    }

    public static void info(Marker marker, String msg, Throwable t) {
        logger.info(marker, msg, t);
    }

    public static boolean isWarnEnabled() {
        return logger.isWarnEnabled();
    }

    public static void warn(String msg) {
        logger.warn(msg);
    }

    public static void warn(String format, Object arg) {
        logger.warn(format, arg);
    }

    public static void warn(String format, Object... arguments) {
        logger.warn(format, arguments);
    }

    public static void warn(String format, Object arg1, Object arg2) {
        logger.warn(format, arg1, arg2);
    }

    public static void warn(String msg, Throwable t) {
        logger.warn(msg, t);
    }

    public static boolean isWarnEnabled(Marker marker) {
        return logger.isWarnEnabled(marker);
    }

    public static void warn(Marker marker, String msg) {
        logger.warn(marker, msg);
    }

    public static void warn(Marker marker, String format, Object arg) {
        logger.warn(marker, format, arg);
    }

    public static void warn(Marker marker, String format, Object arg1, Object arg2) {
        logger.warn(marker, format, arg1, arg2);
    }

    public static void warn(Marker marker, String format, Object... arguments) {
        logger.warn(marker, format, arguments);
    }

    public static void warn(Marker marker, String msg, Throwable t) {
        logger.warn(marker, msg, t);
    }

    public static boolean isErrorEnabled() {
        return logger.isErrorEnabled();
    }

    public static void error(String msg) {
        logger.error(msg);
    }

    public static void error(String format, Object arg) {
        logger.error(format, arg);
    }

    public static void error(String format, Object arg1, Object arg2) {
        logger.error(format, arg1, arg2);
    }

    public static void error(String format, Object... arguments) {
        logger.error(format, arguments);
    }

    public static void error(String msg, Throwable t) {
        logger.error(msg, t);
    }

    public static boolean isErrorEnabled(Marker marker) {
        return logger.isErrorEnabled(marker);
    }

    public static void error(Marker marker, String msg) {
        logger.error(marker, msg);
    }

    public static void error(Marker marker, String format, Object arg) {
        logger.error(marker, format, arg);
    }

    public static void error(Marker marker, String format, Object arg1, Object arg2) {
        logger.error(marker, format, arg1, arg2);
    }

    public static void error(Marker marker, String format, Object... arguments) {
        logger.error(marker, format, arguments);
    }

    public static void error(Marker marker, String msg, Throwable t) {
        logger.error(marker, msg, t);
    }
}
