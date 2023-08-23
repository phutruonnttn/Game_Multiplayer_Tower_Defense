package cmd.request.battle;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;

import java.nio.ByteBuffer;

public class RequestDropMonster extends RequestBattleAction {

    public RequestDropMonster(DataCmd data) {
        super(data);
        this.unpackData();
    }

    @Override
    public void unpackData(){
        ByteBuffer bf = makeBuffer();
        try {
            indexCard = readInt(bf);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}