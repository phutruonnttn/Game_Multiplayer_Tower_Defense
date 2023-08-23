var gv = gv||{};
gv.CONSTANT = gv.CONSTANT || {};
gv.CONSTANT.USERID = null;

let networkManager = networkManager||{};

networkManager.Connector = cc.Class.extend({
    _gameClient : null,

    ctor: function (gameClient){
        this._gameClient = gameClient;
        gameClient.packetFactory.addPacketMap(networkManager.packetMap);
        gameClient.receivePacketSignal.add(this.onReceivedPacket, this);
    },

    onReceivedPacket:function(cmd, packet)
    {
        if (cmd !== gv.CMD.LOOP_MAX)
            cc.log("onReceivedPacket: " + cmd);
        if (cmd in networkManager.handle)
            networkManager.handle[cmd](packet);
        else {
            cc.log("UNEXPECTED Packet: " + cmd);
        }
    },
});

networkManager.handle = {};

networkManager.handle[gv.CMD.HAND_SHAKE] = function (packet) {
    getLoginController().sendLoginReq();
};

networkManager.handle[gv.CMD.USER_LOGIN] = function (packet) {
    getUserController().sendGetUserInfo();
};

networkManager.handle[gv.CMD.USER_CARD_INFO] = function (packetCard) {
    gv.user.loadCard(packetCard.listCard);
    gv.user.loadDeck(packetCard.listCardIdInDeck);
};

networkManager.handle[gv.CMD.USER_INVENTORY_INFO] = function (packetBasicInfo) {
    gv.user.loadStat(packetBasicInfo);
};

networkManager.handle[gv.CMD.USER_CHEST_INFO] = function (packetChests) {
    gv.user.loadChest(packetChests);
};

networkManager.handle[gv.CMD.CHEST_OPEN] = function (packet) {
    if (packet.getError() !== gv.ERROR.SUCCESS) {
        cc.log("ERROR: "+packet.getError());
        getUserController().sendGetChestInfo();
    }
};

networkManager.handle[gv.CMD.CHEST_GET_GIFT] = function (packetChestGift) {
    if (packetChestGift.getError() === gv.ERROR.SUCCESS)
        gv.user.receiveRewardFromChest(packetChestGift.listRewardFromChest);
    else {
        cc.log("ERROR: "+packetChestGift.getError());
        getUserController().sendGetChestInfo();
    }
};

networkManager.handle[gv.CMD.CARD_CHANGE] = function (packet) {
    if (packet.getError() !== gv.ERROR.SUCCESS) {
        cc.log("ERROR: "+packet.getError());
        getUserController().sendGetCardInfo();
    }
};

networkManager.handle[gv.CMD.CARD_UPGRADE] = function (packet) {
    if (packet.getError() !== gv.ERROR.SUCCESS) {
        cc.log("ERROR: "+packet.getError());
        getUserController().sendGetCardInfo();
    }
};

networkManager.handle[gv.CMD.SHOP_BUY_GOLD] = function (packet) {
    if (packet.getError() !== gv.ERROR.SUCCESS) {
        cc.log("ERROR: "+packet.getError());
        getUserController().sendGetUserInfo();
    }
};

networkManager.handle[gv.CMD.USER_SHOP_INFO] = function (packetItems) {
    if (gv.lobby !== undefined){
        gv.LOBBY.SHOP_DAILY_ITEM = packetItems.listItem
        gv.lobby.lobbyShopPage.initLayoutDailyItem();
    }
};

networkManager.handle[gv.CMD.ITEM_CHEST_BUY] = function (packetChestGift) {
    if (packetChestGift.getError() === gv.ERROR.SUCCESS)
        gv.user.receiveRewardFromChest(packetChestGift.listRewardFromChest);
    else {
        cc.log("ERROR: "+packetChestGift.getError());
        getUserController().sendGetShopInfo();
    }
};

networkManager.handle[gv.CMD.ITEM_PIECE_CARD_BUY] = function (packet) {
    if (packet.getError() !== gv.ERROR.SUCCESS) {
        cc.log("ERROR: "+packet.getError());
        getUserController().sendGetShopInfo();
        getUserController().sendGetCardInfo();
    }
};

networkManager.handle[gv.CMD.CHEST_CHEAT] = function (packet) {
    getUserController().sendGetChestInfo();
};

networkManager.handle[gv.CMD.CANCLE_MATCH] = function (packet) {
    if (packet.getError() === gv.ERROR.SUCCESS) {
        // JUMP TO LOBBY
        fr.view(Lobby);
    }
};

networkManager.handle[gv.CMD.FIND_MATCH] = function (packet) {
    if (packet.getError() === gv.ERROR.SUCCESS) {
        gv.battle = {};
        let mapPlayer = new MapBattle(
            packet.arrPositionBuffPlayer,
            packet.arrPositionTreePlayer,
            packet.positionHolePlayer,
            packet.arrVirtualPathPlayer
        )
        let mapOpponent = new MapBattle(
            packet.arrPositionBuffOpponent,
            packet.arrPositionTreeOpponent,
            packet.positionHoleOpponent,
            packet.arrVirtualPathOpponent
        )

        var scene = new cc.Scene();
        scene.addChild(new BattleScene(
            packet.opponentName,
            packet.opponentFame,
            packet.randomSeed,
            packet.listPlayerDeskCard,
            packet.listPlayerDeskCardLevel,
            mapPlayer,
            packet.listOpponentDeskCard,
            packet.listOpponentDeskCardLevel,
            mapOpponent
        ));
        cc.director.runScene(new cc.TransitionFade(1.2, scene));
    }
};

networkManager.handle[gv.CMD.LOOP_MAX] = function (packet) {
    if (packet.getError() === gv.ERROR.SUCCESS) {
        for (var i = 0; i < packet.listAction.length; i++) {
            gv.battleScene.battleMgr.listActions.push(packet.listAction[i])
        }
        gv.loopMax = packet.loopMax
    }
};

networkManager.handle[gv.CMD.END_BATTLE] = function (packet) {
    if (packet.getError() === gv.ERROR.SUCCESS) {
        gv.battle.frameEnd = packet.frameEnd;
        gv.battle.winner = packet.winner;
        gv.battle.amountFame = packet.amountFame;
    }
};