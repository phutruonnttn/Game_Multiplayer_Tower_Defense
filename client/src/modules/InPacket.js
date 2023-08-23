gv.CMD = gv.CMD ||{};

networkManager = networkManager||{};

networkManager.packetMap = {};

//Handshake
networkManager.packetMap[gv.CMD.HAND_SHAKE] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.token = this.getString();
        }
    }
);

networkManager.packetMap[gv.CMD.USER_LOGIN] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
        }
    }
);


networkManager.packetMap[gv.CMD.USER_CARD_INFO] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
        let numberCard = this.getInt();
        this.listCard = [];
        for (let i=0;i<numberCard;++i) {
            this.listCard.push({
                id: this.getInt(),
                level: this.getInt(),
                fragment: this.getInt(),
            });
        }
        let numberCardInDeck = this.getInt();
        this.listCardIdInDeck = [];
        for (let i=0;i<numberCardInDeck;++i)
            this.listCardIdInDeck.push(this.getInt());
    }
});

networkManager.packetMap[gv.CMD.USER_INVENTORY_INFO] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
        this.level = this.getInt();
        this.exp = this.getInt();
        this.gem = this.getInt();
        this.gold = this.getInt();
        this.fame = this.getInt();
        this.name = this.getString();
    }
});

networkManager.packetMap[gv.CMD.USER_CHEST_INFO] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
        let numberChest = this.getInt();
        this.listChest = [];
        for (let i=0;i<numberChest;++i)
            this.listChest.push({
                id: this.getInt(),
                finished: this.getInt(),
            });
        this.unlockingChestID = this.getInt();
        this.unlockingChestCD = this.getInt();
    }
});

networkManager.packetMap[gv.CMD.INVENTORY_CHEAT_GOLD] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {

    }
});

networkManager.packetMap[gv.CMD.INVENTORY_CHEAT_GEM] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {

    }
});

networkManager.packetMap[gv.CMD.CARD_CHEAT] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {

    }
});

networkManager.packetMap[gv.CMD.CHEST_OPEN] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
        // if (this.getError() === gv.ERROR.SUCCESS)
        //     this.waitingTime = this.getInt();
    }
});

networkManager.packetMap[gv.CMD.CHEST_GET_GIFT] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
        if (this.getError() === gv.ERROR.SUCCESS) {
            this.listRewardFromChest = [
                {
                    type: CHEST.REWARD.GOLD,
                    amount: this.getInt(),
                },
                {
                    type: CHEST.REWARD.FRAGMENT,
                    cardId: this.getInt(),
                    amount: this.getInt(),
                },
                {
                    type: CHEST.REWARD.FRAGMENT,
                    cardId: this.getInt(),
                    amount: this.getInt(),
                },
            ];
        }
    }
});

networkManager.packetMap[gv.CMD.CARD_CHANGE] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {

    }
});

networkManager.packetMap[gv.CMD.CARD_UPGRADE] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {

    }
});

networkManager.packetMap[gv.CMD.SHOP_BUY_GOLD] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {

    }
});

networkManager.packetMap[gv.CMD.ITEM_CHEST_BUY] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
        if (this.getError() === gv.ERROR.SUCCESS) {
            this.listRewardFromChest = [
                {
                    type: CHEST.REWARD.GOLD,
                    amount: this.getInt(),
                },
                {
                    type: CHEST.REWARD.FRAGMENT,
                    cardId: this.getInt(),
                    amount: this.getInt(),
                },
                {
                    type: CHEST.REWARD.FRAGMENT,
                    cardId: this.getInt(),
                    amount: this.getInt(),
                },
            ];
        }
    }
});

networkManager.packetMap[gv.CMD.ITEM_PIECE_CARD_BUY] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {

    }
});



networkManager.packetMap[gv.CMD.USER_SHOP_INFO] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
        let numberItem = this.getInt();
        this.listItem = [];
        for (let i=0;i<numberItem;++i) {
            this.listItem.push({
                index: this.getInt(),
                status: this.getInt(),
                amount: this.getInt(),
                pieceID: this.getInt(),
                cost: this.getInt()
            });
        }
        let numberGoldItem = this.getInt();
        this.listGoldItem = [];
        for (let i=0;i<numberGoldItem;++i) {
            this.listGoldItem.push({
                index: this.getInt(),
                gold: this.getInt(),
                gem: this.getInt(),
            })
        }
    }
});

networkManager.packetMap[gv.CMD.FIND_MATCH] = fr.InPacket.extend({
    ctor: function () {
        this._super();
        this.reset()
    },

    loadDeskCard: function (list) {
        for (let i = 0; i < 8; i++) {
            list.push(this.getInt())
        }
    },

    loadBuff: function (list) {
        for (let i=0; i<3; ++i) {
            list.push(cc.p(this.getInt(), this.getInt()))
        }
    },

    loadTree: function (list) {
        let numberTreePlayer = this.getInt()
        if(numberTreePlayer > 2) numberTreePlayer = 2;
        for (let i = 0; i < numberTreePlayer; i++) {
            list.push(cc.p(this.getInt(), this.getInt()))
        }
    },

    loadHole: function () {
        return cc.p(this.getInt(), this.getInt())
    },

    loadVirtualPath: function (list){
        let numberPositionVirtualPathPlayer = this.getInt()
        for (let i = 0; i < numberPositionVirtualPathPlayer; i++) {
            list.push(cc.p(this.getInt(), this.getInt()))
        }
    },

    reset: function () {
        this.listPlayerDeskCard = []
        this.listPlayerDeskCardLevel = []

        this.listOpponentDeskCard = []
        this.listOpponentDeskCardLevel = []

        this.arrPositionBuffPlayer = []
        this.arrPositionTreePlayer = []
        this.positionHolePlayer = {}
        this.arrVirtualPathPlayer = []

        this.arrPositionBuffOpponent = []
        this.arrPositionTreeOpponent = []
        this.positionHoleOpponent = {}
        this.arrVirtualPathOpponent = []
    },

    readData: function () {
        this.reset()

        this.opponentName = this.getString()
        this.opponentFame = this.getInt()
        this.randomSeed = this.getInt()

        this.loadDeskCard(this.listPlayerDeskCard)
        this.loadDeskCard(this.listPlayerDeskCardLevel)

        this.loadDeskCard(this.listOpponentDeskCard)
        this.loadDeskCard(this.listOpponentDeskCardLevel)

        this.loadBuff(this.arrPositionBuffPlayer)
        this.loadTree(this.arrPositionTreePlayer)
        this.positionHolePlayer = this.loadHole()
        this.loadVirtualPath(this.arrVirtualPathPlayer)

        this.loadBuff(this.arrPositionBuffOpponent)
        this.loadTree(this.arrPositionTreeOpponent)
        this.positionHoleOpponent = this.loadHole()
        this.loadVirtualPath(this.arrVirtualPathOpponent)
    }
});

networkManager.packetMap[gv.CMD.CHEST_CHEAT] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {

    }
});

networkManager.packetMap[gv.CMD.CANCLE_MATCH] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {

    }
});

networkManager.packetMap[gv.CMD.LOOP_MAX] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
        this.loopMax = this.getInt()
        this.frameRunAction = this.getInt()
        let numberOfAction = this.getInt()
        this.listAction = []
        for (var i = 0; i < numberOfAction; i++) {
            var cmdID = this.getInt()
            var userID = this.getInt()
            var errorCode = this.getInt()
            var action = new ActionBattle(userID, cmdID, errorCode, this.frameRunAction)
            if (errorCode === gv.ERROR.SUCCESS) {
                switch (cmdID) {
                    case gv.CMD.SUMMON_SYSTEM_MONSTER: {
                        break;
                    }
                    case gv.CMD.DROP_MONSTER: {
                        action.indexCard = this.getInt()
                        break;
                    }
                    case gv.CMD.DROP_SPELL: {
                        action.indexCard = this.getInt()
                        action.coordinateX = this.getInt()
                        action.coordinateY = this.getInt()
                        action.map = this.getInt()
                        break;
                    }
                    case gv.CMD.DROP_TOWER: {
                        action.indexCard = this.getInt()
                        action.coordinateX = this.getInt()
                        action.coordinateY = this.getInt()
                        break;
                    }
                    case gv.CMD.TARGET_OBSTACLE: {
                        action.coordinateX = this.getInt();
                        action.coordinateY = this.getInt();
                        break;
                    }
                    case gv.CMD.CANCEL_TOWER: {
                        action.coordinateX = this.getInt();
                        action.coordinateY = this.getInt();
                        break;
                    }
                    case gv.CMD.CHANGE_TARGET_TOWER: {
                        action.coordinateX = this.getInt();
                        action.coordinateY = this.getInt();
                        action.targetMode = this.getInt();
                        break;
                    }
                    case gv.CMD.END_BATTLE: {
                        // add code here
                        break;
                    }
                    case gv.CMD.CANCEL_CARD: {
                        action.indexCard = this.getInt()
                        break;
                    }
                }
            }
            this.listAction.push(action)
        }
    }
});

networkManager.packetMap[gv.CMD.END_BATTLE] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
        this.winner = this.getInt();
        this.frameEnd = this.getInt();
        this.amountFame = this.getInt();
    }
});