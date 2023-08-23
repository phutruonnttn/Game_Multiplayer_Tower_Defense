/**
 * Created by Team 2 - LongLH - GDF 17 on 4/11/2022.
 */


var LobbyHomeChest = cc.Node.extend({

    _btnChest: "btnChest",

    _layoutEmpty: "layoutEmpty",
    _layoutPending: "layoutPending",
    _layoutOpening: "layoutOpening",
    _layoutFinished: "layoutFinished",

    _txtStatus: "txtStatus",
    _txtCD: "txtCD",
    _imgCurrencyIcon: "imgCurrencyIcon",
    _txtQuickCost: "txtQuickCost",

    ctor: function (chest) {
        this._super();
        this.initLobbyHomeChest();
        this.setChest(chest);
    },

    initLobbyHomeChest: function () {
        this.chestUISource = ccs.load(res.lobby_chest_list_ui, "").node;

        this.btnChest = this.chestUISource.getChildByName(this._btnChest).clone();
        this.btnChest.setPosition(cc.p(0,0));
        this.addChild(this.btnChest);

        this.layoutEmpty = this.initLayout(this._layoutEmpty);
        this.layoutPending = this.initLayout(this._layoutPending);
        this.layoutOpening = this.initLayout(this._layoutOpening);
        this.layoutFinished = this.initLayout(this._layoutFinished);
    },

    setChest: function (chest) {
        this.chest = chest;
        this.updateUI();
    },

    initLayout: function (layout_name) {
        let layout = this.chestUISource.getChildByName(layout_name).clone();
        layout.setVisible(false);
        layout.setPosition(cc.p(0,0));
        layout.setSwallowTouches(false);
        this.addChild(layout);
        return layout;
    },

    onChestEmpty: function () {
        this.disableCurrentState();
        this.setCurrentLayout(this.layoutEmpty);

        this.btnChest.addClickEventListener(function () {});
    },

    onChestPending: function () {
        this.disableCurrentState();
        this.setCurrentLayout(this.layoutPending);

        this.btnChest.addClickEventListener(this.showPopup.bind(this));
        this.txtCD = this.layoutPending.getChildByName(this._txtCD);
        this.txtStatus = this.layoutPending.getChildByName(this._txtStatus);

        this.txtCD.setString(Time.secondToShortStr(CHEST.TREASURES[this.chest.type].UNLOCK_DURATION));
        this.txtStatus.setString(CHEST.TREASURES[this.chest.type].NAME);
    },

    onChestOpening: function () {
        this.disableCurrentState();
        this.setCurrentLayout(this.layoutOpening);

        this.btnChest.addClickEventListener(this.showPopup.bind(this));
        this.txtCD = this.layoutOpening.getChildByName(this._txtCD);
        this.txtQuickCost = this.layoutOpening.getChildByName(this._txtQuickCost);
        this.imgCurrencyIcon = this.layoutOpening.getChildByName(this._imgCurrencyIcon);
        this.updateOpening();
        this.scheduleUpdate();
    },

    onChestFinished: function () {
        this.disableCurrentState();
        this.setCurrentLayout(this.layoutFinished);

        this.btnChest.addClickEventListener(this.chest.requestReward.bind(this.chest));
    },

    disableCurrentState: function () {
        if (this.currentLayout === undefined)
            return;
        this.currentLayout.setVisible(false);
        this.unscheduleUpdate();
    },

    setCurrentLayout: function (layout) {
        this.currentLayout = layout;
        this.currentLayout.setVisible(true);
    },

    updateUI: function () {
        if (this.chest === null || this.chest === undefined)
            this.onChestEmpty();
        else if (this.chest.isPending())
            this.onChestPending();
        else if (this.chest.isOpening())
            this.onChestOpening();
        else
            this.onChestFinished();
    },

    showPopup: function () {
        Popup.create(new LobbyHomeChestPopup(this.chest));
    },

    updateOpening: function () {
        if (this.chest.getCD() <= 0)
            this.onChestFinished();
        else {
            this.txtCD.setString(Time.secondToShortStr(this.chest.getCD()));
            this.txtQuickCost.setString(this.chest.getQuickOpenCost());
            this.txtQuickCost.setPositionX(this.btnChest.width / 2 - this.imgCurrencyIcon.width * this.imgCurrencyIcon.getScaleX() / 2 - this.imgCurrencyIcon.width * this.imgCurrencyIcon.getScaleX() / 10);
            this.imgCurrencyIcon.setPositionX(this.btnChest.width / 2 + this.txtQuickCost.width * this.txtQuickCost.getScaleX() / 2 + this.imgCurrencyIcon.width * this.imgCurrencyIcon.getScaleX() / 10);
        }
    },

    update: function (dt) {
        this.updateOpening();
    }

});