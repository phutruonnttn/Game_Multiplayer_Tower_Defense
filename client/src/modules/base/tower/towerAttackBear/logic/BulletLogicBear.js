/**
 * Created by Team 2 - LongLH - GDF 17 on 6/11/2022.
 */


var BulletLogicBear = BulletLogicChasing.extend({

    ctor: function (towerLogicAttack) {
        this._super(towerLogicAttack);
        this.effectDuration = Math.ceil(Utils.round(this.getEffectDuration(towerLogicAttack.getBulletTargetBuffType(), towerLogicAttack.evolution, towerLogicAttack.level) * BATTLE.FRAME_PER_SECOND));
    },

    reachTarget: function () {
        this._super();
        // Đóng băng
        if (this.target instanceof LogicMonster && !this.target.isDied && this.target.canTarget()) {
            this.target.freezeMonster(this.effectDuration);
        }
        // Tăng sát thương nhận vào
        if (this.target instanceof LogicMonster && this.skillEnable && !this.target.isDied && this.target.canTarget()) {
            this.target.buffTakenDamageUp(0.5, this.effectDuration);
        }
    }

});