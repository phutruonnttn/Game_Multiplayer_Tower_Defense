/**
 * Created by Team 2 - LongLH - GDF 17 on 7/11/2022.
 */


var LobbyCardPage = cc.Class.extend({

    _scrollView: "scrollView",
    _layoutInventoryDeck: "layoutInventoryDeck",
    _layoutInventoryCollection: "layoutInventoryCollection",
    _layoutMoveCardToDeck: "layoutMoveCardToDeck",
    _btnSortCard: "btnSortCard",
    _imgArrow: "imgArrow",

    ctor: function (layoutCardPage) {
        this.layoutCardPage = layoutCardPage;
        this.initLobbyCardPage();
    },

    initLobbyCardPage: function () {
        this.initScrollView();
        this.initLayoutInventoryDeck();
        this.initLayoutInventoryCollection();
        this.initLayoutMoveCardToDeck();
        this.initBtnSortCard();
    },

    initScrollView: function () {
        this.scrollView = this.layoutCardPage.getChildByName(this._scrollView);
        this.scrollView.setScrollBarEnabled(false);
        this.scrollView.addTouchEventListener(function (sender, event) {
            if (event === ccui.Widget.TOUCH_BEGAN || event === ccui.Widget.TOUCH_ENDED) {
                sender.setDirection(ccui.ScrollView.DIR_BOTH);
                sender.setSwallowTouches(false);
                this.lockScrollDirection = false;
            }
        }.bind(this));
        this.scrollView.addEventListener(function (sender, event) {
            if (this.lockScrollDirection === true)
                return;
            switch (event) {
                case ccui.ScrollView.EVENT_SCROLL_TO_LEFT:
                    sender.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
                    sender.setSwallowTouches(false);
                    this.lockScrollDirection = true;
                    break;
                case ccui.ScrollView.EVENT_SCROLL_TO_RIGHT:
                    sender.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
                    sender.setSwallowTouches(false);
                    this.lockScrollDirection = true;
                    break;
                case ccui.ScrollView.EVENT_SCROLLING:
                    sender.setDirection(ccui.ScrollView.DIR_VERTICAL);
                    sender.setSwallowTouches(true);
                    this.lockScrollDirection = true;
                    gv.lobby.lobbyNavigationBar.pageView.scrollToPage(gv.lobby.lobbyNavigationBar.pageView.getCurPageIndex());
                    break;
            }
        }.bind(this));
    },

    initLayoutInventoryDeck: function () {
        this.layoutInventoryDeck = this.scrollView.getChildByName(this._layoutInventoryDeck);
        this.layoutInventoryDeck.setSwallowTouches(false);
        this.lobbyInventoryDeck = new LobbyInventoryDeck(this.layoutInventoryDeck);
    },

    initLayoutInventoryCollection: function () {
        this.layoutInventoryCollection = this.scrollView.getChildByName(this._layoutInventoryCollection);
        this.layoutInventoryCollection.setSwallowTouches(false);
        this.lobbyInventoryCollection = new LobbyInventoryCollection(this.layoutInventoryCollection);
    },

    initLayoutMoveCardToDeck: function () {
        this.layoutMoveCardToDeck = this.scrollView.getChildByName(this._layoutMoveCardToDeck);
        this.lobbyMoveCardToDeck = new LobbyMoveCardToDeck(this.layoutMoveCardToDeck);
    },

    initBtnSortCard: function () {
        this.btnSortCard = this.scrollView.getChildByName(this._btnSortCard);
        this.btnSortCard.getChildByName(this._imgArrow).setRotation(this.lobbyInventoryCollection.isSortDecreasingEnergy() ? 180 : 0);
        this.btnSortCard.addClickEventListener(function () {
            this.lobbyInventoryCollection.changeSortOrder();
            this.btnSortCard.getChildByName(this._imgArrow).setRotation(this.lobbyInventoryCollection.isSortDecreasingEnergy() ? 180 : 0);
        }.bind(this));
    },

    onEditDeckStart: function (card) {
        this.scrollView.jumpToTop();
        this.scrollView.setTouchEnabled(false);
        this.btnSortCard.setVisible(false);
        this.lobbyInventoryDeck.onEditDeckStart(card);
        this.lobbyInventoryCollection.onEditDeckStart(card);
        this.lobbyMoveCardToDeck.onEditDeckStart(card);
    },

    onEditDeckFinish: function () {
        this.scrollView.setTouchEnabled(true);
        this.btnSortCard.setVisible(true);
        this.lobbyInventoryDeck.onEditDeckFinish();
        this.lobbyInventoryCollection.onEditDeckFinish();
        this.lobbyMoveCardToDeck.onEditDeckFinish();
        this.updateUI();
    },

    moveCardToDeck: function (card, index) {
        this.lobbyMoveCardToDeck.btnClose.setTouchEnabled(false);

        let outDeckUI = this.lobbyInventoryDeck.lobbyInventoryCardItem[index];
        let inDeckUI = this.lobbyMoveCardToDeck.layoutCard;

        let inDeckPos = outDeckUI.getPosition();
        inDeckPos.x += this.lobbyInventoryDeck.layoutInventory.x;
        inDeckPos.y += this.lobbyInventoryDeck.layoutInventory.y;
        let outDeckPos = inDeckUI.getPosition();
        outDeckPos.x += this.lobbyMoveCardToDeck.layoutMoveCardToDeck.x;
        outDeckPos.y += this.lobbyMoveCardToDeck.layoutMoveCardToDeck.y;
        let dx = outDeckPos.x - inDeckPos.x;
        let dy = outDeckPos.y - inDeckPos.y;

        // Move card Animation
        outDeckUI.setLocalZOrder(gv.user.deck.length);
        outDeckUI.runAction(cc.moveBy(gv.LOBBY.CARDPAGE.SWAP_CARD_DURATION, cc.p(dx, dy)));
        inDeckUI.runAction(cc.moveBy(gv.LOBBY.CARDPAGE.SWAP_CARD_DURATION, cc.p(-dx, -dy)));

        setTimeout( function () {
            outDeckUI.setLocalZOrder(0);
            outDeckUI.x -= dx;
            outDeckUI.y -= dy;
            inDeckUI.x += dx;
            inDeckUI.y += dy;

            card.toDeck(index);
            this.lobbyInventoryDeck.lobbyInventoryCardItem[index].setCard(card);
            this.onEditDeckFinish();
        }.bind(this), Time.secondToMilisec(gv.LOBBY.CARDPAGE.SWAP_CARD_DURATION));
    },

    updateUI: function () {
        this.lobbyInventoryDeck.updateUI();
        this.lobbyInventoryCollection.updateUI();
    },

});