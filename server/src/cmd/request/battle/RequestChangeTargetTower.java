package cmd.request.battle;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;

import java.nio.ByteBuffer;

public class RequestChangeTargetTower extends RequestBattleAction {

    public RequestChangeTargetTower(DataCmd data) {
        super(data);
        this.unpackData();
    }

    @Override
    public void unpackData(){
        ByteBuffer bf = makeBuffer();
        try {
            this.coordinateX = readInt(bf);
            this.coordinateY = readInt(bf);
            this.targetMode = readInt(bf);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
