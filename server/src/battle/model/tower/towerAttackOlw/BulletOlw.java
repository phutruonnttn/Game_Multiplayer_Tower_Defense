package battle.model.tower.towerAttackOlw;

import battle.model.shootableMonster.Monster;
import battle.model.tower.towerAttack.BulletChasing;
import battle.model.tower.towerAttack.TowerAttack;
import config.battle.BattleConfig;
import util.battle.BattleUtils;

public class BulletOlw extends BulletChasing {

    protected BulletOlw(TowerAttack towerAttack) {
        super(towerAttack);
        this.effectDuration = Math.ceil(BattleUtils.round(0.2 * BattleConfig.FRAME_PER_SECOND));
    }

    @Override
    protected void reachTarget() {
        super.reachTarget();
        // Làm choáng
        if (this.target instanceof Monster && this.skillEnable && !this.target.isDied && this.target.canTarget()) {
            ((Monster) this.target).stunMonster((int) this.effectDuration);
        }
    }
}
