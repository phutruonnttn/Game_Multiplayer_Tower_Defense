

var UserController = cc.Class.extend({

    ctor: function (gameClient) {
        this.gameClient = gameClient;
    },

    sendGetUserInfo:function()
    {
        cc.log("sendGetUserInfo");
        var pk = this.gameClient.getOutPacket(CmdSendUserInfo);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },

    sendGetCardInfo: function ()
    {
        cc.log("sendGetCardInfo");
        var pk = this.gameClient.getOutPacket(CmdGetUserCardInfo);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },

    sendGetChestInfo: function ()
    {
        cc.log("sendGetChestInfo");
        var pk = this.gameClient.getOutPacket(CmdGetUserChestInfo);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },

    sendCheatGold: function () {
        cc.log("sendChestGold");
        let pk = this.gameClient.getOutPacket(CmdCheatGold);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },

    sendCheatGem: function () {
        cc.log("sendChestGem");
        let pk = this.gameClient.getOutPacket(CmdCheatGem);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },

    sendCheatCard: function (cardID, amount) {
        cc.log("sendCheatCard");
        let pk = this.gameClient.getOutPacket(CmdCheatCard);
        pk.pack(cardID, amount);
        this.gameClient.sendPacket(pk);
    },

    sendCheatChest: function () {
        cc.log("sendCheatChest");
        let pk = this.gameClient.getOutPacket(CmdCheatChest);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },

    sendOpenChest: function (chestID) {
        cc.log("sendOpenChest");
        let pk = this.gameClient.getOutPacket(CmdOpenChest);
        pk.pack(chestID);
        this.gameClient.sendPacket(pk);
    },

    sendRequestReward: function (chestID) {
        cc.log("sendReceiveReward");
        let pk = this.gameClient.getOutPacket(CmdReceiveReward);
        pk.pack(chestID);
        this.gameClient.sendPacket(pk);
    },

    sendSetCardToDeck: function (cardID, targetDeckID) {
        cc.log("sendSetCardToDeck");
        let pk = this.gameClient.getOutPacket(CmdSetCardToDeck);
        pk.pack(cardID, targetDeckID);
        this.gameClient.sendPacket(pk);
    },

    sendUpgradeCard: function (cardID) {
        cc.log("sendUpgradeCard");
        let pk = this.gameClient.getOutPacket(CmdUpgradeCard);
        pk.pack(cardID);
        this.gameClient.sendPacket(pk);
    },

    sendBuyCardRequest: function (index){
        cc.log("sendBuyCardRequest");
        var pk = this.gameClient.getOutPacket(CmdBuyCard);
        pk.pack(index);
        this.gameClient.sendPacket(pk);
    },

    sendBuyChestRequest: function (index){
        cc.log("sendBuyChestRequest");
        var pk = this.gameClient.getOutPacket(CmdBuyChest);
        pk.pack(index);
        this.gameClient.sendPacket(pk);
    },

    sendGetShopInfo:function()
    {
        cc.log("sendGetShopInfo");
        var pk = this.gameClient.getOutPacket(CmdRequestShopInfo);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },

});

var userController = null;

var getUserController = function (){
    if(userController){
        return userController;
    }
    userController = new UserController(gv.gameClient);
    return userController;
}