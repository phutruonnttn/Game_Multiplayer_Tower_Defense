package cmd.receive.authen;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;

import java.nio.ByteBuffer;

public class RequestLogin extends BaseCmd {
    public int userId = 0;
    public RequestLogin(DataCmd dataCmd) {
        super(dataCmd);
    }
    
    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            userId = readInt(bf);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
