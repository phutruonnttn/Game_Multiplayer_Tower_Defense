/**
 * Created by Team 2 - LongLH - GDF 17 on 4/11/2022.
 */


var LobbyHomeListChest = cc.Class.extend({

    ctor: function (layoutChests) {
        this.layoutChests = layoutChests;
        this.initLobbyListChest();
    },

    initLobbyListChest: function () {
        this.listSlots = this.layoutChests.getChildren();
        for (let idx in this.listSlots) {
            let chestUI = new LobbyHomeChest(gv.user.listChest[idx]);
            this.listSlots[idx].addChild(chestUI);
            this.listSlots[idx] = chestUI;
        }
    },

    size: function () {
        return this.listSlots.length;
    },

    setChest: function (idx, chest) {
        this.listSlots[idx].setChest(chest);
    },

});