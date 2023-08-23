/**
 * Created by Team 2 - LongLH - GDF 17 on 6/11/2022.
 */


var TowerLogicFrog = TowerLogicAttack.extend({

    ctor: function (card, gameMgr) {
        this._super(card, gameMgr);
    },

    createBullet: function () {
        return new BulletLogicFrog(this);
    },

});