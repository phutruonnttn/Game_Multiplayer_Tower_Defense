/**
 * Created by Team 2 - LongLH - GDF 17 on 7/11/2022.
 */


var LobbyInventoryCollection = LobbyInventory.extend({

    ctor: function (layoutInventoryCollection) {
        this._super(layoutInventoryCollection);
        this.initLobbyInventoryCollection();
    },

    initLobbyInventoryCollection: function () {
        if (this.lobbyInventoryCardItem !== undefined)
            for (idx in this.lobbyInventoryCardItem)
                this.lobbyInventoryCardItem[idx].removeFromParent(true);
        this.lobbyInventoryCardItem = new Array(gv.user.listCard.length);
        for (let idx in gv.user.listCard) {
            this.lobbyInventoryCardItem[idx] = new LobbyInventoryCardItem(gv.user.listCard[idx]);
            this.layoutInventory.addChild(this.lobbyInventoryCardItem[idx]);
        }
        this.setSortIncreasingEnergy();
        this.updateUI();
    },

    onEditDeckStart: function (card) {
        this.layoutInventory.setVisible(false);
    },

    onEditDeckFinish: function () {
        this.layoutInventory.setVisible(true);
    },

    changeSortOrder: function () {
        if (this.isSortDecreasingEnergy())
            this.setSortIncreasingEnergy();
        else
            this.setSortDecreasingEnergy();
    },

    isSortDecreasingEnergy: function () {
        return this._isSortDecreasingEnergy;
    },

    setSortIncreasingEnergy: function () {
        this._isSortDecreasingEnergy = false;
        this.compareFunc = this.compareIncreasingEnergy;
        this.updateUI();
    },

    setSortDecreasingEnergy: function () {
        this._isSortDecreasingEnergy = true;
        this.compareFunc = this.compareDecreasingEnergy;
        this.updateUI();
    },

    compareIncreasingEnergy: function (inventoryCardItemA, inventoryCardItemB) {
        if (inventoryCardItemA.isVisible() !== inventoryCardItemB.isVisible())
            return inventoryCardItemA.isVisible() !== true;
        let cardA = inventoryCardItemA.card;
        let cardB = inventoryCardItemB.card;
        return cardA.getEnergy() > cardB.getEnergy() || cardA.getEnergy() === cardB.getEnergy() && cardA.id > cardB.id;
    },

    compareDecreasingEnergy: function (inventoryCardItemA, inventoryCardItemB) {
        if (inventoryCardItemA.isVisible() !== inventoryCardItemB.isVisible())
            return inventoryCardItemA.isVisible() !== true;
        let cardA = inventoryCardItemA.card;
        let cardB = inventoryCardItemB.card;
        return cardA.getEnergy() < cardB.getEnergy() || cardA.getEnergy() === cardB.getEnergy() && cardA.id > cardB.id;
    },

    updateUI: function () {
        this.lobbyInventoryCardItem.forEach((inventoryCardItem) => {
            inventoryCardItem.setVisible(!inventoryCardItem.card.isInDeck());
        });
        this.lobbyInventoryCardItem.sort(this.compareFunc);
        this._super();
    },

});