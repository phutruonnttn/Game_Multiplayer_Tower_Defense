
var LobbyShopCardPopup = Popup.extend({

    _layoutBase: "layoutBase",
    _barProgress: "barProgress",
    _txtProgress: "txtProgress",
    _btnClose: "btnClose",
    _txtName: "txtName",
    _btnBuy: "btnBuy",
    _txtAmountGold: "txtAmountGold",
    _txtAmountCard: "txtAmountCard",
    _btnCard: "btnCard",
    _imgCard: "imgCard",
    _imgBackground: "imgBackground",
    _imgBorder: "imgBorder",

    ctor: function (card, costByGold, numberOfCard, index) {
        this._super();
        this.index = index
        this.card = card;
        this.costByGold = costByGold
        this.numberOfCard = numberOfCard
        this.initLobbyShopCardPopup();
    },

    initLobbyShopCardPopup: function () {
        this.cardPopupUI = ccs.load(res.lobby_shop_card_popup_ui, "").node
        this.layoutBase = this.cardPopupUI.getChildByName(this._layoutBase).clone();

        this.errorNotEnoughGold = this.layoutBase.getChildByName("txtErrorNotEnoughGold")
        this.positionError = cc.p(this.errorNotEnoughGold.x, this.errorNotEnoughGold.y)
        this.errorNotEnoughGold.setVisible(false)

        this.initBtnClose();
        this.initCardAvatar();
        this.initCardName();
        this.initCardProgress();
        this.initNumberCard()
        this.initCostByGold()
        this.initBtnBuy()

        this.addChild(this.layoutBase);
    },

    initBtnBuy: function () {
        let btnBuy = this.layoutBase.getChildByName(this._btnBuy)
        let txtAmountGold = this.layoutBase.getChildByName(this._txtAmountGold)
        if (gv.user.gold < this.costByGold) {
            btnBuy.loadTextureNormal(res.button.disable)
            txtAmountGold.setColor(cc.color("#ff0000"))
        }
        cc.log(gv.user.gold)
        btnBuy.addClickEventListener(() => {
            this.handleBuyCard()
        })
    },

    showEffectGainCard: function () {
        var cardPopup =ccs.load(res.lobby_shop_card_popup_ui, "").node
        var card = cardPopup.getChildByName(this._layoutBase).clone().getChildByName(this._btnCard)
        card.setScale(0.5)
        let imgCard = card.getChildByName(this._imgCard)
        imgCard.loadTexture(res.card.image[this.card.id])

        let imgBackground = card.getChildByName(this._imgBackground)
        imgBackground.loadTexture(this.card.getBackgroundCardPath())

        let imgBorder = card.getChildByName(this._imgBorder)
        imgBorder.loadTexture(this.card.getBorderCardPath())

        EffectLobby.gainObject(
            card,
            10,
            cc.p(cc.winSize.width/2,cc.winSize.height/2),
            cc.p(215,57),
            gv.lobby
        )
    },

    handleBuyCard: function () {
        cc.log(gv.user.gold)
        if (gv.user.gold < this.costByGold) {
            this.errorNotEnoughGold.setOpacity(255);
            this.errorNotEnoughGold.stopActionByTag(TAG.TAG_ERROR_NOT_ENOUGH_G);
            this.errorNotEnoughGold.setPosition(this.positionError)
            var targetPosition = cc.p(this.errorNotEnoughGold.x, this.errorNotEnoughGold.y + 30)

            var sequence = cc.sequence(
                cc.show(),
                cc.moveTo(0.5, targetPosition),
                cc.fadeOut(0.5),
                cc.hide()
            )
            sequence.setTag(TAG.TAG_ERROR_NOT_ENOUGH_G)
            this.errorNotEnoughGold.runAction(sequence)
        } else {
            gv.user.subGold(this.costByGold)
            gv.lobby.lobbyShopPage.setPurchasedItem(this.index)
            gv.user.addCardFragment(this.card.id, this.numberOfCard)
            getUserController().sendBuyCardRequest(this.index)

            this.destroy()
            this.showEffectGainCard()
        }
    },

    initNumberCard: function () {
        let txtAmountCard = this.layoutBase.getChildByName(this._txtAmountCard);
        txtAmountCard.setString("x" + Utils.getInstance().formatIntToCurrencyString(this.numberOfCard));
    },

    initCostByGold: function () {
        let txtAmountGold = this.layoutBase.getChildByName(this._txtAmountGold);
        txtAmountGold.setString(Utils.getInstance().formatIntToCurrencyString(this.costByGold));
    },

    initBtnClose: function () {
        let btnClose = this.layoutBase.getChildByName(this._btnClose);
        btnClose.addClickEventListener(this.destroy.bind(this));
    },

    initCardAvatar: function () {
        let btnCard = this.layoutBase.getChildByName(this._btnCard)

        btnCard.addClickEventListener(()=>{
            Popup.create(new PopupCardInfo(this.card));
        })

        let imgCard = btnCard.getChildByName(this._imgCard)
        imgCard.loadTexture(res.card.image[this.card.id])

        let imgBackground = btnCard.getChildByName(this._imgBackground)
        imgBackground.loadTexture(this.card.getBackgroundCardPath())

        let imgBorder = btnCard.getChildByName(this._imgBorder)
        imgBorder.loadTexture(this.card.getBorderCardPath())
    },

    initCardName: function () {
        let txtName = this.layoutBase.getChildByName(this._txtName);
        var name = this.card.getNameUI()
        if (name.indexOf("-") != -1) {
            name = name.slice(0, name.indexOf("-"))
        }
        txtName.setString(name.toUpperCase());
    },

    initCardProgress: function () {
        this.barProgress = this.layoutBase.getChildByName(this._barProgress);
        this.txtProgress = this.layoutBase.getChildByName(this._txtProgress);
        this.barProgress.setPercent(this.card.getProgress());
        if (this.card.enoughFragmentForUpgrade())
            this.barProgress.loadTexture(res.card.process.max);
        this.txtProgress.setString(this.card.getProgressStr());
    },
});