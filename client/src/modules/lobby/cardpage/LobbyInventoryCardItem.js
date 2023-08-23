/**
 * Created by Team 2 - LongLH - GDF 17 on 8/11/2022.
 */


var LobbyInventoryCardItem = cc.Node.extend({

    _btnCard: "btnCard",
    _imgBackground: "imgBackground",
    _imgBorder: "imgBorder",
    _imgCard: "imgCard",
    _txtLevel: "txtLevel",
    _txtEnergy: "txtEnergy",
    _barProgress: "barProgress",
    _txtProgress: "txtProgress",

    ctor: function (card) {
        this._super();
        this.initLobbyInventoryCardItem();
        this.setCard(card);
    },

    setCard: function (card) {
        this.card = card;
        this.updateUI();
    },

    initLobbyInventoryCardItem: function () {
        this.inventoryCardUISource = ccs.load(res.card_ui, "").node;
        this.btnCard = this.inventoryCardUISource.getChildByName(this._btnCard).clone();
        this.btnCard.setPosition(cc.p(0,0));
        this.btnCard.setSwallowTouches(false);
        this.addChild(this.btnCard);

        this.initClickEvent();
        this.initBackground();
        this.initEnergy();
        this.initLevel();
        this.initCardImage();
        this.initProgress();
    },

    initClickEvent: function () {
        this.btnCard.addTouchEventListener(function (button, eventType) {
            switch (eventType) {
                case (ccui.Widget.TOUCH_BEGAN):
                    this.startTouch = Date.now();
                    break;
                case (ccui.Widget.TOUCH_ENDED):
                    if (Date.now() - this.startTouch <= gv.LOBBY.CLICK_TOUCH_MAX_DURATION)
                        Popup.create(new LobbyInventoryCardPopup(this.card));
                    break;
                default:
                    break;
            }
        }.bind(this));
    },

    initBackground: function () {
        this.imgBackground = this.btnCard.getChildByName(this._imgBackground);
        this.imgBorder = this.btnCard.getChildByName(this._imgBorder);
    },

    initEnergy: function () {
        this.txtEnergy = this.btnCard.getChildByName(this._txtEnergy);
    },

    initLevel: function () {
        this.txtLevel = this.btnCard.getChildByName(this._txtLevel);
    },

    initCardImage: function () {
        this.imgCard = this.btnCard.getChildByName(this._imgCard);
    },

    initProgress: function () {
        this.barProgress = this.btnCard.getChildByName(this._barProgress);
        this.txtProgress = this.btnCard.getChildByName(this._txtProgress);
        this.txtProgress.setLocalZOrder(1);

        this.animationProgress = fr.createAtlasAnimation(resAni.card_upgrade_ready);
        this.btnCard.addChild(this.animationProgress);
        this.animationProgress.setPosition(this.barProgress.getPosition());
        this.animationProgress.setAnimation(0, resAniId.card_upgrade_ready, true);
    },

    updateBackground: function () {
        this.imgBackground.loadTexture(res.card.background[this.card.getRank()].background);
        this.imgBorder.loadTexture(res.card.background[this.card.getRank()].border);
    },

    updateEnergy: function () {
        this.txtEnergy.setString(this.card.getEnergy());
    },

    updateLevel: function () {
        this.txtLevel.setString("Lv. "+this.card.level);
    },

    updateCardImage: function () {
        this.imgCard.loadTexture(res.card.image[this.card.id]);
    },

    updateTxtProgress: function () {
        this.txtProgress.setString(this.card.getProgressStr());
    },

    updateAnimationProgress: function () {
        this.animationProgress.setVisible(this.card.canUpgrade());
    },

    updateBarProgress: function () {
        this.barProgress.setPercent(this.card.getProgress());
        if (this.card.enoughFragmentForUpgrade())
            this.barProgress.loadTexture(res.card.process.max);
        else
            this.barProgress.loadTexture(res.card.process.default);
    },

    updateProgress: function () {
        this.updateTxtProgress();
        this.updateAnimationProgress();
        this.updateBarProgress();
    },

    updateUI: function () {
        this.updateBackground();
        this.updateEnergy();
        this.updateLevel();
        this.updateCardImage();
        this.updateProgress();
    },

});