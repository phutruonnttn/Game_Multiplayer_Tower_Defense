/**
 * Created by Team 2 - LongLH - GDF 17 on 10/11/2022.
 */


var PopupCardInfo = Popup.extend({

    _layoutBase: "layoutBase",
    _btnClose: "btnClose",
    _imgGlow: "imgGlow",
    _txtName: "txtName",
    _txtEvolution: "txtEvolution",
    _txtDescribe: "txtDescribe",

    _btnEvolutionUp: "btnEvolutionUp",
    _btnEvolutionDown: "btnEvolutionDown",

    _layoutStat: "layoutStat",
    _imgStatIcon: "imgStatIcon",
    _txtStatDescribe: "txtStatDescribe",
    _txtStat: "txtStat",
    _txtStatUpgrade: "txtStatUpgrade",

    _layoutNode: "layoutNode",
    _nodeCardItem: "nodeCardItem",
    _nodeMiniature: "nodeMiniature",
    _nodeStartFirstRow: "nodeStartFirstRow",
    _nodeEndFirstRow: "nodeEndFirstRow",
    _nodeOx: "nodeOx",
    _nodeOy: "nodeOy",

    _layoutRankRequire: "layoutRequire",
    _txtRankRequire: "txtRequire",

    ctor: function (card) {
        this._super();
        this.card = card;
        this.initPopupCardInfo();
    },

    initPopupCardInfo: function () {
        this.cardPopupUI = ccs.load(res.card_popup_ui, "").node;

        this.layoutBase = this.cardPopupUI.getChildByName(this._layoutBase).clone();
        this.addChild(this.layoutBase);

        this.initBtnClose();
        this.initCardItem();
        this.initMiniature();
        this.initGlow();
        this.initParticleMiniature();
        this.initBtnEvolution();
        this.initName();
        this.initTxtEvolution();
        this.initDescribe();
        this.initStat();
        this.initRankRequire();

        this.updatePopupCardInfoUI();

        this.evolution = 1;
        this.updateEvolution(0);
    },

    initBtnClose: function () {
        let btnClose = this.layoutBase.getChildByName(this._btnClose);
        btnClose.addClickEventListener(this.destroy.bind(this));
    },

    initCardItem: function () {
        this.cardItem = new LobbyInventoryCardItem(this.card);
        this.cardItem.btnCard.setTouchEnabled(false);
        this.cardItem.setPosition(this.cardPopupUI.getChildByName(this._layoutNode).getChildByName(this._nodeCardItem));
        this.addChild(this.cardItem);
    },

    initMiniature: function () {
        this.imgMiniature = new ccui.ImageView(this.card.getMiniature(this.evolution));
        this.imgMiniature.setAnchorPoint(cc.p(0.5, 0));
        this.imgMiniature.setPosition(this.cardPopupUI.getChildByName(this._layoutNode).getChildByName(this._nodeMiniature));
        this.addChild(this.imgMiniature);
    },

    initGlow: function () {
        this.imgGlow = this.layoutBase.getChildByName(this._imgGlow);
    },

    initParticleMiniature: function () {
        if (this.particleMiniature !== undefined)
            this.particleMiniature.removeFromParent(true);
        this.particleMiniature = cc.ParticleSystem(this.card.getParticleMiniature());
        this.addChild(this.particleMiniature);
        this.particleMiniature.setPosition(this.imgMiniature.getPosition());
        this.particleMiniature.y += this.imgMiniature.height/2;
    },

    initBtnEvolution: function () {
        let btnEvolutionUp = this.layoutBase.getChildByName(this._btnEvolutionUp);
        let btnEvolutionDown = this.layoutBase.getChildByName(this._btnEvolutionDown);
        if (this.card.getType() !== CARD.TOWER_TYPE) {
            btnEvolutionUp.removeFromParent(true);
            btnEvolutionDown.removeFromParent(true);
        }
        else {
            this.btnEvolutionUp = btnEvolutionUp;
            this.btnEvolutionDown = btnEvolutionDown;
        }
    },

    initName: function () {
        let txtName = this.layoutBase.getChildByName(this._txtName);
        txtName.setString(this.card.getNameUI().toUpperCase());
        txtName.enableOutline(cc.color(cc.BLACK), 1);
    },

    initTxtEvolution: function () {
        this.txtEvolution = this.layoutBase.getChildByName(this._txtEvolution);
        if (this.card.getType() !== CARD.TOWER_TYPE)
            this.txtEvolution.removeFromParent(true);
    },

    initDescribe: function () {
        this.txtDescribe = this.layoutBase.getChildByName(this._txtDescribe);
        this.txtDescribe.setString(this.card.getDescribe());
    },

    initStatPosition: function () {
        let layoutNode = this.cardPopupUI.getChildByName(this._layoutNode);

        let nodeStartFirstRow = layoutNode.getChildByName(this._nodeStartFirstRow);
        let nodeEndFirstRow = layoutNode.getChildByName(this._nodeEndFirstRow);
        let nodeOx = layoutNode.getChildByName(this._nodeOx);
        let nodeOy = layoutNode.getChildByName(this._nodeOy);

        this.statPos = {};
        this.statPos.origin = nodeStartFirstRow.getPosition();
        this.statPos.dx = nodeOx.x - nodeStartFirstRow.x;
        this.statPos.dy = nodeOy.y - nodeStartFirstRow.y;
        this.statPos.nCol = Math.ceil((nodeEndFirstRow.x - nodeStartFirstRow.x) / this.statPos.dx) + 1;
    },

    getStatPosition: function (idx) {
        let x = this.statPos.origin.x + this.statPos.dx * (idx % this.statPos.nCol);
        let y = this.statPos.origin.y + this.statPos.dy * Math.floor(idx / this.statPos.nCol);
        return cc.p(x,y);
    },

    initStat: function () {
        this.initStatPosition();
        let layoutStat = this.layoutBase.getChildByName(this._layoutStat);
        layoutStat.removeFromParent(true);
        let idx = 0;
        this.stat = {};
        for (let key in CARD.UI_STAT[this.card.id]) {
            let stat = layoutStat.clone();
            stat.getChildByName(this._imgStatIcon).loadTexture(CARD.UI_STAT[this.card.id][key].icon);
            stat.getChildByName(this._txtStatDescribe).setString(CARD.UI_STAT[this.card.id][key].text);
            stat.setPosition(this.getStatPosition(idx++));
            stat.getChildByName(this._txtStat).enableOutline(cc.color(cc.BLACK), 1);
            stat.getChildByName(this._txtStatUpgrade).enableOutline(cc.color(cc.BLACK), 1);
            this.addChild(stat);
            this.stat[key] = stat;
        }
    },

    initRankRequire: function () {
        if (this.card.getType() !== CARD.TOWER_TYPE)
            return;
        this.layoutRankRequire = this.cardPopupUI.getChildByName(this._layoutRankRequire).clone();
        this.txtRankRequire = this.layoutRankRequire.getChildByName(this._txtRankRequire);
        this.addChild(this.layoutRankRequire);
    },

    updateEvolution: function (delta) {
        if (this.card.getType() !== CARD.TOWER_TYPE)
            return;
        this.evolution += Number(delta);
        this.updateImgMiniature();
        this.updateTxtEvolution();
        this.updateBtnEvolution();
        this.updateStat();
        this.updateRankRequire();
    },

    updateImgMiniature: function () {
        this.imgMiniature.loadTexture(this.card.getMiniature(this.evolution));
    },

    updateTxtEvolution: function () {
        this.txtEvolution.setString("Tiến hóa "+this.evolution);
    },

    updateBtnEvolution: function () {
        if (this.evolution - 1 < TOWER.EVOLUTION_MIN) {
            this.btnEvolutionDown.addClickEventListener(function (){});
            this.btnEvolutionDown.setOpacity(150);
        }
        else {
            this.btnEvolutionDown.addClickEventListener(this.updateEvolution.bind(this, -1));
            this.btnEvolutionDown.setOpacity(255);
        }
        if (this.evolution + 1 > TOWER.EVOLUTION_MAX) {
            this.btnEvolutionUp.addClickEventListener(function (){});
            this.btnEvolutionUp.setOpacity(150);
        }
        else {
            this.btnEvolutionUp.addClickEventListener(this.updateEvolution.bind(this, +1));
            this.btnEvolutionUp.setOpacity(255);
        }
    },

    updateGlow: function () {
        this.imgGlow.loadTexture(this.card.getGlow());
    },

    updateParticleMiniature: function () {
        this.initParticleMiniature();
    },

    updateStat: function () {
        let curCardStat = CardStat.getInstance().getStat(this.card.id, this.card.level, this.evolution);
        let nextLevelStat;
        if (!this.card.isMaxLevel())
            nextLevelStat = CardStat.getInstance().getStat(this.card.id, this.card.level+1, this.evolution);
        else
            nextLevelStat = curCardStat;

        for (let key in CARD.UI_STAT[this.card.id]) {
            this.stat[key].getChildByName(this._txtStat).setString(PopupCardInfo.toStatString[key](curCardStat[key]));
            if (curCardStat[key] === nextLevelStat[key])
                this.stat[key].getChildByName(this._txtStatUpgrade).setVisible(false);
            else {
                this.stat[key].getChildByName(this._txtStatUpgrade).setVisible(true);
                let delta = nextLevelStat[key]-curCardStat[key];
                this.stat[key].getChildByName(this._txtStatUpgrade).setString((delta < 0 ? "-" : "+")+PopupCardInfo.toStatString[key](delta));
            }
        }
    },

    updateRankRequire: function () {
        if (this.card.getType() !== CARD.TOWER_TYPE)
            return;
        if (this.evolution <= this.card.getRank())
            this.layoutRankRequire.setVisible(false);
        else {
            this.layoutRankRequire.setVisible(true);
            this.txtRankRequire.setString(CARD.RANK_REQUIRE_PREFIX+CARD.RANK_TEXT[this.evolution]);
        }
    },

    updatePopupCardInfoUI: function () {
        this.cardItem.updateUI();
        this.updateStat();
        this.updateGlow();
        this.updateParticleMiniature();
        this.updateRankRequire();
    },

});

PopupCardInfo.toStatString = {};

PopupCardInfo.toStatString.targetType = function (type) {
    return type;
};

PopupCardInfo.toStatString.duration = function (milisec) {
    return Math.round(Time.milisecToSecond(milisec) * 100) / 100 + "s";
};

PopupCardInfo.toStatString.damage = function (number) {
    return Math.round(number * 100) / 100;
};

PopupCardInfo.toStatString.healthUp = function (number) {
    return Math.round(number * 100) / 100 + " Máu/s";
};

PopupCardInfo.toStatString.damageUp = function (number) {
    return Math.round(number * 100 * 100) / 100 + "%";
};

PopupCardInfo.toStatString.hp = PopupCardInfo.toStatString.damage;

PopupCardInfo.toStatString.numberMonsters = PopupCardInfo.toStatString.damage;

PopupCardInfo.toStatString.speed = PopupCardInfo.toStatString.damage;

PopupCardInfo.toStatString.radius = PopupCardInfo.toStatString.damage;

PopupCardInfo.toStatString.range = PopupCardInfo.toStatString.damage;

PopupCardInfo.toStatString.attackSpeed = PopupCardInfo.toStatString.duration;

PopupCardInfo.toStatString.speedUp = PopupCardInfo.toStatString.damageUp;

PopupCardInfo.toStatString.attackSpeedUp = PopupCardInfo.toStatString.damageUp;