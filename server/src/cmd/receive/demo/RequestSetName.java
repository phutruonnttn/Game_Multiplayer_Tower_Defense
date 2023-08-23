package cmd.receive.demo;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;
import bitzero.util.common.business.CommonHandle;

import java.nio.ByteBuffer;

/**
 * Created by hieupt on 11/8/18.
 * all packet receive from client will extends BaseCmd and override unpackData() function
 */
public class RequestSetName extends BaseCmd {
    public static final String NAME_DEFAULT = "default";
    private String name;
    public RequestSetName(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }

    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            name = readString(bf);
        } catch (Exception e) {
            name = NAME_DEFAULT;
            CommonHandle.writeErrLog(e);
        }
    }

    public String getName(){
        return name;
    }
}
