package cmd.response.shop;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import config.user.ShopConfig;
import model.user.Shop.Gold;
import model.user.Shop.Item;

import java.nio.ByteBuffer;

public class ResponseShopGetInfo extends BaseMsg {

    int numberItem;
    Item[] listItem;
    int numberGold;
    Gold[] listGold;

    public ResponseShopGetInfo(int numberItem, Item[] listItem, int numberGold, Gold[] listGold){
        super(CmdDefine.SHOP_INFO);
        this.numberItem = numberItem;
        this.listItem = listItem;
        this.numberGold = numberGold;
        this.listGold = listGold;

    }

    @Override
    public byte[] createData(){

        ByteBuffer bf = makeBuffer();

        bf.putInt(numberItem);
        for(int i = 0; i < numberItem; i++){
            bf.putInt(listItem[i].getIndex());
            bf.putInt(listItem[i].getIsBought());
            bf.putInt(listItem[i].getAmount());
            bf.putInt(listItem[i].getPieceId());
            if(listItem[i].getType() == ShopConfig.shopItemChestType){
                bf.putInt(ShopConfig.priceItemChest);
            }
            else bf.putInt(listItem[i].getAmount() * ShopConfig.pricePieceCard);
        }

        bf.putInt(numberGold);
        for(int i = 0; i < numberGold; i++){
            bf.putInt(listGold[i].getIndex());
            bf.putInt(listGold[i].getGold());
            bf.putInt(listGold[i].getGem());
        }

        return packBuffer(bf);
    }

}
