package cmd.receive.user;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;

public class RequestUserInfo extends BaseCmd {
    public RequestUserInfo(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }
}
