package cmd.request.battle;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;

import java.nio.ByteBuffer;

public class RequestDropTower extends RequestBattleAction {

    public RequestDropTower(DataCmd data) {
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
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
