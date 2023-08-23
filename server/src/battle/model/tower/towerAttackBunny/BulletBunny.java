package battle.model.tower.towerAttackBunny;

import battle.model.shootableMonster.Monster;
import battle.model.tower.towerAttack.BulletStraight;
import battle.model.tower.towerAttack.TowerAttack;
import config.battle.BattleConfig;
import readjson.JsonConfig;
import util.battle.BattleUtils;

public class BulletBunny extends BulletStraight {

    private double speedDownRate;

    protected BulletBunny(TowerAttack towerAttack) {
        super(towerAttack);
        this.speedDownRate = -JsonConfig.getInstance().getBuffTarget(towerAttack.getBulletTargetBuffType()).getEffectValue(towerAttack.getEvolution());
        this.effectDuration = (int) Math.ceil(BattleUtils.round(this.getEffectDuration(towerAttack.getBulletTargetBuffType(), towerAttack.getEvolution(), towerAttack.level) * BattleConfig.FRAME_PER_SECOND));
    }

    @Override
    protected void reachTarget() {
        super.reachTarget();
        this.getHitMonsters().forEach((Monster monster) -> {
            monster.speedDown(this.speedDownRate, 0, (int) this.effectDuration);
        });
        if (this.skillEnable) {
            this.getHitMonsters().forEach((Monster monster) -> {
                monster.buffHpDown((int) this.effectDuration, BattleConfig.FRAME_PER_SECOND, 2);
            });
        }
    }
}
