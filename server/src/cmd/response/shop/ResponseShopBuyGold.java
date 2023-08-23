package cmd.response.shop;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

public class ResponseShopBuyGold extends BaseMsg {

    public ResponseShopBuyGold(int err){super(CmdDefine.SHOP_BUY_GOLD, err);}

}
