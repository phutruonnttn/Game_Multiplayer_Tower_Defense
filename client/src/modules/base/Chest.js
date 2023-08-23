/**
 * Created by Team 2 - LongLH - GDF 17 on 4/11/2022.
 */


 var Chest = cc.Class.extend({

    ctor: function (id) {
        this.type = 0;
        if (id !== undefined)
            this.id = Number(id);
        this.initChest();
    },

    initChest: function () {

    },

    getName: function () {
        return CHEST.TREASURES[this.type].NAME
    },

    getImagePath: function () {
        return res.chest_image[this.type]
    },

    setCD: function (second) {
        this.timestampUnlocked = Date.now() + Time.secondToMilisec(second);
    },

    getCD: function () {
        if (this.timestampUnlocked !== undefined)
            if (this.timestampUnlocked > Date.now())
                return Time.milisecToSecond(this.timestampUnlocked - Date.now());
            else
                return 0;
        else
            return CHEST.TREASURES[this.type].UNLOCK_DURATION;
    },

    getQuickOpenCost: function () {
        return Math.ceil(this.getCD()/CHEST.SECOND_PER_COIN);
    },

    isPending: function () {
        return this.timestampUnlocked === undefined;
    },

    canOpen: function () {
        return this.isPending() === true && gv.user.canOpenChest() === true;
    },

    open: function () {
        if (!this.canOpen())
            return;
        // report to server
        getUserController().sendOpenChest(this.id);

        this.setCD(CHEST.TREASURES[this.type].UNLOCK_DURATION);
        gv.lobby.lobbyHomePage.lobbyHomeListChest.listSlots[this.id].updateUI();
    },

    isOpening: function () {
        return this.isPending() === false && this.getCD() > 0;
    },

    isFinished: function () {
        return this.isPending() === false && this.isOpening() === false;
    },

    requestReward: function () {
        if (!this.isFinished())
            return;
        gv.user.setChest(this.id, null);

        // report to server
        getUserController().sendRequestReward(this.id);
    },

    quickOpen: function () {
        if (!gv.user.hasEnoughGem(this.getQuickOpenCost()))
            return;
        gv.user.subGem(this.getQuickOpenCost());
        this.setCD(0);
        this.requestReward();
    },

});