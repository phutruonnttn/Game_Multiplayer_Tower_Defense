package cmd.response.shop;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

import java.nio.ByteBuffer;

public class ResponseShopBuyChest extends BaseMsg {

    int gold;
    int cardId1;
    int amount1;
    int cardId2;
    int amount2;

    public ResponseShopBuyChest(int err){
        super(CmdDefine.ITEM_CHEST_BUY, err);
    }

    public ResponseShopBuyChest(int err, int gold, int cardId1, int amount1, int cardId2, int amount2){
        super(CmdDefine.ITEM_CHEST_BUY, err);
        this.gold = gold;
        this.cardId1 = cardId1;
        this.cardId2 = cardId2;
        this.amount1 = amount1;
        this.amount2 = amount2;

    }

    @Override
    public byte[] createData(){
        ByteBuffer bf = makeBuffer();
        bf.putInt(gold);
        bf.putInt(cardId1);
        bf.putInt(amount1);
        bf.putInt(cardId2);
        bf.putInt(amount2);
        return packBuffer(bf);
    }
}
