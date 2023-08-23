package cmd.request.battle;

import bitzero.server.extensions.data.DataCmd;

import java.nio.ByteBuffer;

public class RequestTargetObstacle extends RequestBattleAction {
    public RequestTargetObstacle(DataCmd data) {
        super(data);
        this.unpackData();
    }

    @Override
    public void unpackData(){
        ByteBuffer bf = makeBuffer();
        try {
            this.coordinateX = readInt(bf);
            this.coordinateY = readInt(bf);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
