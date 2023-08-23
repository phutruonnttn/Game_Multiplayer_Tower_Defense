/**
 * Created by Team 2 - LongLH - GDF 17 on 31/10/2022.
 */


 var User = cc.Class.extend({

    ctor: function () {
        gv.user = this;
        this.name = gv.USER.DEFAULT_NAME;
        this.avatar = gv.USER.DEFAULT_AVATAR;
        this.loadFakeData();
    },

    loadCard: function (listCardInfo) {
        this.listCard = new Array(listCardInfo.length);
        for (let idx in listCardInfo)
            this.listCard[listCardInfo[idx].id] = new Card(listCardInfo[idx]);
        if (gv.lobby !== undefined) {
            gv.lobby.lobbyCardPage.lobbyInventoryCollection.initLobbyInventoryCollection();
            gv.lobby.lobbyCardPage.updateUI();
        }
    },

    loadDeck: function (listCardIdInDeck) {
        this.deck = new Array(listCardIdInDeck.length);
        for (let idx in listCardIdInDeck) {
            this.deck[idx] = this.listCard[listCardIdInDeck[idx]];
            this.deck[idx].idInDeck = idx;
        }
        if (gv.lobby !== undefined) {
            gv.lobby.lobbyCardPage.lobbyInventoryDeck.initLobbyInventoryDeck();
            gv.lobby.lobbyCardPage.updateUI();
        }
    },

    loadChest: function (chestsInfo) {
        this.listChest = new Array(CHEST.MAX_CHEST);
        for (let idx=0;idx<this.listChest.length;++idx)
            this.setChest(idx, null);
        for (let idx in chestsInfo.listChest) {
            let chest = new Chest(chestsInfo.listChest[idx].id);
            if (chestsInfo.listChest[idx].finished)
                chest.setCD(0);
            if (chest.id === chestsInfo.unlockingChestID)
                chest.setCD(chestsInfo.unlockingChestCD);
            this.setChest(chestsInfo.listChest[idx].id, chest);
        }
    },

    loadStat: function (stats) {
        let deltaGold = stats.gold - this.gold;
        let deltaGem = stats.gem - this.gem;
        let deltaFame = stats.fame - this.fame;
        this.level = stats.level;
        this.exp = stats.exp;
        this.gold = stats.gold;
        this.gem = stats.gem;
        this.fame = stats.fame;
        this.name = stats.name;
        if (gv.lobby !== undefined) {
            gv.lobby.lobbyHomePage.updatePlayerInfo();
            gv.lobby.lobbyHomePage.updateFame(deltaFame);
            gv.lobby.lobbyGem.updateUI(deltaGem);
            gv.lobby.lobbyGold.updateUI(deltaGold);
        }
    },

    hasEnoughGem: function (gemValue) {
        return this.gem >= gemValue;
    },

    hasEnoughGold: function (goldValue) {
        return this.gold >= goldValue;
    },

    addGoldRaw: function (amount) {
        this.gold += amount;
    },

    addGold: function (amount) {
        if (amount < 0)
            return;
        if (Math.round(amount) !== amount)
            return;
        this.gold += amount;
        gv.lobby.lobbyGold.updateUI(amount);
    },

    subGold: function (amount) {
        if (this.gold < amount)
            return;
        if (Math.round(amount) !== amount)
            return;
        this.gold -= amount;
        gv.lobby.lobbyGold.updateUI(-amount);
    },

    addGem: function (amount) {
        if (amount < 0)
            return;
        if (Math.round(amount) !== amount)
            return;
        this.gem += amount;
        gv.lobby.lobbyGem.updateUI(amount);
    },

    subGem: function (amount) {
        if (this.gem < amount)
            return;
        if (Math.round(amount) !== amount)
            return;
        this.gem -= amount;
        gv.lobby.lobbyGem.updateUI(-amount);
    },

    addCardFragment: function (cardID, amount) {
        this.listCard[cardID].addFragment(amount);
    },

    getEmptyChestSlot: function () {
        for (let idx in this.listChest)
            if (this.listChest[idx] === null || this.listChest[idx] === undefined)
                return idx;
        cc.log("No Chest Slot");
        return -1;
    },

    setChest: function (idx, chest) {
        if (idx === undefined)
            return;
        this.listChest[idx] = chest;
        if (gv.lobby !== undefined)
            gv.lobby.lobbyHomePage.lobbyHomeListChest.setChest(idx, chest);
    },

    canOpenChest: function () {
        for (let idx in this.listChest)
            if (this.listChest[idx] != null && this.listChest[idx].isOpening())
                return false;
        return true;
    },

    receiveRewardFromChest: function (listRewardFromChest) {
        RewardFromChestUI.run(listRewardFromChest);
        for (let idx in listRewardFromChest) {
            let reward = listRewardFromChest[idx];
            switch (reward.type) {
                case CHEST.REWARD.GOLD:
                    this.addGold(reward.amount);
                    break;
                case CHEST.REWARD.FRAGMENT:
                    this.addCardFragment(reward.cardId, reward.amount);
                    break;
            }
        }
    },

    loadFakeData: function () {
        this.loadCard([
            {id: 0, level: 10, fragment: 9999,},
            {id: 1, level: 10, fragment: 10,},
            {id: 2, level: 10, fragment: 10,},
            {id: 3, level: 10, fragment: 10,},
            {id: 4, level: 10, fragment: 990,},
            {id: 5, level: 10, fragment: 10,},
            {id: 6, level: 1, fragment: 10,},
            {id: 7, level: 1, fragment: 10,},
            {id: 8, level: 1, fragment: 10,},
            {id: 9, level: 9, fragment: 1000,},
            {id: 10, level: 1, fragment: 10,},
            {id: 11, level: 4, fragment: 10,},
            {id: 12, level: 4, fragment: 10,},
            {id: 13, level: 4, fragment: 10,},
            {id: 14, level: 4, fragment: 10,},
            {id: 15, level: 4, fragment: 100,},
            {id: 16, level: 4, fragment: 10,},
            {id: 17, level: 4, fragment: 10,},
        ]);
        this.loadDeck([11, 12, 11, 14, 15, 12, 14, 15]);
        this.loadChest({
            listChest: [],
            unlockingChestID: -1,
            unlockingChestCD: 0,
        });
        this.loadStat({
            level: 10,
            exp: 0,
            gold: 0,
            gem: 0,
            fame: 0,
            name: "User_LONG_1234567890",
        });
    },

});