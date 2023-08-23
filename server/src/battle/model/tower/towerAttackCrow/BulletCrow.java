package battle.model.tower.towerAttackCrow;

import battle.model.shootableMonster.Monster;
import battle.model.tower.towerAttack.BulletStraight;
import battle.model.tower.towerAttack.TowerAttack;

import java.util.ArrayList;

public class BulletCrow extends BulletStraight {

    protected BulletCrow(TowerAttack towerAttack) {
        super(towerAttack);
    }

    protected void reachTarget() {
        super.reachTarget();
        if (this.skillEnable) {
            ArrayList<Monster> listMonster = this.getHitMonsters();
            if (listMonster.size() >= 5) {
                listMonster.forEach((Monster monster) -> {
                    monster.decreaseHP(10);
                });
            }
        }
    }

}
