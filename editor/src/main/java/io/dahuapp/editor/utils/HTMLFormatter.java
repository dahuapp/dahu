/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package io.dahuapp.editor.utils;

import java.text.DateFormat;
import java.util.Date;
import java.util.Locale;
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
   @Override
   public String format(LogRecord record) {
      StringBuilder s = new StringBuilder(1024);
      Date d = new Date(record.getMillis());
      DateFormat df = DateFormat.getDateTimeInstance(
                          DateFormat.LONG, DateFormat.MEDIUM, Locale.FRANCE);  
      s.append("<tr><td>");
      s.append(df.format(d));
      
      if(record.getSourceClassName() != null) {
          s.append("&nbsp;");
          s.append(record.getSourceClassName());
      }
      if(record.getSourceMethodName() != null) {
          s.append(".");
          s.append(record.getSourceMethodName());
      }
      s.append("&nbsp;:&nbsp;");
      
      s.append("</td>");
      String color = "color: rgb(0, 0, 0)";
      String align = "&nbsp;&nbsp;&nbsp;&nbsp;";
      if(record.getLevel() == Level.SEVERE) {
          align = "&nbsp;";
          color = "color: rgb(204, 0, 0)";
      } else if(record.getLevel() == Level.WARNING) {
          align = "";
          color = "color: rgb(255, 204, 0)";
      } else if(record.getLevel() == Level.FINE) {
          align = "&nbsp;&nbsp;&nbsp;";
          color = "color: rgb(0, 0, 204)";
      } else if(record.getLevel() == Level.INFO) {
          align = "&nbsp;&nbsp;&nbsp;";
          color = "color: rgb(0, 204, 204)";
      } else if(record.getLevel() == Level.CONFIG) {
          align = "&nbsp;";
          color = "color: rgb(0, 204, 0)";
      }
      s.append("<td><span  style=\"font-family:" + " Courier New,Courier,monospace; ").append(color).append(";\">" + "<b>");
      s.append(record.getLevel().getName());
      s.append(align);
      s.append(" : ");
      s.append(formatMessage(record));
      s.append("</b></span></td></tr>\n");
      return s.toString();
   }
   // beginning of the log file
   @Override
   public String getHead(Handler h) {
      return "<html>\n<body>\n<table>\n";
   }
   // end of the log file
   @Override
   public String getTail(Handler h) {
       return "</table>\n</body>\n</html>\n";
   }
}
