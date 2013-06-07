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
    // formatage d’une ligne
    
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
    public String format(LogRecord record) {
        StringBuilder s = new StringBuilder(1024);
        Date d = new Date(record.getMillis());
        s.append("<tr><td>");
        s.append(dateFormat.format(d));
        s.append(" in ");
        if (record.getSourceClassName() != null) {
            s.append(record.getSourceClassName());
        }
        if (record.getSourceMethodName() != null) {
            s.append(".");
            s.append(record.getSourceMethodName());
        }

        s.append("</td>");
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
        s.append("<td><span class=\"").append(color).append("\">" + "<b>");
        s.append(record.getLevel().getName()); 
        s.append("</b></td>");
        s.append("<td><span  class=\"").append(color).append("\">" + "<b>");
        s.append(formatMessage(record));
        s.append("</b></span></td></tr>\n");
        return s.toString();
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
