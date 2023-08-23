package cmd.receive.authen;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;

public class RequestGetData extends BaseCmd {

    public boolean isAccessToken;
    public String accessToken;
    public String sessionKey;
    public String social;
    public int clientPortalVersion;

    public RequestGetData(DataCmd dataCmd) {
        super(dataCmd);
    }

    /*
    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            isAccessToken = readBoolean(bf);
            accessToken = readString(bf);
            sessionKey = readString(bf);
            social = readString(bf);
            clientPortalVersion = readInt(bf);
        } catch (Exception e) {
        }
    }
*/
}
