/**
 * Created by Team 2 - LongLH - GDF 17 on 6/11/2022.
 */


var BulletUICrow = BulletUIStraight.extend({

    ctor: function (bulletLogic) {
        this._super(bulletLogic);
        this.initAnimation(resAni.tower.tower_wizard);
    },

});