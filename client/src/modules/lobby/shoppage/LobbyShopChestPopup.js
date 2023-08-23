var LobbyShopChestPopup = Popup.extend({

    _layoutBase: "layoutChestBase",
    _layoutQuickOpen: "layoutQuickOpen",
    _layoutDetail: "layoutDetail",

    _txtGold: "txtGold",
    _txtCard: "txtCard",
    _btnClose: "btnClose",

    _txtOpenTime: "txtOpenTime",
    _btnUnlockChest: "btnUnlockChest",
    _txtQuickCost: "txtCost",

    _layoutShop: "layoutShop",
    _txtLimitUnlock: "txtLimitUnlock",
    _txtAmountGold: "txtAmountGold",
    _btnUnlockChest: "btnUnlockChest",
    _btnBuy: "btnBuy",

    ctor: function (chest, costByGold, index) {
        this._super();
        this.costByGold = costByGold
        this.index = index
        this.initLobbyChestPopup(chest);
    },

    initLobbyChestPopup: function (chest) {
        this.lobbyChestPopupUI = ccs.load(res.lobby_chest_popup_ui, "").node;
        this.layoutBack = this.lobbyChestPopupUI.getChildByName(this._layoutBase).clone();
        this.chest = chest;

        this.initState();
        this.initGoldReward();
        this.initCardReward();
        this.initBtnClose();
        this.initBtnBuy()
        this.initCostByGold()

        this.addChild(this.layoutBack);
        this.addChild(this.layoutFront);
    },

    initCostByGold: function () {
        let txtAmountGold = this.layoutFront.getChildByName(this._txtAmountGold);
        txtAmountGold.setString(Utils.getInstance().formatIntToCurrencyString(this.costByGold));
    },

    initBtnBuy: function (){
        var previousBtn = this.layoutBack.getChildByName(this._btnUnlockChest)
        previousBtn.setVisible(false)

        let btnBuy = this.layoutFront.getChildByName(this._btnBuy)
        let txtAmountGold = this.layoutFront.getChildByName(this._txtAmountGold)
        if (gv.user.gold < this.costByGold) {
            btnBuy.loadTextureNormal(res.button.disable)
            txtAmountGold.setColor(cc.color("#ff0000"))
        }
        btnBuy.addClickEventListener(() => {
            this.handleBuyChest()
        })
    },

    handleBuyChest: function () {
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
            getUserController().sendBuyChestRequest(this.index)

            this.destroy()
        }
    },

    initState: function () {
        this.layoutFront = this.lobbyChestPopupUI.getChildByName(this._layoutShop).clone();

        this.errorNotEnoughGold = this.layoutFront.getChildByName("txtErrorNotEnoughGold")
        this.positionError = cc.p(this.errorNotEnoughGold.x, this.errorNotEnoughGold.y)
        this.errorNotEnoughGold.setVisible(false)

        var txtLimitUnlock = this.layoutBack.getChildByName(this._txtLimitUnlock)
        txtLimitUnlock.setVisible(false)
    },

    initGoldReward: function () {
        let txtGold = this.layoutBack.getChildByName(this._txtGold);
        txtGold.setString(CHEST.TREASURES[this.chest.type].REWARDS.MIN_GOLD+" - "+CHEST.TREASURES[this.chest.type].REWARDS.MAX_GOLD);
    },

    initCardReward: function () {
        let txtCard = this.layoutBack.getChildByName(this._txtCard);
        txtCard.setString(CHEST.TREASURES[this.chest.type].REWARDS.MIN_FRAGMENT+" - "+CHEST.TREASURES[this.chest.type].REWARDS.MAX_FRAGMENT);
    },

    initBtnClose: function () {
        let btnClose = this.layoutBack.getChildByName(this._btnClose);
        btnClose.addClickEventListener(this.destroy.bind(this));
    }

});