package cmd.request.lobby;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;

import java.nio.ByteBuffer;

public class RequestShopBuyCard extends BaseCmd {

    int index;

    public RequestShopBuyCard(DataCmd dataCmd){
        super(dataCmd);
        this.unpackData();
    }

    @Override
    public void unpackData(){
        ByteBuffer bf = makeBuffer();
        try {
            index = readInt(bf);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public int getIndex() {
        return index;
    }

}
