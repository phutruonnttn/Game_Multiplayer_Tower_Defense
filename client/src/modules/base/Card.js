/**
 * Created by Team 2 - LongLH - GDF 17 on 7/11/2022.
 */


var Card = cc.Class.extend({

    ctor: function (cardInfo) {
        this.id = cardInfo.id;
        this.level = cardInfo.level;
        this.fragment = cardInfo.fragment;
        this.initCard();
    },

    getStat: function () {
        if (this.stat == null)
            this.stat = JsonConfig.getInstance().getStatCard(this.id);
        return this.stat;
    },

    initCard: function () {
        this.initSpecificConfig();
    },

    initSpecificConfig: function () {
        let idInJsonFile = this.getIdInJsonFile();
        let type = this.getType();
        switch (type) {
            case CARD.MONSTER_TYPE:
                this.specificConfig = gv.MONSTER_JSON.monster[idInJsonFile];
                break;
            case CARD.POTION_TYPE:
                this.specificConfig = gv.POTION_JSON.potion[idInJsonFile];
                break;
            case CARD.TOWER_TYPE:
                this.specificConfig = gv.TOWER_JSON.tower[idInJsonFile];
                break;
        }
    },

    getIdInJsonFile: function () {
        return CARD.GLOBAL_ID[this.id].ID;
    },

    getImageCardPath: function () {
        return res.card.image[this.id]
    },

    getBorderCardPath: function () {
        return res.card.background[this.getRank()].border
    },

    getBackgroundCardPath: function (){
        return res.card.background[this.getRank()].background
    },

    getType: function () {
        return CARD.GLOBAL_ID[this.id].TYPE
    },

    getEnergy: function () {
        return JsonConfig.getInstance().getStatCard(this.id).getEnergy();
    },

    getName: function () {
        var idInJsonFile = CARD.GLOBAL_ID[this.id].ID
        var type = this.getType()
        switch (type) {
            case CARD.MONSTER_TYPE:
                return gv.MONSTER_JSON.monster[idInJsonFile].name
            case CARD.POTION_TYPE:
                return gv.POTION_JSON.potion[idInJsonFile].name
            case CARD.TOWER_TYPE:
                return gv.TOWER_JSON.tower[idInJsonFile].name
        }
    },

    getRank: function () {
        return CARD.RANK[this.level];
    },

    getNameUI: function () {
        return CARD.GLOBAL_ID[this.id].NAME;
    },

    getProgress: function () {
        if (this.isMaxLevel())
            return 100;
        return this.fragment / CARD.UPGRADE[this.level].FRAGMENTS * 100;
    },

    getProgressStr: function () {
        if (this.isMaxLevel())
            return "MAX";
        return this.fragment+"/"+CARD.UPGRADE[this.level].FRAGMENTS;
    },

    getGlow: function () {
        return res.card.background[this.getRank()].glow;
    },

    getMiniature: function (evolution = 1) {
        return res.card.miniature[this.id][evolution-1];
    },

    getParticleMiniature: function () {
        return res.card.background[this.getRank()].miniature_particle;
    },

    getDescribe: function () {
        return CARD.DESCRIPTION[this.id];
    },

    isMaxLevel: function () {
        return CARD.UPGRADE[this.level] === undefined;
    },

    hasSkill: function () {
        if (CARD.GLOBAL_ID[this.id].TYPE === CARD.TOWER_TYPE)
            return this.level >= CARD.UNLOCK_TOWER_SKILL_LEVEL;
        return false;
    },

    enoughFragmentForUpgrade: function () {
        if (this.isMaxLevel())
            return true;
        return this.fragment >= CARD.UPGRADE[this.level].FRAGMENTS;
    },

    canUpgrade: function () {
        if (this.isMaxLevel())
            return false;
        if (this.enoughFragmentForUpgrade() === false)
            return false;
        if (!gv.user.hasEnoughGold(CARD.UPGRADE[this.level].GOLD))
            return false;
        return true;
    },

    addFragment: function (amount) {
        if (amount < 0)
            return;
        if (Math.round(amount) !== amount)
            return;
        this.fragment += amount;
        this.updateUI();
    },

    subFragment: function (amount) {
        if (this.fragment < amount)
            return;
        if (Math.round(amount) !== amount)
            return;
        this.fragment -= amount;
        this.updateUI();
    },

    upgrade: function () {
        if (!this.canUpgrade())
            return false;

        // report to server
        getUserController().sendUpgradeCard(this.id);

        gv.user.subGold(CARD.UPGRADE[this.level].GOLD);
        this.subFragment(CARD.UPGRADE[this.level].FRAGMENTS);
        this.level += 1;
        this.updateUI();
    },

    isInDeck: function () {
        if (this.idInDeck === undefined)
            return false;
        return gv.user.deck[this.idInDeck].id === this.id;
    },

    toDeck: function (index) {
        // report to server
        getUserController().sendSetCardToDeck(this.id, index);

        gv.user.deck[index] = this;
        this.idInDeck = index;
    },

    updateUI: function () {
        if (gv.lobby !== undefined)
            gv.lobby.lobbyCardPage.updateUI();
    }

});