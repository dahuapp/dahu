package io.dahuapp.editor.proxy;

import static io.dahuapp.editor.proxy.LoggerProxy.log;
import io.dahuapp.editor.utils.HTMLFormatter;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.logging.FileHandler;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Logger to have reports of information, errors, etc.
 */
public class LoggerProxy implements Proxy {

    private static final Logger logger = Logger.getLogger(LoggerProxy.class.getName());
    private FileHandler fh;
    private static final String file = "dahu";
    private final DateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
    private Date date = new Date();

    /**
     * Constructs a LoggerDriver. The log file will be set in the temporary
     * directory of the system eg. C:/temp/dahu[nb].log on Windows system or
     * /var/tmp/dahu[nb] on Solaris system...
     */
    public LoggerProxy() {
        // create a logger and a handler in html format
        logger.setLevel(Level.ALL); //to throw messages from all levels
        logger.setUseParentHandlers(false); //to supress the default console
        try {
            fh = new FileHandler("%t/" + file + dateFormat.format(date.getTime()) + ".log.html");
            fh.setFormatter(new HTMLFormatter());
            logger.addHandler(fh);
        } catch (IOException | SecurityException ex) {
            logger.log(Level.SEVERE, ex.getMessage(), ex.getCause());
        }
    }

    /**
     * Constructs a LoggerDriver. The log file will be
     * set in the directory passed on parameters.
     * @param directory The directory to place the log file.
     */
    public LoggerProxy(String directory) {
        // create a logger and a handler in html format
        logger.setLevel(Level.ALL); //to throw messages from all levels
        logger.setUseParentHandlers(false); //to supress the default console
        try {
            fh = new FileHandler(directory + "/" + file + dateFormat.format(date.getTime()) + ".log.html");
            fh.setFormatter(new HTMLFormatter());
            logger.addHandler(fh);
        } catch (IOException | SecurityException ex) {
            logger.log(Level.SEVERE, ex.getMessage(), ex.getCause());
        }
    }

    /**
     * Log the message with an INFO level (color : cyan).
     * @param message The message to log.
     */
    public static void info(String message) {
        logger.log(Level.INFO, message);
    }

    /**
     * Log the message with an INFO level (color : cyan).
     * @param sourceClass Name of class that issued the logging request.
     * @param sourceMethod Name of method that issued the logging request.
     * @param message The message to log.
     */
    public static void info(String sourceClass, String sourceMethod, String message) {
        logger.logp(Level.INFO, sourceClass, sourceMethod, message);
    }

    /**
     * Log the message with a SEVERE level (color : red).
     * @param message The message to log
     */
    public static void severe(String message) {
        logger.log(Level.SEVERE, message);
    }

    /**
     * Log the message with a SEVERE level (color : red).
     * @param sourceClass Name of class that issued the logging request.
     * @param sourceMethod Name of method that issued the logging request.
     * @param message The message to log.
     */
    public static void severe(String sourceClass, String sourceMethod, String message) {
        logger.logp(Level.SEVERE, sourceClass, sourceMethod, message);
    }

    /**
     * Log the message with a SEVERE level (color : red).
     * @param message The message to log
     * @param cause The cause of the severity
     */
    public static void severe(String message, Throwable cause) {
        logger.log(Level.SEVERE, message, cause);
    }

    /**
     * Log the message with a SEVERE level (color : red).
     * @param sourceClass Name of class that issued the logging request.
     * @param sourceMethod Name of method that issued the logging request.
     * @param message The message to log.
     * @param cause The cause of the severity.
     */
    public static void severe(String sourceClass, String sourceMethod, String message,
            Throwable cause) {
        logger.logp(Level.SEVERE, sourceClass, sourceMethod, message, cause);
    }

    /**
     * Log the message with a WARNING level (color : yellow).
     * @param message The message to log.
     */
    public static void warning(String message) {
        logger.log(Level.WARNING, message);
    }

    /**
     * Log the message with a WARNING level (color : yellow).
     * @param sourceClass Name of class that issued the logging request.
     * @param sourceMethod Name of method that issued the logging request.
     * @param message The message to log.
     */
    public static void warning(String sourceClass, String sourceMethod, String message) {
        logger.logp(Level.WARNING, sourceClass, sourceMethod, message);
    }

    /**
     * Log the message with a FINE level (color : blue).
     * @param message The message to log.
     */
    public static void fine(String message) {
        logger.log(Level.FINE, message);
    }

    /**
     * Log the message with a FINE level (color : blue).
     * @param sourceClass Name of class that issued the logging request.
     * @param sourceMethod Name of method that issued the logging request.
     * @param message The message to log.
     */
    public static void fine(String sourceClass, String sourceMethod, String message) {
        logger.logp(Level.FINE, sourceClass, sourceMethod, message);
    }

    /**
     * Log the message with a CONFIG level (color : green).
     * @param message The message to log.
     */
    public static void config(String message) {
        logger.log(Level.CONFIG, message);
    }

    /**
     * Log the message with a CONFIG level (color : green).
     * @param sourceClass Name of class that issued the logging request.
     * @param sourceMethod Name of method that issued the logging request.
     * @param message The message to log.
     */
    public static void config(String sourceClass, String sourceMethod, String message) {
        logger.logp(Level.CONFIG, sourceClass, sourceMethod, message);
    }

    /**
     * Log the message with an ALL level (color : black).
     * @param message The message to log.
     */
    public static void log(String message) {
        logger.log(Level.ALL, message);
    }

    /**
     * Log the message with an ALL level (color : black).
     * @param sourceClass Name of class that issued the logging request.
     * @param sourceMethod Name of method that issued the logging request.
     * @param message The message to log.
     */
    public static void log(String sourceClass, String sourceMethod, String message) {
        logger.logp(Level.ALL, sourceClass, sourceMethod, message);
    }
    
        /**
     * Log the message with an INFO level (color : cyan).
     * @param message The message to log.
     */
    public void JSinfo(String message) {
        logger.log(Level.INFO, message);
    }

    /**
     * Log the message with an INFO level (color : cyan).
     * @param sourceClass Name of class that issued the logging request.
     * @param sourceMethod Name of method that issued the logging request.
     * @param message The message to log.
     */
    public void JSinfo(String sourceClass, String sourceMethod, String message) {
        logger.logp(Level.INFO, sourceClass, sourceMethod, message);
    }

    /**
     * Log the message with a SEVERE level (color : red).
     * @param message The message to log
     */
    public void JSsevere(String message) {
        logger.log(Level.SEVERE, message);
    }

    /**
     * Log the message with a SEVERE level (color : red).
     * @param sourceClass Name of class that issued the logging request.
     * @param sourceMethod Name of method that issued the logging request.
     * @param message The message to log.
     */
    public void JSsevere(String sourceClass, String sourceMethod, String message) {
        logger.logp(Level.SEVERE, sourceClass, sourceMethod, message);
    }

    /**
     * Log the message with a SEVERE level (color : red).
     * @param message The message to log
     * @param cause The cause of the severity
     */
    public void JSsevere(String message, Throwable cause) {
        logger.log(Level.SEVERE, message, cause);
    }

    /**
     * Log the message with a SEVERE level (color : red).
     * @param sourceClass Name of class that issued the logging request.
     * @param sourceMethod Name of method that issued the logging request.
     * @param message The message to log.
     * @param cause The cause of the severity.
     */
    public void JSsevere(String sourceClass, String sourceMethod, String message,
            Throwable cause) {
        logger.logp(Level.SEVERE, sourceClass, sourceMethod, message, cause);
    }

    /**
     * Log the message with a WARNING level (color : yellow).
     * @param message The message to log.
     */
    public void JSwarning(String message) {
        logger.log(Level.WARNING, message);
    }

    /**
     * Log the message with a WARNING level (color : yellow).
     * @param sourceClass Name of class that issued the logging request.
     * @param sourceMethod Name of method that issued the logging request.
     * @param message The message to log.
     */
    public void JSwarning(String sourceClass, String sourceMethod, String message) {
        logger.logp(Level.WARNING, sourceClass, sourceMethod, message);
    }

    /**
     * Log the message with a FINE level (color : blue).
     * @param message The message to log.
     */
    public void JSfine(String message) {
        logger.log(Level.FINE, message);
    }

    /**
     * Log the message with a FINE level (color : blue).
     * @param sourceClass Name of class that issued the logging request.
     * @param sourceMethod Name of method that issued the logging request.
     * @param message The message to log.
     */
    public void JSfine(String sourceClass, String sourceMethod, String message) {
        logger.logp(Level.FINE, sourceClass, sourceMethod, message);
    }

    /**
     * Log the message with a CONFIG level (color : green).
     * @param message The message to log.
     */
    public void JSconfig(String message) {
        logger.log(Level.CONFIG, message);
    }

    /**
     * Log the message with a CONFIG level (color : green).
     * @param sourceClass Name of class that issued the logging request.
     * @param sourceMethod Name of method that issued the logging request.
     * @param message The message to log.
     */
    public void JSconfig(String sourceClass, String sourceMethod, String message) {
        logger.logp(Level.CONFIG, sourceClass, sourceMethod, message);
    }

    /**
     * Log the message with an ALL level (color : black).
     * @param message The message to log.
     */
    public void JSlog(String message) {
        logger.log(Level.ALL, message);
    }

    /**
     * Log the message with an ALL level (color : black).
     * @param sourceClass Name of class that issued the logging request.
     * @param sourceMethod Name of method that issued the logging request.
     * @param message The message to log.
     */
    public void JSlog(String sourceClass, String sourceMethod, String message) {
        logger.logp(Level.ALL, sourceClass, sourceMethod, message);
    }

    /**
     * Changes the level (default is Level.ALL).
     * The level value Level.OFF can be used to turn off logging.
     * Here is the level's hierarchy :<br >
     * OFF < SEVERE < WARNING < INFO < CONFIG < FINE < ALL
     * @param level Severity level.
     * @see java.util.logging.Logger
     */
    public void setLogLevel(Level level) {
        logger.setLevel(level);
    }

    @Override
    public void onLoad() {
        log("Beginning...");
    }

    @Override
    public void onStop() {
        log("End...");
    }
}
