/**
 * Created by Team 2 - LongLH - GDF 17 on 15/11/2022.
 */


var BulletLogicOlw = BulletLogicChasing.extend({

    ctor: function (towerLogicAttack) {
        this._super(towerLogicAttack);
        this.effectDuration = Math.ceil(Utils.round(0.2 * BATTLE.FRAME_PER_SECOND));
    },

    reachTarget: function () {
        this._super();
        // Làm choáng
        if (this.target instanceof LogicMonster && this.skillEnable && !this.target.isDied && this.target.canTarget()) {
            this.target.stunMonster(this.effectDuration);
        }
    }

});