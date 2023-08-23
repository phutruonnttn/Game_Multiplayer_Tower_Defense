var LobbyShopPage = cc.Class.extend({

    _nodeItemDaily: "nodeItemDaily",
    _layoutDailyItem: "layoutDailyItem",
    _refreshBackground: "refreshBackground",
    _txtRefresh: "txtRefresh",
    _itemDailyShop: "itemDailyShop",
    _panelDisable: "panelDisable",
    _panelBuyFee: "panelBuyFee",
    _txtAmountGold: "txtAmountGold",
    _btnBuyFee: "btnBuyFee",
    _txtInfo: "txtInfo",
    _txtAmountItem: "txtAmountItem",
    _imgChest: "imgChest",
    _layoutCard: "layoutCard",
    _imgCard: "imgCard",
    _itemDaily: "itemDaily",
    _layoutGoldItem: "layoutGoldItem",
    _itemBackground: "itemBackground",
    _panelBuy: "panelBuy",
    _btnBuy: "btnBuy",
    _btnImage: "btnImage",

    ctor: function (node) {
        this._node = node;
        this.initLobbyShopPage();
    },

    initLobbyShopPage: function () {
        this.initLayoutDailyItem()
        this.initLayoutGoldItem()
        this.initItemRefreshTime()
    },

    initLayoutDailyItem: function () {
        this.layoutDailyItem = this._node.getChildByName(this._layoutDailyItem)
        this.addItemToNode()
    },

    // load tu gv.LOBBY.SHOP_DAILY_ITEM
    addItemToNode: function () {
        for (let i=0; i<gv.LOBBY.SHOP_DAILY_ITEM.length; i++) {
            var item = gv.LOBBY.SHOP_DAILY_ITEM[i]
            var node = this.layoutDailyItem.getChildByName(this._nodeItemDaily + (item.index+1))
            if (item.pieceID == -1) {
                // Item nay la chest
                let chest = new Chest(0)
                this.addChestItem(node, chest, item.cost, item.index, item.status)
            } else {
                // Item nay la card
                let card = gv.user.listCard[item.pieceID]
                this.addCardItem(node, card, item.amount, item.cost, item.index, item.status)
            }
        }
    },

    initItemRefreshTime: function () {
        let refreshBackground = this.layoutDailyItem.getChildByName(this._refreshBackground)
        this.txtRefresh = refreshBackground.getChildByName(this._txtRefresh)
        this.updateItemRefreshTime()
    },

    addChestItem: function (node, chest, costByGold, index, status){
        var itemDaily = ccs.load(res.lobby_shop_item_daily, "").node.getChildByName(this._itemDailyShop).clone()

        var btnImage = itemDaily.getChildByName(this._btnImage)
        var panelDisable = itemDaily.getChildByName(this._panelDisable)
        var panelBuyFee = itemDaily.getChildByName(this._panelBuyFee)

        // Txt info
        var txtInfo = itemDaily.getChildByName(this._txtInfo)
        txtInfo.setString(chest.getName())

        // Txt amount of item
        var txtAmountOfItem = itemDaily.getChildByName(this._txtAmountItem)
        txtAmountOfItem.setVisible(false)

        // Image chest
        var imgChest = itemDaily.getChildByName(this._imgChest)
        imgChest.loadTexture(chest.getImagePath())

        // Image card
        var layoutCard = itemDaily.getChildByName(this._layoutCard)
        layoutCard.setVisible(false)

        if (status == 1) {
            panelBuyFee.setVisible(false)
            btnImage.setTouchEnabled(false)
        } else {
            panelDisable.setVisible(false)

            // Panel buy
            var txtAmountGold = panelBuyFee.getChildByName(this._txtAmountGold)
            txtAmountGold.setString(Utils.getInstance().formatIntToCurrencyString(costByGold))
            var btnBuy = panelBuyFee.getChildByName(this._btnBuyFee)
            btnBuy.addClickEventListener(() => {
                Popup.create(new LobbyShopChestPopup(chest, costByGold, index))
            })

            //Btn image
            btnImage.addClickEventListener(() => {
                Popup.create(new LobbyShopChestPopup(chest, costByGold, index))
            })
        }

        if (node.getChildByName(this._itemDaily)) {
            node.removeChildByName(this._itemDaily, true)
        }

        node.addChild(itemDaily, 1, this._itemDaily)
    },

    setDisableItem: function (itemDaily) {
        // Panel disable
        var panelDisable = itemDaily.getChildByName(this._panelDisable)
        panelDisable.setVisible(true)

        // Panel buy fee
        var panelBuyFee = itemDaily.getChildByName(this._panelBuyFee)
        panelBuyFee.setVisible(false)

        //Btn image
        var btnImage = itemDaily.getChildByName(this._btnImage)
        btnImage.setTouchEnabled(false)
    },

    // Truyen vao so luong card, gia gold
    addCardItem: function (node, card, numberOfCard, amountOfGold, index, status) {
        var itemDaily = ccs.load(res.lobby_shop_item_daily, "").node.getChildByName(this._itemDailyShop).clone()

        var btnImage = itemDaily.getChildByName(this._btnImage)
        var panelDisable = itemDaily.getChildByName(this._panelDisable)
        var panelBuyFee = itemDaily.getChildByName(this._panelBuyFee)

        // Txt info
        var txtInfo = itemDaily.getChildByName(this._txtInfo)
        txtInfo.setVisible(false)

        // Txt amount of item
        var txtAmountOfItem = itemDaily.getChildByName(this._txtAmountItem)
        txtAmountOfItem.setString("x" + Utils.getInstance().formatIntToCurrencyString(numberOfCard))

        // Image chest
        var imgChest = itemDaily.getChildByName(this._imgChest)
        imgChest.setVisible(false)

        // Image card
        var layoutCard = itemDaily.getChildByName(this._layoutCard)
        var imgCard = layoutCard.getChildByName(this._imgCard)
        imgCard.loadTexture(card.getImageCardPath())

        if (status == 1) {
            panelBuyFee.setVisible(false)
            btnImage.setTouchEnabled(false)
        } else {
            panelDisable.setVisible(false)

            // Panel buy
            var txtAmountGold = panelBuyFee.getChildByName(this._txtAmountGold)
            txtAmountGold.setString( Utils.getInstance().formatIntToCurrencyString(amountOfGold))
            var btnBuy = panelBuyFee.getChildByName(this._btnBuyFee)
            btnBuy.addClickEventListener(() => {
                Popup.create(new LobbyShopCardPopup(card, amountOfGold, numberOfCard, index));
            })

            //Btn image
            btnImage.addClickEventListener(() => {
                Popup.create(new LobbyShopCardPopup(card, amountOfGold, numberOfCard, index));
            })
        }

        if (node.getChildByName(this._itemDaily)) {
            node.removeChildByName(this._itemDaily, true)
        }

        node.addChild(itemDaily, 1, this._itemDaily)
    },

    initLayoutGoldItem: function (){
        this.layoutGoldItem = this._node.getChildByName(this._layoutGoldItem)

        for (var i = 0; i < 3; i++) {
            var itemGold = this.layoutGoldItem.getChildByName(this._itemBackground + (i+1))
            this.addButtonListenerGoldItem(itemGold, i)
        }
    },

    addButtonListenerGoldItem: function (item, id) {
        // Add click listener for button buy
        var panelButton = item.getChildByName(this._panelBuy)
        var btnBuy = panelButton.getChildByName(this._btnBuy)

        btnBuy.addClickEventListener(()=>{
            Popup.create(new LobbyShopGoldPopup(id));
        })

        // Add click listener for button image
        var btnImage = item.getChildByName(this._btnImage)

        btnImage.addClickEventListener(()=>{
            Popup.create(new LobbyShopGoldPopup(id));
        })
    },

    clearCountDown: function () {
        clearInterval(this.countDown)
    },

    updateItemRefreshTime: function () {
        var startOfTomorrow = new Date();
        startOfTomorrow.setDate(startOfTomorrow.getDate()+1);
        startOfTomorrow.setHours(0, 0, 0, 0);
        this.countDown = setInterval(()=>{
            var countDownDate = startOfTomorrow.getTime()

            // Find the distance between now and the count down date
            var now = new Date().getTime();
            let distance = countDownDate - now;

            // Time calculations for hours, minutes and seconds
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (hours <= 0) {
                if (minutes<0) {
                    this.txtRefresh.setString("0m 0s")
                } else {
                    this.txtRefresh.setString(minutes + "m " + seconds + "s")
                }
            } else {
                try {
                    this.txtRefresh.setString(hours + "h " + minutes + "m")
                } catch (e) {
                    this.clearCountDown()
                }
            }

            // If the count down is finished, write some text
            if (distance < 0) {
                this.refreshDailyItem()
                startOfTomorrow = new Date();
                startOfTomorrow.setDate(startOfTomorrow.getDate()+1);
                startOfTomorrow.setHours(0, 0, 0, 0);
            }
        },1000)
    },

    setPurchasedItem: function (id) {
        var node = this.layoutDailyItem.getChildByName(this._nodeItemDaily+(id+1))
        var item = node.getChildByName(this._itemDaily)
        this.setDisableItem(item)
    },

    refreshDailyItem: function () {
        for (var i = 0; i < 3; i++) {
            var node = this.layoutDailyItem.getChildByName(this._nodeItemDaily+(i+1))
            node.removeChildByName(this._itemDaily)
        }
        var pk = gv.gameClient.getOutPacket(CmdRequestShopInfo);
        pk.pack();
        gv.gameClient.sendPacket(pk);
    },


});