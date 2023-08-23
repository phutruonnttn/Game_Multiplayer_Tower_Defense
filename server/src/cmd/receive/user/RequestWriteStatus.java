package cmd.receive.user;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;

import java.nio.ByteBuffer;

public class RequestWriteStatus extends BaseCmd {
    public String status;

    public RequestWriteStatus(DataCmd data) {
        super(data);
        // TODO Auto-generated constructor stub
    }

    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            status = readString(bf);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
