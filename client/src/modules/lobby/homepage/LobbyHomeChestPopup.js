/**
 * Created by Team 2 - LongLH - GDF 17 on 4/11/2022.
 */


var LobbyHomeChestPopup = Popup.extend({

    _layoutBase: "layoutChestBase",
    _layoutQuickOpen: "layoutQuickOpen",
    _layoutDetail: "layoutDetail",

    _txtGold: "txtGold",
    _txtCard: "txtCard",
    _btnClose: "btnClose",

    _txtOpenTime: "txtOpenTime",
    _btnUnlockChest: "btnUnlockChest",
    _txtQuickCost: "txtCost",

    ctor: function (chest) {
        this._super();
        this.initLobbyChestPopup(chest);
    },

    initLobbyChestPopup: function (chest) {
        this.lobbyChestPopupUI = ccs.load(res.lobby_chest_popup_ui, "").node;
        this.layoutBack = this.lobbyChestPopupUI.getChildByName(this._layoutBase).clone();
        this.chest = chest;

        this.initState();
        this.initGoldReward();
        this.initCardReward();
        this.initOpenTime();
        this.initBtnClose();
        this.initAnimation();

        this.addChild(this.animation);
        this.addChild(this.layoutBack);
        this.addChild(this.layoutFront);
    },

    initAnimation: function () {
        this.animation = fr.createAtlasAnimation(resAni.chest_vip);
        this.animation.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 + this.layoutBack.height/2);
        this.animation.setAnimation(0, resAniId.chest_vip.animation, true);
    },

    initState: function () {
        if (this.chest.isOpening() === true || this.chest.canOpen() === false) {
            this.layoutFront = this.lobbyChestPopupUI.getChildByName(this._layoutQuickOpen).clone();
            this.initBtnQuickOpen();
        }
        else {
            this.layoutFront = this.lobbyChestPopupUI.getChildByName(this._layoutDetail).clone();
            this.initBtnDetail();
        }
    },

    initGoldReward: function () {
        let txtGold = this.layoutBack.getChildByName(this._txtGold);
        txtGold.setString(CHEST.TREASURES[this.chest.type].REWARDS.MIN_GOLD+" - "+CHEST.TREASURES[this.chest.type].REWARDS.MAX_GOLD);
    },

    initCardReward: function () {
        let txtCard = this.layoutBack.getChildByName(this._txtCard);
        txtCard.setString(CHEST.TREASURES[this.chest.type].REWARDS.MIN_FRAGMENT+" - "+CHEST.TREASURES[this.chest.type].REWARDS.MAX_FRAGMENT);
    },

    initBtnClose: function () {
        let btnClose = this.layoutBack.getChildByName(this._btnClose);
        btnClose.addClickEventListener(this.destroy.bind(this));
    },

    initOpenTime: function () {
        this.txtOpenTime = this.layoutFront.getChildByName(this._txtOpenTime);
        this.txtOpenTime.setString(Time.secondToShortStr(this.chest.getCD()));
    },

    initBtnDetail: function () {
        this.btnUnlockChest = this.layoutBack.getChildByName(this._btnUnlockChest);
        this.btnUnlockChest.addClickEventListener(function (event, customEventData) {
            this.chest.open();
            this.destroy();
        }.bind(this));
    },

    initBtnQuickOpen: function () {
        this.btnUnlockChest = this.layoutBack.getChildByName(this._btnUnlockChest);
        this.btnUnlockChest.addClickEventListener(function (event, customEventData) {
            this.chest.quickOpen();
            this.destroy();
        }.bind(this));
        this.txtQuickCost = this.layoutFront.getChildByName(this._txtQuickCost);
        this.txtQuickCost.setString(this.chest.getQuickOpenCost());
        if (gv.user.hasEnoughGem(this.chest.getQuickOpenCost()) === false) {
            this.txtQuickCost.setTextColor(cc.color(gv.COLOR.ERROR));
            this.btnUnlockChest.setTouchEnabled(false);
        }
        this.scheduleUpdate();
    },

    updateOpening: function () {
        if (this.txtOpenTime === undefined || this.txtQuickCost === undefined)
            return;
        if (this.chest.isFinished()) {
            this.removeFromParent(true);
            return;
        }
        this.txtOpenTime.setString(Time.secondToShortStr(this.chest.getCD()));
        this.txtQuickCost.setString(this.chest.getQuickOpenCost());
    },

    update: function (dt) {
        this.updateOpening();
    },

});