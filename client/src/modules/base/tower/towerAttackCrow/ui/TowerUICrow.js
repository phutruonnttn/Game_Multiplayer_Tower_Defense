/**
 * Created by Team 2 - LongLH - GDF 17 on 6/11/2022.
 */


var TowerUICrow = TowerUIAttack.extend({

    classBulletUI: BulletUICrow,

    ctor: function (gameMgr) {
        this._super(gameMgr);
        this.initAnimation(resAni.tower.tower_wizard);
        this.pose.setScale(1.4);
        this.weapon.setScale(1.4);
    },

});
