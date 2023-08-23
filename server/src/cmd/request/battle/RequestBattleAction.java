package cmd.request.battle;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;

public abstract class RequestBattleAction extends BaseCmd {

    public int indexCard;
    public int coordinateX;
    public int coordinateY;
    public int map;
    public int targetMode;

    public RequestBattleAction(DataCmd data) {
        super(data);
    }

}
