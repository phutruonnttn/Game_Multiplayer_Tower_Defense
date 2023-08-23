/ Outpacket */

//Handshake
CmdSendHandshake = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setControllerId(gv.CONTROLLER_ID.SPECIAL_CONTROLLER);
            this.setCmdId(gv.CMD.HAND_SHAKE);
        },
        putData:function(){
            //pack
            this.packHeader();
            //update
            this.updateSize();
        }
    }
)

CmdSendUserInfo = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.USER_INFO);
        },
        pack:function(){
            this.packHeader();
            this.updateSize();
        }
    }
)

CmdGetUserCardInfo = fr.OutPacket.extend({
    ctor:function()
    {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.USER_CARD_INFO);
    },
    pack:function(){
        this.packHeader();
        this.updateSize();
    }
});

CmdGetUserChestInfo = fr.OutPacket.extend({
    ctor:function()
    {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.USER_CHEST_INFO);
    },
    pack:function(){
        this.packHeader();
        this.updateSize();
    }
});

CmdSendLogin = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.USER_LOGIN);
        },
        pack:function(userId){
            this.packHeader();
            this.putInt(userId);
            this.updateSize();
        }
    }
)

CmdCheatGold = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.INVENTORY_CHEAT_GOLD);
    },
    pack: function (){
        this.packHeader();
        this.updateSize();
    }
});

CmdCheatGem = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.INVENTORY_CHEAT_GEM);
    },
    pack: function (){
        this.packHeader();
        this.updateSize();
    }
});

CmdCheatCard = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.CARD_CHEAT);
    },
    pack: function (cardID, amount){
        this.packHeader();
        this.putInt(cardID);
        this.putInt(amount);
        this.updateSize();
    }
});

CmdOpenChest = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.CHEST_OPEN);
    },
    pack: function (chestID) {
        this.packHeader();
        this.putInt(chestID);
        this.updateSize();
    }
});

CmdReceiveReward = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.CHEST_GET_GIFT);
    },
    pack: function (chestID) {
        this.packHeader();
        this.putInt(chestID);
        this.updateSize();
    }
});

CmdSetCardToDeck = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.CARD_CHANGE);
    },
    pack: function (cardID, targetDeckID) {
        this.packHeader();
        this.putInt(cardID);
        this.putInt(targetDeckID);
        this.updateSize();
    }
});

CmdUpgradeCard = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.CARD_UPGRADE);
    },
    pack: function (cardID) {
        this.packHeader();
        this.putInt(cardID);
        this.updateSize();
    }
});

CmdBuyGold = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.SHOP_BUY_GOLD);
    },
    pack: function (index) {
        this.packHeader();
        this.putInt(index);
        this.updateSize();
    }
});

CmdBuyCard = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.ITEM_PIECE_CARD_BUY);
    },
    pack: function (index) {
        this.packHeader();
        this.putInt(index);
        this.updateSize();
    }
});

CmdBuyChest = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.ITEM_CHEST_BUY);
    },
    pack: function (index) {
        this.packHeader();
        this.putInt(index);
        this.updateSize();
    }
});

CmdRequestShopInfo = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.USER_SHOP_INFO);
    },
    pack: function () {
        this.packHeader();
        this.updateSize();
    }
});

CmdCheatChest = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.CHEST_CHEAT);
    },
    pack: function () {
        this.packHeader();
        this.updateSize();
    }
});

CmdFindMatch = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.FIND_MATCH);
    },
    pack: function () {
        this.packHeader();
        this.updateSize();
    }
});

CmdCancleMatch = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.CANCLE_MATCH);
    },
    pack: function () {
        this.packHeader();
        this.updateSize();
    }
});

CmdTargetObstacle = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.TARGET_OBSTACLE);
    },
    pack: function (x, y) {
        this.packHeader();
        this.putInt(x);
        this.putInt(y);
        this.updateSize();
    }
});

CmdCancelTower = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.CANCEL_TOWER);
    },
    pack: function (x, y) {
        this.packHeader();
        this.putInt(x);
        this.putInt(y);
        this.updateSize();
    }
});

CmdChangeTargetTower = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.CHANGE_TARGET_TOWER);
    },
    pack: function (x, y, targetMode) {
        this.packHeader();
        this.putInt(x);
        this.putInt(y);
        this.putInt(targetMode);
        this.updateSize();
    }
});

CmdSummonSystemMonster = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.SUMMON_SYSTEM_MONSTER);
    },
    pack: function () {
        this.packHeader();
        this.updateSize();
    }
});

CmdDropMonster = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.DROP_MONSTER);
    },
    pack: function (indexCard) {
        this.packHeader();
        this.putInt(indexCard);
        this.updateSize();
    }
});

CmdDropTower = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.DROP_TOWER);
    },
    pack: function (indexCard, x, y) {
        this.packHeader();
        this.putInt(indexCard);
        this.putInt(x);
        this.putInt(y);
        this.updateSize();
    }
});

CmdDropSpell = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.DROP_SPELL);
    },
    pack: function (indexCard, x, y, map) {
        this.packHeader();
        this.putInt(indexCard);
        this.putInt(x);
        this.putInt(y);
        this.putByte(map)
        this.updateSize();
    }
});

CmdCancelCard = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.CANCEL_CARD);
    },
    pack: function (indexCard) {
        this.packHeader();
        this.putInt(indexCard);
        this.updateSize();
    }
});
