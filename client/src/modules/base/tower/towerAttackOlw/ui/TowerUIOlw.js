/**
 * Created by Team 2 - LongLH - GDF 17 on 15/11/2022.
 */


var TowerUIOlw = TowerUIAttack.extend({

    classBulletUI: BulletUIOlw,

    ctor: function (gameMgr) {
        this._super(gameMgr);
        this.initAnimation(resAni.tower.tower_cannon_shoot);
    },

});
