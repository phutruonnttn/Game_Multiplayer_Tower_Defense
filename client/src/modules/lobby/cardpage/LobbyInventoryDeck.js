/**
 * Created by Team 2 - LongLH - GDF 17 on 7/11/2022.
 */


var LobbyInventoryDeck = LobbyInventory.extend({

    ctor: function (layoutInventoryDeck) {
        this._super(layoutInventoryDeck);
        this.initLobbyInventoryDeck();
    },

    initLobbyInventoryDeck: function () {
        if (this.lobbyInventoryCardItem !== undefined)
            for (let idx in this.lobbyInventoryCardItem)
                this.lobbyInventoryCardItem[idx].removeFromParent(true);
        this.lobbyInventoryCardItem = new Array(gv.user.deck.length);
        for (let idx in gv.user.deck) {
            this.lobbyInventoryCardItem[idx] = new LobbyInventoryCardItem(gv.user.deck[idx]);
            this.layoutInventory.addChild(this.lobbyInventoryCardItem[idx]);
        }
        this.updateUI();
    },

    onEditDeckStart: function (card) {
        var tapped = false;
        for (let idx in this.lobbyInventoryCardItem) {
            const index = Number(idx);
            this.lobbyInventoryCardItem[idx].btnCard.addTouchEventListener(function (sender, event) {
                if (tapped)
                    return;
                if (event === ccui.Widget.TOUCH_BEGAN) {
                    gv.lobby.lobbyCardPage.moveCardToDeck(this.card, this.index);
                    tapped = true;
                }
            }.bind({card: card, index: index}));
        }
    },

    onEditDeckFinish: function () {
        for (let idx in this.lobbyInventoryCardItem)
            this.lobbyInventoryCardItem[idx].initClickEvent();
    },

});