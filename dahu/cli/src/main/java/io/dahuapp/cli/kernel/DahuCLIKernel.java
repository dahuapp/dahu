package io.dahuapp.cli.kernel;

import io.dahuapp.cli.kernel.module.Logger;
import io.dahuapp.common.kernel.Kernel;
import io.dahuapp.common.kernel.module.DefaultFileSystem;
import io.dahuapp.common.net.DahuFileAccessManager;
import io.dahuapp.common.net.RegexURLRewriter;

/**
 * Created by barraq on 26/05/14.
 */
public class DahuCLIKernel implements Kernel {

    // kernel modules
    public Logger console;
    public DefaultFileSystem filesystem;

    public DahuCLIKernel(DahuFileAccessManager fileAccessManager, RegexURLRewriter rewriter) {
        console = new Logger();
        filesystem = new DefaultFileSystem(fileAccessManager, rewriter);
    }

    @Override
    public void start() {
        console.load();
        filesystem.load();
        // done loading
        console.info("Dahuapp kernel started!");
    }

    @Override
    public void stop() {
        console.info("Dahuapp kernel stopped!");
        // unload
        filesystem.unload();
        console.unload();
    }
}
