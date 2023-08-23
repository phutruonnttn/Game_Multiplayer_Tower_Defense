package cmd.request.battle;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;

import java.nio.ByteBuffer;

public class RequestDropSpell extends RequestBattleAction {

    public RequestDropSpell(DataCmd data) {
        super(data);
        this.unpackData();
    }

    @Override
    public void unpackData(){
        ByteBuffer bf = makeBuffer();
        try {
            indexCard = readInt(bf);
            coordinateX = readInt(bf);
            coordinateY = readInt(bf);
            map = readBoolean(bf) ? 1 : 0;
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
