package battle.model.tower.towerAttackBear;

import battle.model.shootableMonster.Monster;
import battle.model.tower.towerAttack.BulletChasing;
import battle.model.tower.towerAttack.TowerAttack;
import config.battle.BattleConfig;
import util.battle.BattleUtils;

public class BulletBear extends BulletChasing {

    private double freezeDuration;

    protected BulletBear(TowerAttack towerAttack) {
        super(towerAttack);
        this.effectDuration = (int) Math.ceil(BattleUtils.round(this.getEffectDuration(towerAttack.getBulletTargetBuffType(), towerAttack.evolution, towerAttack.level) * BattleConfig.FRAME_PER_SECOND));
    }

    @Override
    protected void reachTarget() {
        super.reachTarget();
        // Đóng băng
        if (this.target instanceof Monster && !this.target.isDied && this.target.canTarget()) {
            ((Monster) this.target).freezeMonster((int) this.effectDuration);
        }
        // Tăng sát thương nhận vào
        if (this.target instanceof Monster && this.skillEnable && !this.target.isDied && this.target.canTarget()) {
            ((Monster) this.target).increasedDamageTaken(0.5, (int) this.effectDuration);
        }
    }
}
