package cmd.request.lobby;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;

import java.nio.ByteBuffer;

public class RequestCardChange extends BaseCmd {

    int cardId;
    int targetIndex;

    public RequestCardChange(DataCmd dataCmd){
        super(dataCmd);
        this.unpackData();
    }

    @Override
    public void unpackData(){
        ByteBuffer bf = makeBuffer();
        try {
            cardId = readInt(bf);
            targetIndex = readInt(bf);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public int getCardId() {
        return cardId;
    }

    public int getTargetIndex() {
        return targetIndex;
    }

}
