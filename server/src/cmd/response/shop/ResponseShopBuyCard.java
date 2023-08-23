package cmd.response.shop;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

import java.nio.ByteBuffer;

public class ResponseShopBuyCard extends BaseMsg {

    public ResponseShopBuyCard(int err){
        super(CmdDefine.ITEM_CARD_BUY, err);
    }

    @Override

    public byte[] createData(){
        ByteBuffer bf = makeBuffer();
        return packBuffer(bf);
    }
}
