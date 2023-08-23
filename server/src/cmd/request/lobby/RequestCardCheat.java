package cmd.request.lobby;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;

import java.nio.ByteBuffer;

public class RequestCardCheat extends BaseCmd {

    int cardId;
    int amount;

    public RequestCardCheat(DataCmd dataCmd){
        super(dataCmd);
        this.unpackData();
    }

    @Override
    public void unpackData(){
        ByteBuffer bf = makeBuffer();
        try {
            cardId = readInt(bf);
            amount = readInt(bf);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public int getCardId() {
        return cardId;
    }

    public int getAmount() {
        return amount;
    }

}
