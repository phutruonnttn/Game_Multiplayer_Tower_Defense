let DeskCardGUI = cc.Class.extend({

    ctor: function (deskCardMgr) {
        this.battleCard = []
        this.deskCardMgr = deskCardMgr

        for (var i = 0; i < deskCardMgr.listCard.length; i++) {
            var card = new BattleCard(deskCardMgr.listCard[i], i)
            card.retain()
            this.battleCard.push(card)
        }
    },

    hideCard: function (card) {
        this.deskCardMgr.hideCard(card.index)
    },

    setNormalSize: function (card) {
        card.setScale(1)
    },

    setNextCardSize: function (card) {
        card.setScale(0.6)
    },

    getCard: function () {
        var index = this.deskCardMgr.getNextIndex()
        return this.battleCard[index]
    },

    getCardForNextCardNode: function () {
        var index = this.deskCardMgr.getNextIndexForCardNext()
        return this.battleCard[index]
    },

    setStatusNormal: function (card) {
        card.btnCard.setPositionY(0)
        card.status = BATTLE.CARD_STATUS_NORMAL
        card.btnDestroy.visible = false
    },

    setStatusClick: function (card) {
        card.btnCard.setPositionY(card.cardUI.getContentSize().height*0.28)
        card.status = BATTLE.CARD_STATUS_CLICK
        card.btnDestroy.visible = true
    },

    setStatusDrag: function (card) {
        card.btnCard.setPositionY(card.cardUI.getContentSize().height*0.28)
        card.status = BATTLE.CARD_STATUS_DRAG
        card.btnDestroy.visible = false
    }
})