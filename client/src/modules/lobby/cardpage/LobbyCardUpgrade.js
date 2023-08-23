/**
 * Created by Team 2 - LongLH - GDF 17 on 9/12/2022.
 */

var LobbyCardUpgrade = cc.Node.extend({

    _txtName: "txtName",
    _nodeCardItem: "nodeCardItem",
    _btnConfirm: "btnConfirm",
    _layoutStat: "layoutStat",
    _imgIcon: "imgIcon",
    _txtStatName: "txtStatName",
    _txtStatBefore: "txtStatBefore",
    _txtStatAfter: "txtStatAfter",

    ctor: function (card) {
        this._super();
        this.card = card;
        this.initLobbyCardUpgrade();
        this.runAnimation();
        this.initQuickFinish();
    },

    initLobbyCardUpgrade: function () {
        this.layerCardUpgrade = ccs.load(res.card_upgrade, "").node;
        this.addChild(this.layerCardUpgrade);

        this.initName();
        this.initCardItem();
        this.initStat();
        this.initBtnConfirm();
    },

    initName: function () {
        this.txtName = this.layerCardUpgrade.getChildByName(this._txtName);
        this.txtName.setString(this.card.getNameUI().toUpperCase());
    },

    initCardItem: function () {
        this.cardItem = new LobbyInventoryCardItem(this.card);
        this.cardItem.btnCard.setTouchEnabled(false);
        this.layerCardUpgrade.getChildByName(this._nodeCardItem).addChild(this.cardItem);
    },

    initStat: function () {
        this.listStat = [];
        let layoutStat = this.layerCardUpgrade.getChildByName(this._layoutStat);
        layoutStat.setVisible(false);
        let statBefore = CardStat.getInstance().getStat(this.card.id, this.card.level - 1, 1);
        let statAfter = CardStat.getInstance().getStat(this.card.id, this.card.level, 1);
        for (let key in CARD.UI_STAT[this.card.id]) {
            if (statBefore[key] === statAfter[key])
                continue;
            let stat = layoutStat.clone();
            stat.setVisible(true);
            stat.getChildByName(this._imgIcon).loadTexture(CARD.UI_STAT[this.card.id][key].icon);
            stat.getChildByName(this._txtStatName).setString(CARD.UI_STAT[this.card.id][key].text);
            this.addChild(stat);
            stat.getChildByName(this._txtStatBefore).enableOutline(cc.color(cc.BLACK), 1);
            stat.getChildByName(this._txtStatBefore).setString(PopupCardInfo.toStatString[key](statBefore[key]));
            stat.getChildByName(this._txtStatAfter).enableOutline(cc.color(cc.BLACK), 1);
            stat.getChildByName(this._txtStatAfter).setString(PopupCardInfo.toStatString[key](statAfter[key]));
            this.listStat.push(stat);
        }
        this.listStat.forEach(function (stat, index) {
            stat.setPosition(layoutStat.getPosition());
            stat.y -= index * (cc.winSize.height/10);
        });
    },

    initBtnConfirm: function () {
        this.btnConfirm = this.layerCardUpgrade.getChildByName(this._btnConfirm);
        this.btnConfirm.addClickEventListener(function (sender, event) {
            this.destroy();
        }.bind(this));
    },

    fadeUpAnimation: function () {
        this.runAction(cc.spawn([
            cc.moveBy(0, 0, -20),
            cc.fadeIn(1.5),
            cc.moveBy(1.5, 0, 20),
        ]));
    },

    runAnimation: function () {
        let listAction = [];

        this.cardItem.setCascadeOpacityEnabled(true);
        this.cardItem.btnCard.setCascadeOpacityEnabled(true);
        this.cardItem.setOpacity(0);
        listAction.push(cc.callFunc(this.fadeUpAnimation, this.txtName));

        listAction.push(cc.delayTime(1));

        this.txtName.setOpacity(0);
        listAction.push(cc.callFunc(this.fadeUpAnimation, this.cardItem));

        this.listStat.forEach(function (stat) {
            stat.setCascadeOpacityEnabled(true);
            stat.setOpacity(0);
            listAction.push(cc.delayTime(1));
            listAction.push(cc.callFunc(this.fadeUpAnimation, stat));
        }, this);

        this.btnConfirm.setOpacity(0);
        this.btnConfirm.setTouchEnabled(false);
        listAction.push(cc.callFunc(function () {
            this.runAction(cc.fadeIn(0.5));
            this.setTouchEnabled(true);
        }, this.btnConfirm));

        listAction.push(cc.callFunc(function () {
            this.btnQuickFinish.removeFromParent();
        }, this));

        this.runAction(cc.sequence(listAction));
    },

    initQuickFinish: function () {
        this.btnQuickFinish = gv.commonButton(cc.winSize.width, cc.winSize.height, cc.winSize.width/2, cc.winSize.height/2);
        this.btnQuickFinish.setOpacity(0);
        this.addChild(this.btnQuickFinish);
        this.btnQuickFinish.addClickEventListener(this.quickFinish.bind(this));
    },

    quickFinish: function () {
        this.stopAllActions();
        this.removeAllChildren();
        this.initLobbyCardUpgrade();
    },

    destroy: function () {
        this.removeFromParent(true);
    },

});