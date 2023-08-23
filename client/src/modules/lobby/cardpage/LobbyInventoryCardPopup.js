/**
 * Created by Team 2 - LongLH - GDF 17 on 10/11/2022.
 */


var LobbyInventoryCardPopup = PopupCardInfo.extend({

    _layoutCardPagePopup: "layoutCardPagePopup",
    _txtNotify: "txtNotify",
    _btnChose: "btnChose",
    _btnUpgrade: "btnUpgrade",
    _btnSkill: "btnSkill",
    _txtCost: "txtCost",

    _btnCheatCard: "btnCheatCard",

    ctor: function (card) {
        this._super(card);
        this.layoutCardPagePopup = this.cardPopupUI.getChildByName(this._layoutCardPagePopup).clone();
        this.addChild(this.layoutCardPagePopup);
        this.initLobbyInventoryCardPopup();
    },

    initLobbyInventoryCardPopup: function () {
        this.initNotify();
        this.initInteractCardButton();
        this.initButtonCheat();
    },

    initNotify: function () {
        this.txtNotify = this.layoutCardPagePopup.getChildByName(this._txtNotify);
        this.txtNotify.setVisible(false);
    },

    showNotify: function (message) {
        this.txtNotify.setString(message);
        this.txtNotify.setVisible(true);
        setTimeout(this.txtNotify.setVisible.bind(this.txtNotify, false), Time.secondToMilisec(gv.LOBBY.CARDPAGE.NOTIFY_TIMEOUT));
    },

    initInteractCardButton: function () {
        this.listBtn = [];

        this.initBtnChose();
        this.initBtnUpgrade();
        this.initBtnSkill();
        this.initButtonCheat();

        for (let idx in this.listBtn)
            this.listBtn[idx].x = this.layoutCardPagePopup.width / this.listBtn.length * (Number(idx) + 0.5);
    },

    initBtnChose: function () {
        var btnChose = this.layoutCardPagePopup.getChildByName(this._btnChose);
        if (this.card.isInDeck()) {
            btnChose.setVisible(false);
            return;
        }
        this.listBtn.push(btnChose);
        btnChose.addClickEventListener(function () {
            gv.lobby.lobbyCardPage.onEditDeckStart(this.card);
            this.destroy();
        }.bind(this));
    },

    initBtnUpgrade: function () {
        var btnUpgrade = this.layoutCardPagePopup.getChildByName(this._btnUpgrade);
        if (this.card.isMaxLevel()) {
            btnUpgrade.setVisible(false);
            return;
        }
        this.listBtn.push(btnUpgrade);
        let txtCost = btnUpgrade.getChildByName(this._txtCost);
        txtCost.setString(CARD.UPGRADE[this.card.level].GOLD);
        if (!this.card.enoughFragmentForUpgrade()) {
            btnUpgrade.loadTextureNormal(res.button.disable);
            btnUpgrade.addClickEventListener(this.showNotify.bind(this, gv.LOBBY.CARDPAGE.NOT_ENOUGH_FRAGMENT_NOTIFY));
        }
        else {
            btnUpgrade.loadTextureNormal(res.button.upgrade);
            if (this.card.isMaxLevel() === false && gv.user.hasEnoughGold(CARD.UPGRADE[this.card.level].GOLD) === false) {
                txtCost.setTextColor(cc.color(gv.COLOR.ERROR));
                btnUpgrade.addClickEventListener(this.showNotify.bind(this, gv.LOBBY.CARDPAGE.NOT_ENOUGH_GOLD_NOTIFY));
            } else
                btnUpgrade.addClickEventListener(function () {
                    this.card.upgrade();
                    this.updateUI();
                    this.addChild(new LobbyCardUpgrade(this.card));
                }.bind(this));
        }
    },

    initBtnSkill: function () {
        let btnSkill = this.layoutCardPagePopup.getChildByName(this._btnSkill);
        if (CARD.GLOBAL_ID[this.card.id].TYPE !== CARD.TOWER_TYPE) {
            btnSkill.setVisible(false);
            return;
        }
        this.listBtn.push(btnSkill);
        btnSkill.addClickEventListener(function () {
            Popup.create(new LobbyInventoryCardSkillPopup(this.card, this));
        }.bind(this));
    },

    initButtonCheat: function () {
        let btnCheat = this.layoutCardPagePopup.getChildByName("btnCheatCard");
        btnCheat.setTitleText("Cheat +"+gv.CHEAT.FRAGMENT);
        btnCheat.addClickEventListener(function () {
            gv.user.addCardFragment(this.card.id, gv.CHEAT.FRAGMENT);
            this.updateUI();

            // report to server
            getUserController().sendCheatCard(this.card.id, gv.CHEAT.FRAGMENT);
        }.bind(this));
    },

    updateUI: function () {
        this.updatePopupCardInfoUI();
        this.initLobbyInventoryCardPopup();
    }

});