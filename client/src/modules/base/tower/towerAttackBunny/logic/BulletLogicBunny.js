/**
 * Created by Team 2 - LongLH - GDF 17 on 6/11/2022.
 */


var BulletLogicBunny = BulletLogicStraight.extend({

    ctor: function (towerLogicAttack) {
        this._super(towerLogicAttack);
        this.speedDownRate = -JsonConfig.getInstance().getBuffTarget(towerLogicAttack.getBulletTargetBuffType()).getEffectValue(towerLogicAttack.getEvolution());
        this.effectDuration = Math.ceil(Utils.round(this.getEffectDuration(towerLogicAttack.getBulletTargetBuffType(), towerLogicAttack.getEvolution(), towerLogicAttack.level) * BATTLE.FRAME_PER_SECOND));
    },

    reachTarget: function () {
        this._super();
        this.getHitMonsters().forEach((monster) => {
            monster.speedDown(this.speedDownRate, 0, this.effectDuration);
        });
        if (this.skillEnable) {
            this.getHitMonsters().forEach((monster) => {
                monster.buffHpDown(this.effectDuration, BATTLE.FRAME_PER_SECOND, 2);
            });
        }
    }

});