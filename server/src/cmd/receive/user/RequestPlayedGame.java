package cmd.receive.user;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;

import java.nio.ByteBuffer;

public class RequestPlayedGame extends BaseCmd {
    public long zingId;

    public RequestPlayedGame(DataCmd data) {
        super(data);
        // TODO Auto-generated constructor stub
    }

    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            zingId = readLong(bf);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
