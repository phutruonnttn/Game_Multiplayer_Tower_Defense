/**
 * Created by Team 2 - LongLH - GDF 17 on 25/11/2022.
 */


var TimerTower = cc.Node.extend({

    ctor: function () {
        this._super();

        this.finished = false;
        this.timeCounter = 0;

        let timerBackground = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(res.battle.battle_timer_background_png));
        this.progressTimer = new cc.ProgressTimer(new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(res.battle.battle_timer_png)));
        this.progressTimer.setType(cc.ProgressTimer.TYPE_RADIAL);
        this.progressTimer.setPercentage(0);

        this.addChild(timerBackground);
        this.addChild(this.progressTimer);
        this.setScale(0.75);
    },

    update: function (dt) {
        this.timeCounter += dt;
        this.progressTimer.setPercentage(this.timeCounter * 100);
        if (this.timeCounter >= 1)
            this.fakeDestroy();
    },

    reset: function () {
        this.finished = false;
        this.timeCounter = 0;
        this.setVisible(true);
    },

    fakeDestroy: function () {
        this.finished = true;
        this.setVisible(false);
    },

});