/**
 * Created by Team 2 - LongLH - GDF 17 on 6/11/2022.
 */


var TowerUIBear = TowerUIAttack.extend({

    classBulletUI: BulletUIBear,

    ctor: function (gameMgr) {
        this._super(gameMgr);
        this.initAnimation(resAni.tower.tower_ice_gun);
    },

    getAttackAnimationID: function (frameDirection) {
        return this._super(TOWER.N_ATTACK_DIRECTION / 2 - frameDirection);
    },

    getBulletStartVector: function () {
        let vector = this._super();
        vector.x *= -1;
        vector.y *= -1;
        return vector;
    }

});
