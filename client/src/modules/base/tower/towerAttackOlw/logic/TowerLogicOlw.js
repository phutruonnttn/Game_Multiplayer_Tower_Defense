/**
 * Created by Team 2 - LongLH - GDF 17 on 15/11/2022.
 */


var TowerLogicOlw = TowerLogicAttack.extend({

    ctor: function (card, gameMgr) {
        this._super(card, gameMgr);
    },

    createBullet: function () {
        return new BulletLogicOlw(this);
    },

});