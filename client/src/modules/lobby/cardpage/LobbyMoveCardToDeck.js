/**
 * Created by Team 2 - LongLH - GDF 17 on 11/11/2022.
 */


var LobbyMoveCardToDeck = cc.Class.extend({

    _btnClose: "btnClose",
    _layoutCard: "layoutCard",
    _imgCardBorder: "imgBorder",
    _imgCardBackground: "imgBackground",
    _imgCard: "imgCard",
    _txtCardLevel: "txtLevel",
    _txtCardEnergy: "txtEnergy",

    ctor: function (layoutMoveCardToDeck) {
        this.layoutMoveCardToDeck = layoutMoveCardToDeck;
        this.initLobbyMoveCardToDeck();
    },

    initLobbyMoveCardToDeck: function () {
        this.layoutMoveCardToDeck.setVisible(false);

        this.btnClose = this.layoutMoveCardToDeck.getChildByName(this._btnClose);
        this.btnClose.addClickEventListener(this.cancelEditDeck.bind(this));

        this.layoutCard = this.layoutMoveCardToDeck.getChildByName(this._layoutCard);
        this.imgCardBorder = this.layoutCard.getChildByName(this._imgCardBorder);
        this.imgCardBackground = this.layoutCard.getChildByName(this._imgCardBackground);
        this.imgCard = this.layoutCard.getChildByName(this._imgCard);
        this.txtCardLevel = this.layoutCard.getChildByName(this._txtCardLevel);
        this.txtCardEnergy = this.layoutCard.getChildByName(this._txtCardEnergy);
    },

    onEditDeckStart: function (card) {
        this.layoutMoveCardToDeck.setVisible(true);

        this.btnClose.setTouchEnabled(true);
        this.imgCardBorder.loadTexture(res.card.background[card.getRank()].border);
        this.imgCardBackground.loadTexture(res.card.background[card.getRank()].background);
        this.imgCard.loadTexture(res.card.image[card.id]);
        this.txtCardLevel.setString("Lv. "+card.level);
        this.txtCardEnergy.setString(card.getEnergy());
    },

    onEditDeckFinish: function () {
        this.layoutMoveCardToDeck.setVisible(false);
    },

    cancelEditDeck: function () {
        if (this.layoutMoveCardToDeck.isVisible())
            gv.lobby.lobbyCardPage.onEditDeckFinish();
    },

});