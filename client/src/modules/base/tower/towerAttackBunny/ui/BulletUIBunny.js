/**
 * Created by Team 2 - LongLH - GDF 17 on 6/11/2022.
 */


var BulletUIBunny = BulletUIStraight.extend({

    ctor: function (bulletLogic) {
        this._super(bulletLogic);
        this.initAnimation(resAni.tower.tower_oil_gun);
    },

    reachTarget: function () {
        this._super();
        this.bulletLogic.getHitMonsters().forEach((monster) => {
            monster.addOilEffect();
        });
    }

});