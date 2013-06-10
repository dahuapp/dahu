package io.dahuapp.editor.utils;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.logging.Formatter;
import java.util.logging.Handler;
import java.util.logging.Level;
import java.util.logging.LogRecord;

/**
 *
 * @author Jean-Baptiste
 */
public class HTMLFormatter extends Formatter {
    
    private boolean printDate = true;
    private boolean printMethod = true;
    private boolean printMessage = true;
    private boolean printLevel = true;
    
    private final String head = "<head>\n<style type=\"text/css\">\nbody {\ncolor: black;\nbackground-color: white \n}" 
            + "\n.severe {\nfont-family: Courier New,Courier,monospace;\ncolor: rgb(204, 0, 0)\n}\n"
            + "\n.warning {\nfont-family: Courier New,Courier,monospace;\ncolor: rgb(255, 204, 0)\n}\n"
            + "\n.fine {\nfont-family: Courier New,Courier,monospace;\ncolor: rgb(0, 0, 204)\n}\n"
            + "\n.info {\nfont-family: Courier New,Courier,monospace;\ncolor: rgb(104, 104, 104)\n}\n"
            + "\n.config {\nfont-family: Courier New,Courier,monospace;\ncolor: rgb(0, 204, 0)\n}\n"
            + "\n.all {\nfont-family: Courier New,Courier,monospace;\ncolor: rgb(0, 0, 0)\n}\n"
            + "\n</style>\n";
    
    private DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy-HH:mm:ss");

    @Override
    /**
     * format each line of the log in html form
     * @param record line to format
     * @return string in html form
     */
    public String format(LogRecord record) {
        String color = getColor(record);
        return begin() + printDate(record) + printMethod(record) 
                + printLevel(record, color) + printMessage(record, color) 
                + end();

    }
    
    /**
     * return the date in a string in html form
     * @param record line to format
     * @return 
     */
    private String printDate(LogRecord record) {
        if (printDate) {
            StringBuilder s = new StringBuilder(1024);
            Date d = new Date(record.getMillis());
            s.append("<td>").append(dateFormat.format(d));
            return s.toString();
        } else {
            return null;
        }
    }
    
    /**
     * return the Method in html format
     * @param record line to format
     * @return 
     */
    private String printMethod(LogRecord record) {
        if (printMethod) {
            StringBuilder s = new StringBuilder(1024);
            s.append(" in ");
            if (record.getSourceClassName() != null) {
                s.append(record.getSourceClassName());
            }
            if (record.getSourceMethodName() != null) {
                s.append(".").append(record.getSourceMethodName());
            }
            s.append("</td>");
            return s.toString();
        } else {
            return null;
        }
    }
    
    /**
     * return the level in html format
     * @param record line to format
     * @param color color class in the css
     * @return 
     */
    private String printLevel(LogRecord record, String color) {
        if (printLevel) {
            StringBuilder s = new StringBuilder(1024);
            s.append("<td><span class=\"").append(color).append("\">" + "<b>");
            s.append(record.getLevel().getName());
            s.append("</b></td>");
            return s.toString();
        } else {
            return null;
        }
    }
    
    /**
     * returns the log message in html format
     * @param record line to format
     * @param color color class in the css
     * @return 
     */
    private String printMessage(LogRecord record, String color) {
        if (printMessage) {
            StringBuilder s = new StringBuilder(1024);
            s.append("<td><span  class=\"").append(color).append("\">" + "<b>");
            s.append(formatMessage(record));
            s.append("</b></span></td>\n");
            return s.toString();
        } else {
            return null;
        }
    }
    
    /**
     * return a string corresponding to the Level of the log message
     * @param record line to format
     * @return 
     */
    private String getColor(LogRecord record) {
            String color = "all";
            if (record.getLevel() == Level.SEVERE) {
                color = "severe";
            } else if (record.getLevel() == Level.WARNING) {
                color = "warning";
            } else if (record.getLevel() == Level.FINE) {
                color = "fine";
            } else if (record.getLevel() == Level.INFO) {
                color = "info";
            } else if (record.getLevel() == Level.CONFIG) {
                color = "config";
            }
            return color;
    }
    
    /**
     * begins a line in html format
     * @return 
     */
    private String begin() {
        return "<tr>\n";
    }
    
    /**
     * ends a line in html format
     * @return 
     */
    private String end() {
        return "</tr>\n";
    }
    
    // beginning of the log file
    @Override
    public String getHead(Handler h) {
        return "<html>"+head+"\n<body>\n<table>\n";
    }
    // end of the log file

    @Override
    public String getTail(Handler h) {
        return "</table>\n</body>\n</html>\n";
    }
}
