/**
 * Created by Team 2 - LongLH - GDF 17 on 29/11/2022.
 */


var TowerUIBuff = TowerUI.extend({

    ctor: function (gameMgr, fileAnimation) {
        this._super(gameMgr);
        this.initAnimation(fileAnimation);
    },

    initAnimation: function (fileAnimation) {
        this._super(fileAnimation);
        this.animation.setAnimation("0", resAniId.tower.aura, true);
    },

    setLogic: function (towerLogic) {
        this._super(towerLogic);
        this.animation.setScale(this.towerLogic.getRange() / BATTLE.SQUARE_SIZE);
    },

    runAnimationEvolution: function () {
        this._super();
        this.animation.setScale(this.towerLogic.getRange() / BATTLE.SQUARE_SIZE);
    },

    runAnimationsAura: function () {
        this.animation.setVisible(true);
    },

    stopAnimationAura: function () {
        this.animation.setVisible(false);
    },

    getFrameIndex: function () {
        return Utils.getInstance().to4digitNum(this.curFrame);
    },

    update: function (dt) {
        this._super(dt);
    },

});