var BattleCard = cc.Node.extend({

    _cardBox: "cardBox",
    _btnCard: "btnCard",
    _btnDestroy: "btnDestroy",
    _cardImage: "cardImage",
    _cardBorder: "cardBorder",
    _cardBackground: "cardBackground",
    _lblEnergy: "lblEnergy",

    ctor: function (card, index) {
        this._super()
        this.status = BATTLE.CARD_STATUS_NORMAL
        this.index = index
        this.info = card
        this.initBattleCard(card)
        this.addEventListener()
    },

    initBattleCard: function (card) {
        // Load node cardUI
        this.cardUI = ccs.load(res.battle_card, "").node.getChildByName(this._cardBox).clone()
        this.btnCard = this.cardUI.getChildByName(this._btnCard)
        this.btnCard.setPositionY(0)
        this.btnDestroy = this.cardUI.getChildByName(this._btnDestroy)
        this.btnDestroy.visible = false
        this.addChild(this.cardUI)
        // Update image card
        var cardImage = this.btnCard.getChildByName(this._cardImage)
        cardImage.loadTexture(res.card.image[card.id])
        // Update border card
        var cardBorder = this.btnCard.getChildByName(this._cardBorder)
        cardBorder.loadTexture(res.card.background[card.getRank()].border)
        // Update background card
        var cardBackground = this.btnCard.getChildByName(this._cardBackground)
        cardBackground.loadTexture(res.card.background[card.getRank()].background)
        // Update energy card
        var lblEnergy = this.btnCard.getChildByName(this._lblEnergy)
        lblEnergy.setString(card.getEnergy())
    },

    addEventListener: function () {
        this.btnDestroy.addClickEventListener(()=>{
            gv.battleScene.destroyCurrentSelectCard()
        })
    }

})