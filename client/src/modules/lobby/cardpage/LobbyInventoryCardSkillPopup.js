

var LobbyInventoryCardSkillPopup = Popup.extend({

    _layoutBase: "layoutBase",

    _btnClose: "btnClose",
    _btnBack: "btnBack",
    _imgSkillIcon: "imgSkillIcon",
    _imgSkillLock: "imgSkillLock",
    _txtName: "txtName",
    _txtDescribe: "txtDescribe",
    _txtUnlock: "txtUnlock",

    _layoutStat: "layoutStat",
    _imgStatIcon: "imgStatIcon",
    _txtStatDescribe: "txtStatDescribe",
    _txtStat: "txtStat",


    ctor: function (card, prevPopup) {
        this._super(prevPopup);
        this.card = card;
        this.initLobbyInventoryCardSkillPopup();
    },

    initLobbyInventoryCardSkillPopup: function () {
        if (CARD.GLOBAL_ID[this.card.id].TYPE !== CARD.TOWER_TYPE)
            return;
        this.cardSkilPopupUI = ccs.load(res.card_skill_popup_ui, "").node;
        this.layoutBase = this.cardSkilPopupUI.getChildByName(this._layoutBase).clone();
        this.addChild(this.layoutBase);

        this.skillConfig = CARD.SKILL[this.card.id];

        this.initBtnClose();
        this.initBtnBack();
        this.initIcon();
        this.initUnlockStatus();
        this.initName();
        this.initDescribe();
        this.initSkillStat();
    },

    initBtnClose: function () {
        let btnClose = this.layoutBase.getChildByName(this._btnClose);
        btnClose.addClickEventListener(this.destroy.bind(this));
    },

    initBtnBack: function () {
        let btnBack = this.layoutBase.getChildByName(this._btnBack);
        btnBack.addClickEventListener(this.back.bind(this));
    },

    initIcon: function () {
        let imgSkillIcon = this.layoutBase.getChildByName(this._imgSkillIcon);
        imgSkillIcon.loadTexture(this.skillConfig.ICON);
    },

    initUnlockStatus: function () {
        let imgSkillLock = this.layoutBase.getChildByName(this._imgSkillLock);
        let txtUnlock = this.layoutBase.getChildByName(this._txtUnlock);
        if (this.card.hasSkill()) {
            imgSkillLock.removeFromParent(true);
            txtUnlock.removeFromParent(true);
        }
    },

    initName: function () {
        let txtName = this.layoutBase.getChildByName(this._txtName);
        txtName.setString(this.skillConfig.NAME);
    },

    initDescribe: function () {
        let txtDescribe = this.layoutBase.getChildByName(this._txtDescribe);
        txtDescribe.setString(this.skillConfig.DESCRIPTION);
    },

    initSkillStat: function () {
        let layoutStat = this.layoutBase.getChildByName(this._layoutStat);
        layoutStat.removeFromParent(true);

        this.listStat = [];
        for (let key in this.skillConfig.STAT) {
            let stat = layoutStat.clone();
            stat.getChildByName(this._imgStatIcon).loadTexture(this.skillConfig.STAT[key].label.icon);
            stat.getChildByName(this._txtStatDescribe).setString(this.skillConfig.STAT[key].label.text);
            stat.getChildByName(this._txtStat).enableOutline(cc.color(cc.BLACK), 1);
            stat.getChildByName(this._txtStat).setString(this.skillConfig.STAT[key].value);
            this.layoutBase.addChild(stat);
            this.listStat.push(stat);
        }

        this.listStat.forEach(function (value, index) {
            value.setPositionX(this.layoutBase.width / this.listStat.length * (index + 0.5));
        }, this);
    }

});