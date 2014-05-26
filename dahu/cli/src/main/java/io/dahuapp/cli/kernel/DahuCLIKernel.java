package io.dahuapp.cli.kernel;

import io.dahuapp.cli.kernel.module.Logger;
import io.dahuapp.common.kernel.Kernel;

/**
 * Created by barraq on 26/05/14.
 */
public class DahuCLIKernel implements Kernel {

    // kernel modules
    public Logger console;

    public DahuCLIKernel() {
        console = new Logger();
    }

    @Override
    public void start() {
        console.load();
        // done loading
        console.info("Dahuapp kernel started!");
    }

    @Override
    public void stop() {
        console.info("Dahuapp kernel stopped!");
        // unload
        console.unload();
    }
}
