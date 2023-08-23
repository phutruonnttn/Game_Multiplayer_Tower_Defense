var LobbyShopGoldPopup = Popup.extend({

    _btnClose: "btnClose",
    _btnBuy: "btnBuy",
    _txtAmountGem: "txtAmountGem",
    _imgGold: "imgGold",
    _txtAmount: "txtAmount",
    _popupBuyGold: "popupBuyGold",

    ctor: function (id) {
        this._super()
        this.id = id
        this.initLobbyShopGoldPopup()
    },

    initLobbyShopGoldPopup: function () {
        this.popUpBuyGold = ccs.load(res.lobby_buy_gold_popup_ui, "").node
        this.layoutBase = this.popUpBuyGold.getChildByName(this._popupBuyGold).clone()

        this.errorNotEnoughGem = this.layoutBase.getChildByName("txtErrorNotEnoughGem")
        this.positionError = cc.p(this.errorNotEnoughGem.x, this.errorNotEnoughGem.y)
        this.errorNotEnoughGem.setVisible(false)

        this.initBtnClose()
        this.initImgGold()
        this.initAmountGold()
        this.initAmountGem()
        this.initBtnBuy()
        this.initGoldParticle()

        this.addChild(this.layoutBase)
    },

    initGoldParticle: function () {
        var goldParticle = new cc.ParticleSystem(res.shop.particle_shop_gold_plist)
        goldParticle.setScale(1)
        goldParticle.setPosition(this.layoutBase.getContentSize().width/2,
            this.layoutBase.getContentSize().height*5/9)
        this.layoutBase.addChild(goldParticle, 2)
    },

    initBtnBuy: function () {
        let btnBuy = this.layoutBase.getChildByName(this._btnBuy)
        let txtAmountGem = this.layoutBase.getChildByName(this._txtAmountGem)
        if (gv.user.gem < SHOP.GOLD[this.id].COST_BY_GEM) {
            btnBuy.loadTextureNormal(res.button.disable)
            txtAmountGem.setColor(cc.color("#ff0000"))
        }
        btnBuy.addClickEventListener(() => {
            this.handleBuyGold()
        })
    },

    showEffectGainGold: function (amount) {
        EffectLobby.gainObject(
            new ccui.ImageView("res/common/common_icon_gold_small.png"),
            10,
            cc.p(cc.winSize.width/2,cc.winSize.height/2),
            cc.p(115,1102),
            gv.lobby,
            EffectLobby.changeNumberLabel.bind(
                this,
                gv.lobby.lobbyGold.txtAmount,
                amount/10,
                0.2
            )
        )
    },

    handleBuyGold: function () {
        if (gv.user.gem < SHOP.GOLD[this.id].COST_BY_GEM) {
            this.errorNotEnoughGem.setOpacity(255);
            this.errorNotEnoughGem.stopActionByTag(TAG.TAG_ERROR_NOT_ENOUGH_G);
            this.errorNotEnoughGem.setPosition(this.positionError)
            var targetPosition = cc.p(this.errorNotEnoughGem.x, this.errorNotEnoughGem.y + 30)

            var sequence = cc.sequence(
                cc.show(),
                cc.moveTo(0.5, targetPosition),
                cc.fadeOut(0.5),
                cc.hide()
            )
            sequence.setTag(TAG.TAG_ERROR_NOT_ENOUGH_G)
            this.errorNotEnoughGem.runAction(sequence)
        } else {
            let amountGold = SHOP.GOLD[this.id].AMOUNT
            let costByGem = SHOP.GOLD[this.id].COST_BY_GEM
            this.sendBuyGoldRequest()
            gv.user.addGoldRaw(amountGold)

            gv.user.subGem(costByGem)

            this.destroy()
            this.showEffectGainGold(amountGold)
        }
    },

    sendBuyGoldRequest: function (){
        var pk = gv.gameClient.getOutPacket(CmdBuyGold);
        pk.pack(this.id);
        gv.gameClient.sendPacket(pk);
    },

    initBtnClose: function () {
        let btnClose = this.layoutBase.getChildByName(this._btnClose);
        btnClose.addClickEventListener(this.destroy.bind(this));
    },

    initImgGold: function () {
        for (var i = 0; i < SHOP.GOLD.length; i++) {
            this.layoutBase.getChildByName(this._imgGold + (i+1)).setVisible(false)
        }
        this.layoutBase.getChildByName(this._imgGold + (this.id + 1)).setVisible(true)
    },

    initAmountGold: function () {
        let txtAmountGold = this.layoutBase.getChildByName(this._txtAmount)
        var amountGold =  Utils.getInstance().formatIntToCurrencyString(SHOP.GOLD[this.id].AMOUNT)
        txtAmountGold.setString(amountGold)
    },

    initAmountGem: function () {
        let txtAmountGem = this.layoutBase.getChildByName(this._txtAmountGem);
        var amountGem =  Utils.getInstance().formatIntToCurrencyString(SHOP.GOLD[this.id].COST_BY_GEM)
        txtAmountGem.setString(amountGem)
    }
})