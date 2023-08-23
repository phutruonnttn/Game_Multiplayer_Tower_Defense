/**
 * Created by Team 2 - LongLH - GDF 17 on 9/11/2022.
 */

var RewardFromChestUI = cc.Layer.extend({

    _layoutOpenChest: "layoutOpenChest",
    _btnConfirm: "btnConfirm",
    _btnCard: "btnCard",
    _imgCard: "imgCard",
    _layoutGold: "layoutGold",
    _txtAmount: "txtAmount",

    _layoutNode: "layoutNode",
    _nodeStartFirstRow: "nodeStartFirstRow",
    _nodeEndFirstRow: "nodeEndFirstRow",
    _nodeOx: "nodeOx",
    _nodeOy: "nodeOy",
    _nodeAppear: "nodeAppear",

    ctor: function (listReward) {
        this._super();
        this.listReward = listReward;
        this.initOpenChestUI();
    },

    initOpenChestUI: function () {
        if (this.listReward.length === 0)
            return;
        this.sceneOpenChest = ccs.load(res.open_chest_ui, "").node;
        this.initLayoutOpenChest();
        this.initPrizePosition();
        this.initBtnConfirm();
        this.initBtnCard();
        this.initLayoutGold();
        this.initAnimation();
        this.showReward();
    },

    initAnimation: function () {
        this.animation = fr.createAtlasAnimation(resAni.chest_open);
        this.addChild(this.animation);
        this.animation.setPositionX(cc.winSize.width/2);
        this.animation.setAnimationListener(this, this.animationStateEvent);
    },

    initPrizePosition: function () {
        this.layoutNode = this.sceneOpenChest.getChildByName(this._layoutNode);

        let nodeStartFirstRow = this.layoutNode.getChildByName(this._nodeStartFirstRow);
        let nodeEndFirstRow = this.layoutNode.getChildByName(this._nodeEndFirstRow);
        let nodeOx = this.layoutNode.getChildByName(this._nodeOx);
        let nodeOy = this.layoutNode.getChildByName(this._nodeOy);
        let nodeAppear = this.layoutNode.getChildByName(this._nodeAppear);

        this.prizePos = {};
        this.prizePos.origin = nodeStartFirstRow.getPosition();
        this.prizePos.dx = nodeOx.x - nodeStartFirstRow.x;
        this.prizePos.dy = nodeOy.y - nodeStartFirstRow.y;
        this.prizePos.nCol = Math.ceil((nodeEndFirstRow.x - nodeStartFirstRow.x) / this.prizePos.dx) + 1;
        this.prizePos.appear = nodeAppear.getPosition();
    },

    initLayoutOpenChest: function () {
        this.layoutOpenChest = this.sceneOpenChest.getChildByName(this._layoutOpenChest).clone();
        this.addChild(this.layoutOpenChest);
    },

    initBtnConfirm: function () {
        this.btnConfirm = this.layoutOpenChest.getChildByName(this._btnConfirm);
        this.btnConfirm.addClickEventListener(this.destroy.bind(this));
        this.btnConfirm.setVisible(false);
    },

    initBtnCard: function () {
        this.btnCard = this.layoutOpenChest.getChildByName(this._btnCard);
        this.btnCard.setVisible(false);
    },

    initLayoutGold: function () {
        this.layoutGold = this.layoutOpenChest.getChildByName(this._layoutGold);
        this.layoutGold.setVisible(false);
    },

    animationStateEvent: function(obj, trackIndex, type, event, loopCount) {
        if (type === sp.ANIMATION_EVENT_TYPE.COMPLETE)
            this.showCurPrize();
    },

    getPrizePositionOnScreen: function (idx) {
        let x = this.prizePos.origin.x + (idx % this.prizePos.nCol) * this.prizePos.dx;
        let y = this.prizePos.origin.y + Math.floor((this.listRewardUI.length - idx - 1) / this.prizePos.nCol) * this.prizePos.dy;
        return cc.p(x, y);
    },

    showReward: function () {
        this.curRewardID = 0;
        this.animation.setAnimation(0, resAniId.chest_open.init, 0);
    },

    toNextPrize: function () {
        ++this.curRewardID;
        if (this.curRewardID >= this.listReward.length)
            this.btnConfirm.setVisible(true);
        else
            this.animation.setAnimation(0, resAniId.chest_open.opening, 0);
    },

    showCurPrize: function () {
        if (this.curRewardID < 0 || this.curRewardID >= this.listReward.length)
            return
        let prize = this.listReward[this.curRewardID];
        switch (prize.type) {
            case CHEST.REWARD.FRAGMENT:
                this.showFragmentPrize(prize);
                break;
            case CHEST.REWARD.GOLD:
                this.showGoldPrize(prize);
                break;
            default:
                break;
        }
        setTimeout(function () {
            this.addPrizeAnimation(this.lastestPrize);
            this.toNextPrize();
        }.bind(this), Time.secondToMilisec(gv.LOBBY.OPEN_CHEST_DELAY));
    },

    showFragmentPrize: function (reward) {
        let prize = this.btnCard.clone();
        prize.getChildByName(this._imgCard).loadTexture(res.card.image[reward.cardId]);
        prize.getChildByName(this._txtAmount).setString("x"+reward.amount);
        prize.addClickEventListener(function () {
            Popup.create(new PopupCardInfo(gv.user.listCard[reward.cardId]));
        });
        this.showPrize(prize);
    },

    showGoldPrize: function (reward) {
        let prize = this.layoutGold.clone();
        prize.getChildByName(this._txtAmount).setString("x"+reward.amount);
        this.showPrize(prize);
    },

    showPrize: function (prize) {
        this.lastestPrize = prize;
        this.addChild(this.lastestPrize);
        this.lastestPrize.setVisible(true);
        this.lastestPrize.setPosition(this.prizePos.appear);
    },

    addPrizeAnimation: function (prize) {
        this.listRewardUI = this.listRewardUI || [];
        this.listRewardUI.push(prize);
        this.listRewardUI.forEach(function (value, index) {
            value.runAction(cc.moveTo(gv.LOBBY.OPEN_CHEST_DELAY, this.getPrizePositionOnScreen(index)));
        }.bind(this));
    },

    destroy: function () {
        this.removeFromParent(true);
    }

});

RewardFromChestUI.run = function (listRewardFromChest) {
    gv.lobby.addChild(new RewardFromChestUI(listRewardFromChest));
}
