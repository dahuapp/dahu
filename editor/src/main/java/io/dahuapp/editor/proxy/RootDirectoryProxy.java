/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package io.dahuapp.editor.proxy;

/**
 *
 * @author Jean-Baptiste
 */
public class RootDirectoryProxy implements Proxy{
    
    private String rootDirectory;
    private String imgPath;
    
    public RootDirectoryProxy() {
        String sep = System.getProperty("file.separator");
        rootDirectory = System.getProperty("user.dir");
        imgPath = "src" + sep + "main" + sep + "resources" + sep + "io" + sep + "dahuapp" + sep + "editor" + sep + "app" + sep + "img";
        LoggerProxy.config(getClass().getName(), "rootDirectoryProxy", "current path : " + rootDirectory);
    }
    
    public String getImgPath() {
        return imgPath;
    }
    
    public String getRootDirectory() {
        return rootDirectory;
    }

    @Override
    public void onLoad() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public void onStop() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
    
}
