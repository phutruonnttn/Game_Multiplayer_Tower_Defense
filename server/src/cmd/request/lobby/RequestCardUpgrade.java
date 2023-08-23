package cmd.request.lobby;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;

import java.nio.ByteBuffer;

public class RequestCardUpgrade extends BaseCmd {
    int cardId;

    public RequestCardUpgrade(DataCmd dataCmd){
        super(dataCmd);
        this.unpackData();
    }

    @Override
    public void unpackData(){
        ByteBuffer bf = makeBuffer();
        try {
            cardId = readInt(bf);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public int getCardId() {
        return cardId;
    }
}
