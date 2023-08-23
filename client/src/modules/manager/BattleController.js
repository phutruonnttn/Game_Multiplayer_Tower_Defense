

var BattleController = cc.Class.extend({

    ctor: function (gameClient) {
        this.gameClient = gameClient;
    },

    sendFindMatch:function ()
    {
        cc.log("sendFindMatch");
        var pk = this.gameClient.getOutPacket(CmdFindMatch);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },

    sendCancelMatch:function ()
    {
        cc.log("sendCancelMatch");
        var pk = this.gameClient.getOutPacket(CmdCancleMatch);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },

    sendSummonSystemMonster: function () {
        cc.log("sendSummonSystemMonster")
        var pk = this.gameClient.getOutPacket(CmdSummonSystemMonster);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },

    sendDropMonster: function (indexCard) {
        cc.log("sendDropMonster")
        var pk = this.gameClient.getOutPacket(CmdDropMonster);
        pk.pack(indexCard);
        this.gameClient.sendPacket(pk);
    },

    sendDropTower: function (indexCard, x, y) {
        cc.log("sendDropTower")
        var pk = this.gameClient.getOutPacket(CmdDropTower);
        pk.pack(indexCard, x, y);
        this.gameClient.sendPacket(pk);
    },

    sendDropSpell: function (indexCard, x, y, map) {
        cc.log("sendDropSpell")
        var pk = this.gameClient.getOutPacket(CmdDropSpell);
        pk.pack(indexCard, x, y, map);
        this.gameClient.sendPacket(pk);
    },

    sendCancelCard: function (indexCard) {
        cc.log("sendCancelCard")
        var pk = this.gameClient.getOutPacket(CmdCancelCard);
        pk.pack(indexCard);
        this.gameClient.sendPacket(pk);
    },

    sendTargetObstacle: function (x, y) {
        cc.log("sendTargetObstacle")
        var pk = this.gameClient.getOutPacket(CmdTargetObstacle);
        pk.pack(x, y);
        this.gameClient.sendPacket(pk);
    },

    sendCancelTower: function (x, y) {
        cc.log("sendCancelTower")
        var pk = this.gameClient.getOutPacket(CmdCancelTower);
        pk.pack(x, y);
        this.gameClient.sendPacket(pk);
    },

    sendChangeTargetTower: function (x, y, targetMode) {
        cc.log("sendChangeTargetTower")
        var pk = this.gameClient.getOutPacket(CmdChangeTargetTower);
        pk.pack(x, y, targetMode);
        this.gameClient.sendPacket(pk);
    },

});

var battleController = null;

var getBattleController = function (){
    if(battleController){
        return battleController;
    }
    battleController = new BattleController(gv.gameClient);
    return battleController;
}